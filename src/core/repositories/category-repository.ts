import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import { Category } from '../entities';

export abstract class CategoryRepository {
  abstract findOne(id: string): Promise<Category | null>;
  abstract findByCode(code: string): Promise<Category | null>;
  abstract create(category: CreateCategoryDto): Promise<Category>;
  abstract update(id: string, category: UpdateCategoryDto): Promise<Category>;
  abstract delete(id: string): Promise<void>;
  abstract findAll(): Promise<Category[]>;
  abstract findByLevel(level: number): Promise<Category[]>;
  abstract findByParent(parentId: string): Promise<Category[]>;
  abstract findRootCategories(): Promise<Category[]>;
  abstract findChildren(categoryId: string): Promise<Category[]>;
}

