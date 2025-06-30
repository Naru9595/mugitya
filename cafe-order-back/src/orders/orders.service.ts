// src/orders/orders.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Menu } from '../menus/entities/menu.entity';
import { User } from '../users/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderStatus } from './entities/order.entity';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    // Menuのリポジトリも使えるように注入する
    @InjectRepository(Menu)
    private readonly menusRepository: Repository<Menu>,
  ) {}

  // 【ユーザー向け】新しい注文を作成
  async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    const menus = await this.menusRepository.findBy({
      id: In(createOrderDto.menuIds),
    });

    if (menus.length !== createOrderDto.menuIds.length) {
      throw new NotFoundException('指定されたメニューの一部が見つかりません。');
    }

    const totalPrice = menus.reduce((sum, current) => sum + current.price, 0);

    const newOrder = this.ordersRepository.create({
      user,
      menus,
      totalPrice,
      status: OrderStatus.PENDING,
    });

    return this.ordersRepository.save(newOrder);
  }

  // 【管理者向け】全ての注文を取得
  findAll(): Promise<Order[]> {
    return this.ordersRepository.find({ order: { createdAt: 'DESC' } });
  }

  // 【ユーザー向け】自分の注文履歴を取得
  findMyOrders(user: User): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
    });
  }

  // 【管理者向け】注文ステータスを更新
  async updateStatus(
    id: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const order = await this.ordersRepository.findOneBy({ id });
    if (!order) {
      throw new NotFoundException(`ID ${id} の注文が見つかりません。`);
    }
    order.status = updateOrderDto.status;
    return this.ordersRepository.save(order);
  }
}