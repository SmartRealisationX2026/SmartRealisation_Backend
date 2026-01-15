import { Injectable } from '@nestjs/common';
import { User } from 'src/core/entities';
import { CreateUserDto, UpdateUserDto } from 'src/core/dtos';
import { UserRepository } from '../../core/repositories';
import { UserRole } from 'src/generated/prisma';

@Injectable()
export class UserFactoryService implements UserRepository {
  constructor(private readonly userCaseRepository: UserRepository) {}

  async findOne(id: string): Promise<User | null> {
    return await this.userCaseRepository.findOne(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userCaseRepository.findByEmail(email);
  }

  async create(user: CreateUserDto): Promise<User> {
    return this.userCaseRepository.create(user);
  }

  async update(id: string, user: UpdateUserDto): Promise<User> {
    return this.userCaseRepository.update(id, user);
  }

  async delete(id: string): Promise<void> {
    return this.userCaseRepository.delete(id);
  }

  async findAll(): Promise<User[]> {
    return this.userCaseRepository.findAll();
  }

  async findByRole(role: UserRole): Promise<User[]> {
    return this.userCaseRepository.findByRole(role);
  }

  async findActiveUsers(): Promise<User[]> {
    return this.userCaseRepository.findActiveUsers();
  }
}
