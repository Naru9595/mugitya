export declare enum UserRole {
    CUSTOMER = "customer",
    ADMIN = "admin"
}
export declare enum OrderStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export interface MenuSummary {
    id: number;
    name: string;
    price: number;
}
export interface UserSummary {
    id: number;
    email: string;
    role: UserRole;
}
export interface User {
    id: number;
    email: string;
    role: UserRole;
    point: number;
    createdAt: Date;
    updatedAt: Date;
    orders?: Order[];
}
export interface Menu {
    id: number;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface Order {
    id: number;
    status: OrderStatus;
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
    user: UserSummary;
    menus: MenuSummary[];
}
