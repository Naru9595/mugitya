import { Module, Global } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

@Global()
@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule, // .envファイルを使うために必要
    JwtModule.registerAsync({
      imports: [ConfigModule], // ConfigServiceをこの中で使えるようにする
      inject: [ConfigService],
      // ★★★ここが最重要の修正ポイント★★★
      useFactory: async (configService: ConfigService) => ({
        //secret: configService.get<string>('JWT_SECRET'),
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
