// src/OrderStatus.tsx (新規作成)

import React, { useState, useEffect } from 'react';
import apiClient from '../api';

// --- 型定義 ---
type OrderStatusType = 'pending' | 'processing' | 'completed' | 'cancelled';
interface OrderItem { id: number; name: string; }
interface Order {
  id: number;
  status: OrderStatusType;
  totalPrice: number;
  createdAt: string;
  menus: OrderItem[];
  menuIds: number[];
}

// ステータスを日本語に変換するオブジェクト
const statusMap: Record<OrderStatusType, string> = {
  pending: '注文済み',
  processing: '調理中',
  completed: '調理完了',
  cancelled: 'キャンセル',
};

// --- 注文カードコンポーネント ---
function OrderHistoryCard({ order, onReceive }: { order: Order; onReceive: (orderId: number) => void; }) {
  const [isReceiving, setIsReceiving] = useState(false);

  const handleReceiveClick = async () => {
    setIsReceiving(true);
    await onReceive(order.id);
    // ローディング解除は親コンポーネントの再取得に任せる
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <div className="flex justify-between items-center border-b pb-2 mb-2">
        <h4 className="font-bold">注文ID: {order.id}</h4>
        <span className={`px-2 py-1 text-sm rounded-full ${
          order.status === 'completed' ? 'bg-green-200 text-green-800' :
          order.status === 'processing' ? 'bg-yellow-200 text-yellow-800' :
          'bg-blue-200 text-blue-800'
        }`}>
          {statusMap[order.status]}
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-2">注文日時: {new Date(order.createdAt).toLocaleString('ja-JP')}</p>
      <ul className="text-sm">
        {(order.menus || []).map(item => <li key={item.id}>・{item.name}</li>)}
      </ul>
      <p className="text-right font-bold mt-2">合計: {order.totalPrice}円</p>
      {order.status === 'completed' && (
        <button
          className="w-full mt-4 bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          onClick={handleReceiveClick}
          disabled={isReceiving}
        >
          {isReceiving ? '処理中...' : '受け取り完了'}
        </button>
      )}
    </div>
  );
}

// --- メインコンポーネント ---
function OrderStatus() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyOrders = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get<Order[]>('/orders/my-orders');
      setOrders(response.data);
    } catch (err) {
      setError('注文履歴の取得に失敗しました。');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const handleReceiveOrder = async (orderId: number) => {
    try {
      await apiClient.delete(`/orders/${orderId}`);
      // 成功したらリストを再取得して画面を更新
      await fetchMyOrders();
    } catch (err) {
      alert('受け取り処理に失敗しました。');
      console.error(err);
    }
  };

  if (isLoading) return <p>注文状況を読み込み中...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">注文状況</h2>
      {orders.length === 0 ? (
        <p>まだ注文はありません。</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <OrderHistoryCard key={order.id} order={order} onReceive={handleReceiveOrder} />
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderStatus;
