import { CreateDistrictDto, UpdateDistrictDto } from '../dtos';
import { District } from '../entities';

export abstract class DistrictRepository {
  abstract findOne(id: string): Promise<District | null>;
  abstract create(district: CreateDistrictDto): Promise<District>;
  abstract update(id: string, district: UpdateDistrictDto): Promise<District>;
  abstract delete(id: string): Promise<void>;
  abstract findAll(): Promise<District[]>;
  abstract findByCity(cityId: string): Promise<District[]>;
  abstract findByName(name: string): Promise<District[]>;
}

