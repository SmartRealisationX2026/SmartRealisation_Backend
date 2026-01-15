import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
  Param,
  Body,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UserRepository } from '../../core/repositories';
import { CreateUserDto, UpdateUserDto } from 'src/core/dtos';
import { User } from 'src/core/entities';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../frameworks/auth-services/JwtAuthGuard';
import { UserFactoryService } from '../../use-cases/user/user.service';
import { UserRole } from 'src/generated/prisma';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/user')
export class UserController implements UserRepository {
  constructor(private readonly userFactoryService: UserFactoryService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les utilisateurs' })
  @ApiResponse({
    status: 200,
    description: 'Liste des utilisateurs récupérée avec succès',
    type: [User],
  })
  async findAll(): Promise<User[]> {
    return this.userFactoryService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Récupérer tous les utilisateurs actifs' })
  @ApiResponse({
    status: 200,
    description: 'Liste des utilisateurs actifs récupérée avec succès',
    type: [User],
  })
  async findActiveUsers(): Promise<User[]> {
    return this.userFactoryService.findActiveUsers();
  }

  @Get('role/:role')
  @ApiOperation({ summary: 'Récupérer les utilisateurs par rôle' })
  @ApiResponse({
    status: 200,
    description: 'Liste des utilisateurs récupérée avec succès',
    type: [User],
  })
  async findByRole(@Param('role') role: UserRole): Promise<User[]> {
    return this.userFactoryService.findByRole(role);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Récupérer un utilisateur par son email' })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur trouvé avec succès',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async findByEmail(@Param('email') email: string): Promise<User | null> {
    return this.userFactoryService.findByEmail(email);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un utilisateur par son ID' })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur trouvé avec succès',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async findOne(@Param('id') id: string): Promise<User | null> {
    return this.userFactoryService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un nouvel utilisateur' })
  @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès' })
  async create(@Body() user: CreateUserDto): Promise<User> {
    return this.userFactoryService.create(user);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mettre à jour un utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur mis à jour avec succès',
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async update(
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
  ): Promise<User> {
    return this.userFactoryService.update(id, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un utilisateur' })
  @ApiResponse({ status: 204, description: 'Utilisateur supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.userFactoryService.delete(id);
  }
}