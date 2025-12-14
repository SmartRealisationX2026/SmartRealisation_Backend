import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../core/repositories';
import { CreateUserDto, UpdateUserDto, UserReponseDto } from 'src/core/dtos';
import { User } from 'src/core/entities';
import { PrismaService } from '../../../frameworks/data-services/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '@prisma/client';

@Injectable()
export class UserCaseRepository implements UserRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async findOne(id: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: UserReponseDto,
    });
    if (!user) return null;
    return user as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      select: UserReponseDto,
    });
    if (!user) return null;
    return user as User;
  }

  async create(userDto: CreateUserDto): Promise<User> {
    // Hasher le mot de passe si fourni
    let passwordHash = userDto.passwordHash;
    if (passwordHash) {
      const saltRounds = Number(this.configService.get("ENCRYPT_PASSWORD")) || 10;
      passwordHash = await bcrypt.hash(passwordHash, saltRounds);
    }

    const user = await this.prismaService.user.create({
      data: {
        email: userDto.email,
        passwordHash: passwordHash,
        role: userDto.role,
        fullName: userDto.fullName,
        phone: userDto.phone,
        preferredLanguage: userDto.preferredLanguage,
        isActive: true, // Par défaut actif, peut être modifié selon les besoins
      },
      select: UserReponseDto,
    });
    return user as User;
  }

  async update(id: string, userDto: UpdateUserDto): Promise<User> {
    const updateData: any = {};

    // Mapper les champs du DTO vers le schéma Prisma
    if (userDto.email !== undefined) updateData.email = userDto.email;
    if (userDto.fullName !== undefined) updateData.fullName = userDto.fullName;
    if (userDto.role !== undefined) updateData.role = userDto.role;
    if (userDto.phone !== undefined) updateData.phone = userDto.phone;
    if (userDto.preferredLanguage !== undefined) updateData.preferredLanguage = userDto.preferredLanguage;
    if (userDto.passwordHash !== undefined) {
      // Hasher le nouveau mot de passe
      const saltRounds = Number(this.configService.get("ENCRYPT_PASSWORD")) || 10;
      updateData.passwordHash = await bcrypt.hash(userDto.passwordHash, saltRounds);
    }

    // Utiliser l'id du paramètre ou celui du DTO
    const userId = userDto.id || id;

    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: updateData,
      select: UserReponseDto,
    });
    return user as User;
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.user.delete({
      where: { id },
    });
  }

  async findAll(): Promise<User[]> {
    const users = await this.prismaService.user.findMany({
      select: UserReponseDto,
    });
    return users as User[];
  }

  async findByRole(role: UserRole): Promise<User[]> {
    const users = await this.prismaService.user.findMany({
      where: { role },
      select: UserReponseDto,
    });
    return users as User[];
  }

  async findActiveUsers(): Promise<User[]> {
    const users = await this.prismaService.user.findMany({
      where: { isActive: true },
      select: UserReponseDto,
    });
    return users as User[];
  }
}
