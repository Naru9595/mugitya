import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // (1)
import { PassportModule } from '@nestjs/passport'; // (2)
import { JwtModule } from '@nestjs/jwt'; // (3)
import { LocalStrategy } from './local.strategy'; // (4)
import { JwtStrategy } from './jwt.strategy'; // (4)

@Module({
  imports: [
    // (1) UsersModuleのインポート
    UsersModule, 
    // (2) PassportModuleのインポート
    PassportModule, 
    // (3) JwtModuleのインポートと設定
    JwtModule.register({
      // 秘密鍵: 本番環境では環境変数から読み込むこと！
      secret: 'KIMITO_SICK', 
      signOptions: { expiresIn: '60m' }, // トークンの有効期限 (例: 60分)
    }),
  ],
  controllers: [AuthController], // (5)
  providers: [
    AuthService, 
    LocalStrategy, // (6)
    JwtStrategy, // (6)
  ],
})
export class AuthModule {}