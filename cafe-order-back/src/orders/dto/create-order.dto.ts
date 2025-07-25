import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  @IsNotEmpty()
  @IsNumber({}, { each: true }) // 配列の各要素が数値であることをバリデーション
  menuIds: number[]; // 注文するメニューのIDの配列
}