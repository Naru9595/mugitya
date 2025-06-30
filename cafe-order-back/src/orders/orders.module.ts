// src/orders/orders.module.ts

import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Menu } from 'src/menus/entities/menu.entity'; // Menuエンティティをインポート

@Module({
  // このモジュール内で使うリポジトリを登録する
  imports: [TypeOrmModule.forFeature([Order, Menu])], 
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}