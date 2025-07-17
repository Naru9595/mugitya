import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // TypeOrmModuleをインポート
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity'; // Orderエンティティをインポート
import { Menu } from '../menus/entities/menu.entity'; // Menuエンティティもインポート
import { UsersModule } from '../users/users.module'; // UsersServiceを使うためにインポート

@Module({
  imports: [
    // このモジュールで使うエンティティをすべて登録します
    TypeOrmModule.forFeature([Order, Menu]), // ★OrderとMenuの両方を登録
    UsersModule, // ★UsersServiceを使うために追加
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
