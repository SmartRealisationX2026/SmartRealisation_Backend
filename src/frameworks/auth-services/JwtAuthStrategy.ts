
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../data-services/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

type Payload = {
  sub : string,
  email : string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService : ConfigService,
    private readonly prismaService : PrismaService,
  ) {
    const secret = configService.get('JWT_SECRET');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: Payload) {
    const user = await this.prismaService.user.findUnique({
      where: { email: payload.email }
    });
    if (!user) throw new UnauthorizedException("Unauthorized");
    if (!user.isActive) throw new UnauthorizedException("Account is not activated");
    
    // Retourner l'utilisateur sans le passwordHash
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
