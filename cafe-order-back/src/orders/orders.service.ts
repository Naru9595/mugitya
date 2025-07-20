// src/orders/orders.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
}
