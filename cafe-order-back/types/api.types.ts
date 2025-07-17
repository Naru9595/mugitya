// types/api.types.ts

// ユーザーの権限
export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}

// 注文の状態
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// メニューの簡易情報
export interface MenuSummary {
  id: number;
  name: string;
  price: number;
}

// ユーザーの簡易情報
export interface UserSummary {
  id: number;
  email: string;
  role: UserRole;
}

// ユーザー情報（パスワードハッシュを含まない）
export interface User {
  id: number;
  email: string;
  role: UserRole;
  point: number;
  createdAt: Date;
  updatedAt: Date;
  orders?: Order[]; // 注文履歴は任意
}

// メニュー情報
export interface Menu {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

// 注文情報
export interface Order {
  id: number;
  status: OrderStatus;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  user: UserSummary; // ユーザー情報は簡易版
  menus: MenuSummary[]; // メニュー情報は簡易版
}