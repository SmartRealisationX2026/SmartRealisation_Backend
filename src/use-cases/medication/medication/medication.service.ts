import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/frameworks/data-services/prisma/prisma.service';
import { RedisService } from 'src/frameworks/cache/redis.service';

type MedicationSuggestion = {
  id: string;
  commercialName: string;
  dciName: string | null;
  dosageStrength: string;
  dosageUnit: string;
};

@Injectable()
export class MedicationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async autocomplete(query: string, limit = 10): Promise<MedicationSuggestion[]> {
    const trimmed = query?.trim();
    if (!trimmed || trimmed.length < 2) {
      throw new BadRequestException('Query must have at least 2 characters');
    }

    const cacheKey = `medication:autocomplete:${trimmed.toLowerCase()}:${limit}`;
    const cached = await this.redis.get<MedicationSuggestion[]>(cacheKey);
    if (cached) return cached;

    const suggestions = await this.prisma.$queryRaw<MedicationSuggestion[]>`
      SELECT
        id,
        commercial_name AS "commercialName",
        dci_name AS "dciName",
        dosage_strength AS "dosageStrength",
        dosage_unit AS "dosageUnit"
      FROM "medications"
      WHERE
        similarity(commercial_name, ${trimmed}) > 0.2
        OR similarity(COALESCE(dci_name, ''), ${trimmed}) > 0.2
        OR commercial_name ILIKE ${'%' + trimmed + '%'}
        OR COALESCE(dci_name, '') ILIKE ${'%' + trimmed + '%'}
      ORDER BY
        GREATEST(
          similarity(commercial_name, ${trimmed}),
          similarity(COALESCE(dci_name, ''), ${trimmed})
        ) DESC
      LIMIT ${limit};
    `;

    await this.redis.set(cacheKey, suggestions, 300);
    return suggestions;
  }
}
