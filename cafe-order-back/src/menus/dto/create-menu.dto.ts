// src/menus/dto/create-menu.dto.ts
export class CreateMenuDto {
  name: string;
  price: number;
  calorie: number;
  is_available?: boolean; // ? をつけると省略可能な項目になる
}