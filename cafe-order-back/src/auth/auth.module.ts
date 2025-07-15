import { Module, Global } from '@nestjs/common'; // ★ Global をインポート
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

@Global() // ★ このデコレータを追加します
@Module({
  imports: [
    // ★ forwardRef(() => UsersModule) を UsersModule に戻します
    UsersModule, 
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        // ★ .envから読み込む場合はこちらを使います。
        // secret: configService.get<string>('JWT_SECRET'), 
        // ★ ハードコードする場合はこちらです。
        secret: 'KIMITO_SICK', 
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService, PassportModule],
})
export class AuthModule {}
