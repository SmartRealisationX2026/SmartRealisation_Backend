import { CreateCityDto, UpdateCityDto } from '../dtos';
import { City } from '../entities';

export abstract class CityRepository {
  abstract findOne(id: string): Promise<City | null>;
  abstract create(city: CreateCityDto): Promise<City>;
  abstract update(id: string, city: UpdateCityDto): Promise<City>;
  abstract delete(id: string): Promise<void>;
  abstract findAll(): Promise<City[]>;
  abstract findByRegion(region: string): Promise<City[]>;
  abstract findByName(name: string): Promise<City[]>;
}

