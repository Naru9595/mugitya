import { User } from '../../users/entities/user.entity';
import { Menu } from '../../menus/entities/menu.entity';
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


export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.orders)
  user: User;

  @ManyToMany(() => Menu, menu => menu.orders)
  @JoinTable()
  menus: Menu[];
  
  @Column('simple-array') // 'simple-array'は、[1, 2, 2]のような単純な配列を保存する型
  menuIds: number[];

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column()
  totalPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
