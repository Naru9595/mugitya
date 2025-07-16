// src/users/dto/create-user.dto.ts

import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

// ★ クラス名を「CreateUserDto」に統一
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}