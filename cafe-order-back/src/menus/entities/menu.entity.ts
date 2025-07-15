// src/menus/entities/menu.entity.ts

import { Order } from '../../orders/entities/order.entity'; // 後で多対多リレーションのためにインポート
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 }) // 商品名
  name: string;

  @Column('text', { nullable: true }) // 商品説明（任意）
  description: string;

  @Column() // 価格
  price: number;

  @Column({ type: 'int', default: 0}) // 現在注文可能か
  stock: number;

  // Orderとの多対多リレーション（後述）
  // 1つのメニューは多くの注文に含まれる可能性がある
  @ManyToMany(() => Order, order => order.menus)
  orders: Order[];
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}