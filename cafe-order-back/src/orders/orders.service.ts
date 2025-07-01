// src/orders/orders.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Menu } from '../menus/entities/menu.entity';
import { User } from '../users/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Menu)
    private readonly menusRepository: Repository<Menu>,
  ) {}

  // src/orders/orders.service.ts の create メソッド

async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
  // ... (メニュー検索や合計金額計算のロジックは同じ)
  const menus = await this.menusRepository.findBy({
    id: In(createOrderDto.menuIds),
  });
  if (menus.length !== createOrderDto.menuIds.length) {
    throw new NotFoundException('指定されたメニューの一部が見つかりません。');
  }
  const totalPrice = menus.reduce((sum, current) => sum + current.price, 0);
  const newOrder = this.ordersRepository.create({ user, menus, totalPrice });

  const savedOrder = await this.ordersRepository.save(newOrder);

  // ↓↓↓ ここからが修正部分 ↓↓↓

  // 1. 保存した注文をリレーション付きで再取得する
  const result = await this.findOne(savedOrder.id);

  // 2. 万が一、取得できなかった（nullだった）場合のチェックを追加
  if (!result) {
    // この状況は通常あり得ないが、型安全のためにチェックする
    throw new Error('作成した注文の取得に失敗しました。');
  }

  // 3. nullでないことが保証されたので、安心して返す
  return result;
}

  findOne(id: number): Promise<Order| null> {
    return this.ordersRepository.findOne({
      where: { id },
      relations: ['user', 'menus'], // ★ここで関連データを指定して取得
    });
  }

  findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: ['user', 'menus'], // ★ここで関連データを指定して取得
      order: { createdAt: 'DESC' },
    });
  }

  findMyOrders(user: User): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { user: { id: user.id } },
      relations: ['menus'], // ★ユーザー情報は不要なのでmenusだけ取得
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id); // findOneで関連データも取得
    if (!order) {
      throw new NotFoundException(`ID ${id} の注文が見つかりません。`);
    }
    order.status = updateOrderDto.status;
    return this.ordersRepository.save(order);
  }
}