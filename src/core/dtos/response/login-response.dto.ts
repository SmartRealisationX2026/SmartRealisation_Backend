import { User } from '../../entities';
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ description: 'Utilisateur connecté', type: Object })
  user: User;

  @ApiProperty({ description: 'Token JWT d\'accès', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;
}
