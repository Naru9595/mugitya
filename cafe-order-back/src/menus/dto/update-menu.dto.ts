// src/menus/dto/update-menu.dto.ts
import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class UpdateMenuDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}