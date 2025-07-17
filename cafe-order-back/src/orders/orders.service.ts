import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { Menu } from '../menus/entities/menu.entity';
import { User } from '../users/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    const { menuIds } = createOrderDto;

    // 1. 注文されたメニューの情報をDBから取得
    const menus = await this.menuRepository.findByIds(menuIds);

    // 2. 在庫と合計金額を計算
    let totalPrice = 0;
    const stockUpdates = new Map<number, number>();

    for (const id of menuIds) {
      const menu = menus.find(m => m.id === id);
      if (!menu) {
        throw new NotFoundException(`ID ${id} のメニューが見つかりません。`);
      }

      // 在庫数をカウント
      const currentStock = stockUpdates.get(id) ?? menu.stock;
      if (currentStock <= 0) {
        throw new BadRequestException(`${menu.name}は品切れです。`);
      }
      stockUpdates.set(id, currentStock - 1);
      
      totalPrice += menu.price;
    }

    // 3. 注文エンティティを作成
    const newOrder = this.orderRepository.create({
      user,
      menus,
      totalPrice,
      status: OrderStatus.PENDING, // 初期ステータスは「受付待ち」
    });

    // 4. 在庫を更新
    // 本来はトランザクションを使うべきですが、ここでは簡略化しています
    for (const [id, newStock] of stockUpdates.entries()) {
      await this.menuRepository.update(id, { stock: newStock });
    }

    // 5. 注文をDBに保存
    return this.orderRepository.save(newOrder);
  }

  // ... 他のメソッド（注文履歴取得など）
}
