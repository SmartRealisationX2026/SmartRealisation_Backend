import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/frameworks/data-services/prisma/prisma.service';
import { RedisService } from 'src/frameworks/cache/redis.service';

type PharmacySearchResult = {
  pharmacyId: string;
  pharmacyName: string;
  distanceKm: number;
  quantityInStock: number;
  sellingPriceFcfa: number;
  latitude: number;
  longitude: number;
};

@Injectable()
export class SearchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async searchPharmacies(params: {
    medication: string;
    latitude: number;
    longitude: number;
    radiusKm: number;
  }): Promise<PharmacySearchResult[]> {
    const { medication, latitude, longitude, radiusKm } = params;
    if (!medication || medication.trim().length < 2) {
      throw new BadRequestException('medication name must be at least 2 characters');
    }
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      throw new BadRequestException('latitude/longitude are required');
    }
    const radius = radiusKm > 0 ? radiusKm : 10;

    // Resolve medication name to UUID
    const medicationRecord = await this.prisma.medication.findFirst({
      where: {
        OR: [
          { commercialName: { equals: medication, mode: 'insensitive' } },
          { dciName: { equals: medication, mode: 'insensitive' } }
        ]
      },
      select: { id: true }
    });

    if (!medicationRecord) {
      throw new BadRequestException(`Medication "${medication}" not found`);
    }

    const medicationId = medicationRecord.id;
    const cacheKey = `pharmacy:search:${medicationId}:${latitude}:${longitude}:${radius}`;
    const cached = await this.redis.get<PharmacySearchResult[]>(cacheKey);
    if (cached) return cached;

    const results = await this.prisma.$queryRaw<PharmacySearchResult[]>`
      WITH user_point AS (
        SELECT ST_SetSRID(ST_MakePoint(${longitude}::double precision, ${latitude}::double precision), 4326) AS geom
      )
      SELECT
        p.id AS "pharmacyId",
        p.name AS "pharmacyName",
        ii.quantity_in_stock AS "quantityInStock",
        ii.selling_price_fcfa AS "sellingPriceFcfa",
        a.latitude::double precision AS "latitude",
        a.longitude::double precision AS "longitude",
        (ST_Distance(
          ST_SetSRID(ST_MakePoint(a.longitude::double precision, a.latitude::double precision), 4326)::geography,
          (SELECT geom FROM user_point)::geography
        ) / 1000.0) AS "distanceKm"
      FROM inventory_items ii
      JOIN pharmacies p ON p.id = ii.pharmacy_id
      JOIN addresses a ON a.id = p.address_id
      WHERE
        ii.medication_id = ${medicationId}
        AND ii.quantity_in_stock > 0
        AND p.is_verified = true
        AND ST_DWithin(
          ST_SetSRID(ST_MakePoint(a.longitude::double precision, a.latitude::double precision), 4326)::geography,
          (SELECT geom FROM user_point)::geography,
          ${radius * 1000}
        )
      ORDER BY "distanceKm" ASC
      LIMIT 50;
    `;

    await this.redis.set(cacheKey, results, 300);
    return results;
  }
}
