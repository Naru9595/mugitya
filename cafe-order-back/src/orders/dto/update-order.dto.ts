// src/orders/dto/update-order.dto.ts
import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class UpdateOrderDto {
  @IsEnum(OrderStatus) // OrderStatusで定義された値のみを許可
  @IsNotEmpty()
  status: OrderStatus;
}