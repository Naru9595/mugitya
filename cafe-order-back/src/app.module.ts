// backend/src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // ← importされているか確認
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { MenusModule } from './menus/menus.module';
// backend/src/app.module.ts

// ...他のimport文の下に、以下の3行を追加してください
import { User } from './users/entities/user.entity';
import { Menu } from './menus/entities/menu.entity';
import { Order } from './orders/entities/order.entity';
// menusモジュールなどを追加した場合は、そのimport文もここにある

@Module({
  imports: [
    // .env ファイルを読み込むための設定
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    
    // TypeORMの接続設定（ここがXAMPP用の古い設定から変わる）
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User,Menu,Order],
      synchronize: true,
    }),
    
    UsersModule,
    
    OrdersModule,
    
    AuthModule,
    
    MenusModule,

    // menusモジュールなど、他のモジュール
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}