// updateUser.dto.ts
import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class UpdateUserDTO {
  @IsOptional() // この項目は任意（送られてこなくても良い）
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
  
  // この項目は管理者権限を持つユーザーのみが更新できる、などの制御を
  // サーバー側のロジックで行う
  @IsOptional()
  @IsEnum(UserRole) // UserRoleエンティティで定義された値のみ許可
  role?: UserRole;
}