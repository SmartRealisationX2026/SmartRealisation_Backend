import { CreateSearchDto, UpdateSearchDto } from '../dtos';
import { Search } from '../entities';

export abstract class SearchRepository {
  abstract findOne(id: string): Promise<Search | null>;
  abstract create(search: CreateSearchDto): Promise<Search>;
  abstract update(id: string, search: UpdateSearchDto): Promise<Search>;
  abstract delete(id: string): Promise<void>;
  abstract findAll(): Promise<Search[]>;
  abstract findByUser(userId: string): Promise<Search[]>;
  abstract findByMedication(medicationId: string): Promise<Search[]>;
  abstract findRecent(limit?: number): Promise<Search[]>;
  abstract findSuccessfulSearches(): Promise<Search[]>;
  abstract getSearchStatistics(
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    total: number;
    successful: number;
    byMedication: Record<string, number>;
  }>;
}

