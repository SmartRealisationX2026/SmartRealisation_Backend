import { CreateUserDto, UpdateUserDto } from '../dtos';
import { User } from '../entities';
import { UserRole } from 'src/generated/prisma';

export abstract class UserRepository {
  abstract findOne(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract create(user: CreateUserDto): Promise<User>;
  abstract update(id: string, user: UpdateUserDto): Promise<User>;
  abstract delete(id: string): Promise<void>;
  abstract findAll(): Promise<User[]>;
  abstract findByRole(role: UserRole): Promise<User[]>;
  abstract findActiveUsers(): Promise<User[]>;
}
