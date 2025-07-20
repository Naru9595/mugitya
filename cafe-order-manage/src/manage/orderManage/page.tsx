// src/manage/orderManage/page.tsx

"use client"
import React, { useState, useEffect } from 'react';
import ManageSidebar from '../component/manageSidebar';
import apiClient from '../../api'; // 設定済みのaxiosインスタンス

// --- 型定義 ---
// 注文ステータスの型
type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

// 注文に含まれる商品の型
interface OrderItem {
  id: number;
  name: string;
  price: number;
}

// 注文全体の型 (DBの構造に合わせる)
interface Order {
  id: number;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string; // ISO 8601 形式の文字列を想定
  user: {
    id: number;
    email: string; // ユーザーのメールアドレスや名前など
  };
  menus: OrderItem[]; // ユニークなメニュー情報
  menuIds: number[];  // 重複を含む全てのメニューID
}

// --- 注文カードコンポーネント ---
function OrderCard({
  order,
  onUpdateStatus,
}: {
  order: Order;
  onUpdateStatus: (orderId: number, newStatus: OrderStatus) => Promise<void>;
}) {
  const [isLoading, setIsLoading] = useState(false);

  // ★★★ ここからがTypeScriptエラーの修正です ★★★
  // 1. 各ステータスに対応するアクションを定義したオブジェクトを作成します。
  //    キーの型がOrderStatusであることを Partial<Record<...>> で明示します。
  const actionMap: Partial<Record<OrderStatus, { nextStatus: OrderStatus; text: string }>> = {
    pending: { nextStatus: 'processing', text: '調理開始' },
    processing: { nextStatus: 'completed', text: '提供完了' },
  };
  // 2. 現在の注文ステータスに対応するアクションを、上記オブジェクトから安全に取得します。
  const nextAction = actionMap[order.status];
  // ★★★ ここまでが修正です ★★★

  // 数量を計算するヘルパー関数
  const getQuantities = (allMenuIds: number[]): { [key: number]: number } => {
    const counts: { [key: number]: number } = {};
    for (const id of allMenuIds) {
      counts[id] = (counts[id] || 0) + 1;
    }
    return counts;
  };
  const quantities = getQuantities(order.menuIds || []);

  const handleUpdate = async (newStatus: OrderStatus) => {
    setIsLoading(true);
    try {
      await onUpdateStatus(order.id, newStatus);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col h-full">
      <div className="border-b pb-2 mb-2">
        <h3 className="font-bold text-lg">注文ID: {order.id}</h3>
        <p className="text-sm text-gray-500">
          注文日時: {new Date(order.createdAt).toLocaleString('ja-JP')}
        </p>
      </div>
      
      <ul className="space-y-1 flex-grow">
        {(order.menus || []).map(item => (
          <li key={item.id} className="flex justify-between">
            <span>{item.name}</span>
            <span className="font-semibold">x {quantities[item.id] || 0}</span>
          </li>
        ))}
      </ul>

      <div className="border-t pt-2 mt-2">
        <p className="font-bold text-right">合計: {order.totalPrice}円</p>
      </div>
      
      {/* nextActionが存在する場合（pendingまたはprocessingの場合）のみボタンを表示 */}
      {nextAction && (
        <button
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          onClick={() => handleUpdate(nextAction.nextStatus)}
          disabled={isLoading}
        >
          {isLoading ? '更新中...' : nextAction.text}
        </button>
      )}
    </div>
  );
}

// --- メインコンポーネント ---
function OrderManage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 注文データをDBから取得する関数
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get<Order[]>('/orders');
      setOrders(response.data);
      setError(null);
    } catch (err) {
      setError('注文データの読み込みに失敗しました。');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // コンポーネントが最初に表示されたときに注文を取得
  useEffect(() => {
    fetchOrders();
  }, []);

  // 注文ステータスを更新する処理
  const handleUpdateStatus = async (orderId: number, newStatus: OrderStatus) => {
    try {
      await apiClient.patch(`/orders/${orderId}`, { status: newStatus });
      await fetchOrders();
    } catch (err) {
      alert('注文ステータスの更新に失敗しました。');
      console.error(err);
      throw err;
    }
  };

  // ステータスごとに注文をフィルタリング
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const processingOrders = orders.filter(o => o.status === 'processing');
  const completedOrders = orders.filter(o => o.status === 'completed');

  return (
    <div className="flex bg-gray-200 min-h-screen">
      <div className="fixed top-0 left-0">
        <ManageSidebar />
      </div>
      <div className="flex-1 ml-44 p-6">
        <div className="text-2xl font-bold mb-6">注文管理</div>

        {isLoading ? (
          <p>読み込み中...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="space-y-8">
            {/* 新規受付セクション */}
            <section>
              <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">新規受付 ({pendingOrders.length}件)</h2>
              {pendingOrders.length === 0 ? (
                <p className="text-gray-600">新規受付の注文はありません。</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {pendingOrders.map(order => (
                    <OrderCard key={order.id} order={order} onUpdateStatus={handleUpdateStatus} />
                  ))}
                </div>
              )}
            </section>

            {/* 調理中セクション */}
            <section>
              <h2 className="text-xl font-semibold mb-4 border-b-2 border-yellow-500 pb-2">調理中 ({processingOrders.length}件)</h2>
              {processingOrders.length === 0 ? (
                <p className="text-gray-600">調理中の注文はありません。</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {processingOrders.map(order => (
                    <OrderCard key={order.id} order={order} onUpdateStatus={handleUpdateStatus} />
                  ))}
                </div>
              )}
            </section>

            {/* 完了済みセクション */}
            <section>
              <h2 className="text-xl font-semibold mb-4 border-b-2 border-green-500 pb-2">完了済み ({completedOrders.length}件)</h2>
              {completedOrders.length === 0 ? (
                <p className="text-gray-600">完了済みの注文はありません。</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {completedOrders.map(order => (
                    <div key={order.id} className="bg-white rounded-lg shadow p-4 opacity-60">
                      <h3 className="font-bold text-lg line-through">注文ID: {order.id}</h3>
                      <p className="text-sm text-gray-500">
                        完了日時: {new Date(order.createdAt).toLocaleString('ja-JP')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderManage;
