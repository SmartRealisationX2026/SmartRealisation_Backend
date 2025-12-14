import { CreateAddressDto, UpdateAddressDto } from '../dtos';
import { Address } from '../entities';

export abstract class AddressRepository {
  abstract findOne(id: string): Promise<Address | null>;
  abstract create(address: CreateAddressDto): Promise<Address>;
  abstract update(id: string, address: UpdateAddressDto): Promise<Address>;
  abstract delete(id: string): Promise<void>;
  abstract findAll(): Promise<Address[]>;
  abstract findByCity(cityId: string): Promise<Address[]>;
  abstract findByDistrict(districtId: string): Promise<Address[]>;
  abstract findByCoordinates(
    latitude: number,
    longitude: number,
    radiusKm?: number,
  ): Promise<Address[]>;
}

