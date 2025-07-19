import React, { createContext, useState, useContext, type ReactNode } from 'react';
import apiClient from './api';

// 型定義
interface Menu { id: number; name: string; price: number; }
interface CartItem extends Menu { quantity: number; }

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Menu) => void;
  submitOrder: () => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // ★★★ここが最重要★★★
  // addToCart関数に正しいロジックを実装します
  const addToCart = (item: Menu) => {
    setCartItems((prevItems) => {
      // カートに既に同じ商品があるか探す
      const existingItem = prevItems.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        // あれば数量を1増やす
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        // なければ新しい商品として数量1で追加
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };
  
  const clearCart = () => {
    setCartItems([]);
  };

  const submitOrder = async () => {
    if (cartItems.length === 0) throw new Error('カートが空です。');
    const menuIds = cartItems.flatMap(item => Array(item.quantity).fill(item.id));
    try {
      await apiClient.post('/orders', { menuIds });
      clearCart();
    } catch (error) {
      console.error('注文に失敗しました。', error);
      throw error;
    }
  };

  const value = { cartItems, addToCart, submitOrder, clearCart };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
