// createUser.dto.ts
import { IsEmail, IsString, MinLength, IsAlphanumeric } from 'class-validator';

export class CreateUserDTO {
  @IsEmail() // メールアドレス形式であること
  email: string;

  @IsString()
  @MinLength(6) // パスワードは最低6文字以上
  @IsAlphanumeric('en-US', {
    message: 'パスワードは英字と数字のみ使用できます'
  })
  password: string;

  // ユーザロールはクライアントから指定させず、
  // サーバー側でデフォルト値（例: 'user'）を割り当てるのが一般的
}