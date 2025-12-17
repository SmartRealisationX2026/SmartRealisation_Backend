import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/core/dtos';
import { User } from 'src/core/entities';
import { AuthRepository } from '../../core/repositories';

@Injectable()
export class AuthCaseService implements AuthRepository {
  constructor(private readonly authCaseRepository: AuthRepository) {}

  async login(email: string, password: string): Promise<{access_token: string, user: User} | null> {
    return await this.authCaseRepository.login(email, password);
  }
  async register(user: CreateUserDto): Promise<void> {
    return await this.authCaseRepository.register(user);
  }
  async verifyauth(otp: string, id: string): Promise<User | null> {
    return await this.authCaseRepository.verifyauth(otp, id);
  }
}
