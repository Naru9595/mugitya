// src/orders/orders.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity'; // DB用のOrderエンティティ
import { CreateOrderDto } from './dto/create-order.dto';
import { Menu } from '../menus/entities/menu.entity'; // DB用のMenuエンティティ

// 以前のSafeUserの代わりに、api.types.tsからUserをインポートします
import { User } from '../../types/api.types'; 

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Menu)
    private readonly menusRepository: Repository<Menu>,
  ) {}

  // パラメータの型を、api.types.tsからインポートしたUserにします
  async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    
    const menus = await this.menusRepository.findByIds(createOrderDto.menuIds);
    if (menus.length !== createOrderDto.menuIds.length) {
      throw new Error('One or more menus not found');
    }

    const totalPrice = menus.reduce((sum, menu) => sum + menu.price, 0);

    const newOrder = this.ordersRepository.create({
      totalPrice,
      menus,
      // 渡されたuserオブジェクトのidを使ってリレーションを構築します
      user: { id: user.id }, 
    });

    return this.ordersRepository.save(newOrder);
  }

  // ... 他のメソッド
}