import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDTO {
  /**
   * 注文したいメニューのIDの配列
   * @example [1, 3, 5]
   * メニューはidで管理
   * 例の場合は、IDが1, 3, 5のメニューを注文することを意味します。
   */
  @IsArray()
  @IsNotEmpty()
  @IsNumber({}, { each: true }) // 配列の各要素が数値であることをバリデーション
  menuIds: number[];
}