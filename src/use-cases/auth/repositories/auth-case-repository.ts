import { PrismaService } from '../../../frameworks/data-services/prisma/prisma.service';
import { User } from '../../../core/entities';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../../../core/dtos';
import * as bcrypt from 'bcrypt';
import * as speakeasy from "speakeasy";
import { ConfigService } from '@nestjs/config';
import { MailerService } from '../../../frameworks/mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from '../../../core/repositories';

@Injectable()
export class AuthCaseRepository implements AuthRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly nodemailerService : MailerService,
    private readonly jwtService : JwtService,
  ) {}

  async login(email: string, password: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      throw new NotFoundException('Email or password is incorrect');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      throw new NotFoundException('Email or password is incorrect');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is not activated');
    }

    // Retourner l'utilisateur sans le passwordHash
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async register(userDto: CreateUserDto): Promise<void> {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: userDto.email }
    });
    
    if (existingUser) {
      throw new UnauthorizedException("Email already exists");
    }

    const saltRounds = Number(this.configService.get("ENCRYPT_PASSWORD")) || 10;
    const passwordHash = await bcrypt.hash(userDto.passwordHash, saltRounds);

    await this.prismaService.user.create({
      data: {
        email: userDto.email,
        passwordHash: passwordHash,
        role: userDto.role,
        fullName: userDto.fullName,
        phone: userDto.phone,
        preferredLanguage: userDto.preferredLanguage,
        isActive: false, // L'utilisateur doit vérifier son email avant d'être actif
      }
    });

    const secret = this.configService.get("OTP_ENC");
    const otp = speakeasy.totp({
      secret: secret,
      encoding: 'base32',
      digits: 6,
      step: 10 * 60
    });
    
    console.log(`OTP for ${userDto.email}: ${otp}`);
    await this.nodemailerService.sendSignupConfirmation(userDto.email, otp);
  }

  async verifyauth(otp: string, id: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: { id }
    });
    
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const secret = this.configService.get("OTP_ENC");
    const otpValidates = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      digits: 6,
      step: 10 * 60,
      token: otp,
    });

    if (!otpValidates) {
      throw new UnauthorizedException("Invalid OTP");
    }

    // Générer le token JWT
    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(
      payload,
      {
        expiresIn: '2h',
        secret: this.configService.get("JWT_SECRET")
      }
    );

    // Activer l'utilisateur (le token n'est plus stocké en base)
    const userVerified = await this.prismaService.user.update({
      where: { id },
      data: { isActive: true }
    });

    // Retourner l'utilisateur sans le passwordHash
    const { passwordHash: _, ...userWithoutPassword } = userVerified;
    return userWithoutPassword as User;
  }
}
