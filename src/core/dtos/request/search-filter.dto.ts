import { IsBoolean, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SearchFilterDto {
    @ApiProperty({ example: 'Doliprane', description: 'Name of the medication to search', required: false })
    @IsString()
    @IsOptional()
    term?: string;

    @ApiProperty({ example: 'uuid-medication', description: 'Exact Medication ID (preferred over term)', required: false })
    @IsUUID()
    @IsOptional()
    medicationId?: string;

    @ApiProperty({ example: 3.8667, description: 'User Latitude', required: true })
    @IsNumber()
    @Type(() => Number)
    userLat: number;

    @ApiProperty({ example: 11.5167, description: 'User Longitude', required: true })
    @IsNumber()
    @Type(() => Number)
    userLng: number;

    @ApiProperty({ example: 10, description: 'Search Radius in KM', default: 10, required: false })
    @IsNumber()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    radiusKm?: number = 10;

    @ApiProperty({ example: true, description: 'Filter only Open Pharmacies (24/7 or Working Hours)', required: false })
    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean) // Transform query param "true" string to boolean
    isOpen?: boolean;

    @ApiProperty({ example: 5000, description: 'Max Price (FCFA)', required: false })
    @IsNumber()
    @Min(0)
    @IsOptional()
    @Type(() => Number)
    maxPrice?: number;
}
