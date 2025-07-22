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
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
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
