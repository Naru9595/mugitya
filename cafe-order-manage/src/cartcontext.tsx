import React, { createContext, useState, useContext, type ReactNode } from 'react';
import apiClient from './api';
import { AxiosError } from 'axios';

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

  const addToCart = (item: Menu) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };
  
  const clearCart = () => {
    setCartItems([]);
  };

  const submitOrder = async () => {
    if (cartItems.length === 0) {
      alert('カートが空です。');
      return;
    }
    
    const menuIds = cartItems.flatMap(item => Array(item.quantity).fill(item.id));
    
    try {

      const token = localStorage.getItem('access_token');

      if (!token) {
        alert('認証トークンが見つかりません。再度ログインしてください。');
        throw new Error('Authentication token not found.');
      }
      
      await apiClient.post('/orders', { menuIds });
      
      alert('注文が完了しました！ありがとうございます。');
      clearCart();

    } catch (error) {
      console.error('注文処理でエラーが発生しました:', error);
      if (error instanceof AxiosError) {
        alert(`注文に失敗しました: ${error.response?.data?.message || 'サーバーエラー'}`);
      } else {
        alert('注文に失敗しました。お手数ですが、時間をおいて再度お試しください。');
      }
      throw error as Error;
    }
  };

  const value = { cartItems, addToCart, submitOrder, clearCart };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};


/**
 * CartContextにアクセスするためのカスタムフック
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
