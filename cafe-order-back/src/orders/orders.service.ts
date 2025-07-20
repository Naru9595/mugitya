// src/orders/orders.service.ts

import { Injectable, NotFoundException, BadRequestException, ForbiddenException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { Menu } from '../menus/entities/menu.entity';
import { User } from '../users/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';


@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Menu)
    private readonly menusRepository: Repository<Menu>,
  ) {}

  // createメソッドは変更ありません
  async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    const { menuIds } = createOrderDto;
    if (menuIds.length === 0) {
      throw new BadRequestException('注文するメニューが選択されていません。');
    }
    const uniqueMenuIds = [...new Set(menuIds)];
    const menus = await this.menusRepository.findBy({ id: In(uniqueMenuIds) });
    let totalPrice = 0;
    for (const id of menuIds) {
      const menu = menus.find(m => m.id === id);
      if (!menu) throw new NotFoundException(`ID ${id} のメニューが見つかりません。`);
      if (menu.stock <= 0) throw new BadRequestException(`${menu.name}は品切れです。`);
      totalPrice += menu.price;
    }
    const newOrder = this.ordersRepository.create({
      user,
      menus,
      totalPrice,
      status: OrderStatus.PENDING,
      menuIds: menuIds,
    });
    for (const menu of menus) {
      const orderCount = menuIds.filter(id => id === menu.id).length;
      menu.stock -= orderCount;
    }
    await this.menusRepository.save(menus);
    return this.ordersRepository.save(newOrder);
  }

  /**
   * すべての注文を取得するメソッド (管理者向け)
   */
  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      // ★★★ この部分が 'menus: true' となっているか、再度ご確認ください ★★★
      relations: {
        user: true,
        menus: true, // 'orderItems' ではなく、'menus' が正しいプロパティ名です
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  /**
   * 特定の注文のステータスを更新するメソッド (管理者向け)
   */
  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.ordersRepository.preload({
      id: id,
      ...updateOrderDto,
    });
    if (!order) {
      throw new NotFoundException(`ID ${id} の注文が見つかりません。`);
    }
    return this.ordersRepository.save(order);
    
  }
    // ★★★ ここから機能追加 ★★★

  /**
   * 特定のユーザーの注文履歴を取得するメソッド
   * @param userId ユーザーID
   */
  async findMyOrders(userId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: {
        user: { id: userId }, // ★ ユーザーIDで絞り込み
      },
      relations: {
        menus: true, // 注文商品情報も一緒に取得
      },
      order: {
        createdAt: 'DESC', // 新しい順に並び替え
      },
    });
  }

  /**
   * ユーザーが自身の完了済み注文を削除（受け取り完了）するメソッド
   * @param orderId 注文ID
   * @param userId ユーザーID
   */
  async removeMyOrder(orderId: number, userId: number): Promise<{ message: string }> {
    // 注文IDとユーザーIDの両方に一致する注文を検索
    const order = await this.ordersRepository.findOne({
      where: { id: orderId, user: { id: userId } },
    });

    // 注文が存在しない、または他人の注文だった場合
    if (!order) {
      throw new NotFoundException(`ID ${orderId} の注文が見つからないか、アクセス権がありません。`);
    }

    // 完了済みの注文でなければ削除させない
    if (order.status !== OrderStatus.COMPLETED) {
      throw new ForbiddenException('完了済みの注文のみ受け取り完了にできます。');
    }

    await this.ordersRepository.remove(order);
    return { message: `注文ID ${orderId} を受け取り完了にしました。` };
  }
}
