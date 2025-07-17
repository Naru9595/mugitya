import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MenusModule } from './menus/menus.module';
import { OrdersModule } from './orders/orders.module';
import { User } from './users/entities/user.entity';
import { Menu } from './menus/entities/menu.entity';
import { Order } from './orders/entities/order.entity';

@Module({
  imports: [
    // .env ファイルを読み込むための設定
    ConfigModule.forRoot({
      isGlobal: true, // アプリケーション全体でConfigModuleを使えるようにする
      envFilePath: '.env', // .envファイルを指定
    }),
    
    // データベース接続設定
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'), // .envのキーと一致させる
        port: configService.get<number>('DB_PORT'), // .envのキーと一致させる
        username: configService.get<string>('DB_USERNAME'), // .envのキーと一致させる
        password: configService.get<string>('DB_PASSWORD'), // .envのキーと一致させる
        database: configService.get<string>('DB_DATABASE'), // .envのキーと一致させる
        entities: [User, Menu, Order],
        synchronize: true,
      }),
    }),
    AuthModule,
    UsersModule,
    MenusModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
