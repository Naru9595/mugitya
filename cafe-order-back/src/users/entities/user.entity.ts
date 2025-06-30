// src/users/entities/user.entity.ts

import { Order } from '../../orders/entities/order.entity'; // Orderエンティティをインポート
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

// UserRole Enum ... (変更なし)
export enum UserRole {
  CUSTOMER = 'customer',
  STAFF = 'staff',
  ADMIN = 'admin',
}

@Entity()
export class User {
  // id, email, password_hash, role ... (変更なし)
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ unique: true })
  email: string;
  
  @Column()
  password_hash: string;
  
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  // --- ★ここから追記 ---
  // Orderとのリレーション定義 (1対多)
  // 1人のユーザーは、複数の注文を持つことができる
  @OneToMany(() => Order, order => order.user)
  orders: Order[];
  // --- ★ここまで追記 ---

  @CreateDateColumn()
  createdAt: Date;
  
  @UpdateDateColumn()
  updatedAt: Date;
}