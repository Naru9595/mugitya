// src/menus/dto/create-menu.dto.ts
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional() // 省略可能
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}