// このファイルは、バックエンドとフロントエンドの両方からインポートして使用します。

// --- Enums ---

// ユーザーの役割
export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}

// 注文の状態
export enum OrderStatus {
  PENDING = 'pending',       // 受付待ち
  PROCESSING = 'processing', // 調理中
  COMPLETED = 'completed',   // 完了
  CANCELLED = 'cancelled',   // キャンセル
}

// --- Interfaces ---

// Userの型定義
export interface User {
  id: number;
  email: string;
  role: UserRole;
  point: number;
  orders: Order[]; // ユーザーの注文履歴
  createdAt: string; // Date型はJSONでは文字列になる
  updatedAt: string; // Date型はJSONでは文字列になる
  // ★注意: password_hash はAPIレスポンスに含めないため、型定義にも含めません。
}

// Menuの型定義
export interface Menu {
  id: number;
  name: string;
  description: string | null; // nullableは | null を付ける
  price: number;
  isAvailable: boolean;
  orders: Order[]; // このメニューが含まれる注文
  createdAt: string;
  updatedAt: string;
}

// Orderの型定義
export interface Order {
  id: number;
  user: User; // 注文したユーザーの情報
  menus: Menu[]; // 注文に含まれるメニューのリスト
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}