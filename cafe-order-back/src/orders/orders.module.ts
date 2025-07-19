// src/orders/orders.module.ts の修正版

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { Menu } from '../menus/entities/menu.entity';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module'; // ★★★最重要：この行を追加します★★★

@Module({
  imports: [
    // ★★★ここに AuthModule を追加します★★★
    // これにより、OrdersModule が JwtAuthGuard を正しく利用できるようになります。
    AuthModule,
    
    TypeOrmModule.forFeature([Order, Menu]),
    UsersModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
