import { CreateUserDto } from '../dtos';
import { User } from '../entities';

export abstract class AuthRepository {
  abstract login(email: string, password: string): Promise<User | null>;
  abstract register(user: CreateUserDto): Promise<void>;
  abstract verifyauth(otp: string, id : string): Promise<User | null>;
}
