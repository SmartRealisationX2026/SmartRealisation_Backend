import { CreatePharmacyDto, UpdatePharmacyDto } from '../dtos';
import { Pharmacy } from '../entities';

export abstract class PharmacyRepository {
  abstract findOne(id: string): Promise<Pharmacy | null>;
  abstract create(pharmacy: CreatePharmacyDto): Promise<Pharmacy>;
  abstract update(id: string, pharmacy: UpdatePharmacyDto): Promise<Pharmacy>;
  abstract delete(id: string): Promise<void>;
  abstract findAll(): Promise<Pharmacy[]>;
  abstract findByOwner(ownerId: string): Promise<Pharmacy[]>;
  abstract findVerified(): Promise<Pharmacy[]>;
  abstract findUnverified(): Promise<Pharmacy[]>;
  abstract findByLocation(
    latitude: number,
    longitude: number,
    radiusKm: number,
  ): Promise<Pharmacy[]>;
  abstract find24_7(): Promise<Pharmacy[]>;
  abstract findOpenNow(): Promise<Pharmacy[]>;
  abstract findByLicenseNumber(licenseNumber: string): Promise<Pharmacy | null>;
  abstract verifyPharmacy(id: string): Promise<Pharmacy>;
}

