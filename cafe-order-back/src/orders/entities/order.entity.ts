// src/orders/entities/order.entity.ts

import { User } from '../../users/entities/user.entity'; // Userエンティティをインポート
import { Menu } from '../../menus/entities/menu.entity'; // Menuエンティティをインポート
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne, 
  ManyToMany, 
  JoinTable, 
  Column 
} from 'typeorm';

// 注文の状態を定義
export enum OrderStatus {
  PENDING = 'pending',       // 受付待ち
  PROCESSING = 'processing', // 調理中
  COMPLETED = 'completed',     //完了
  CANCELLED = 'cancelled',     // キャンセル
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  // --- Userとのリレーション定義 (多対1) ---
  // 1つの注文は、1人のユーザーに紐づく
  // { eager: true } を付けると、Orderを検索した際に自動でUser情報も取得してくれる
  @ManyToOne(() => User, user => user.orders)
  user: User;

  // --- Menuとのリレーション定義 (多対多) ---
  // 1つの注文には、複数のメニューが含まれる
  @ManyToMany(() => Menu, menu => menu.orders)
  @JoinTable() // このデコレータが中間テーブルの作成を指示する
  menus: Menu[];
  
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column() // この注文の合計金額
  totalPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}