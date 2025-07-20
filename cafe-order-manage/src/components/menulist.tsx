// src/user/userMenu/page.tsx (このファイル一つで完結します)

"use client"
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api';
import { useCart } from '../cartcontext';
import { useAuth } from '../AuthContext';
import Cart from './cart';

// --- 型定義 (変更なし) ---
interface Menu { id: number; name: string; description: string; price: number; stock: number; }
type OrderStatusType = 'pending' | 'processing' | 'completed' | 'cancelled';
interface OrderMenuItem { id: number; name: string; }
interface Order { id: number; status: OrderStatusType; totalPrice: number; createdAt: string; menus: OrderMenuItem[]; menuIds: number[]; }

// --- 注文履歴カード コンポーネント (変更なし) ---
const statusMap: Record<OrderStatusType, string> = { pending: '注文済み', processing: '調理中', completed: '調理完了', cancelled: 'キャンセル' };
function OrderHistoryCard({ order, onReceive }: { order: Order; onReceive: (orderId: number) => Promise<void>; }) {
  const [isReceiving, setIsReceiving] = useState(false);
  const getQuantities = (allMenuIds: number[]): Record<number, number> => {
    return allMenuIds.reduce((acc, id) => { acc[id] = (acc[id] || 0) + 1; return acc; }, {} as Record<number, number>);
  };
  const quantities = getQuantities(order.menuIds || []);
  const handleReceiveClick = async () => { setIsReceiving(true); await onReceive(order.id); };
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white mb-4">
      <div className="flex justify-between items-center border-b pb-2 mb-2">
        <h4 className="font-bold">注文ID: {order.id}</h4>
        <span className={`px-2 py-1 text-sm font-semibold rounded-full ${order.status === 'completed' ? 'bg-green-200 text-green-800' : order.status === 'processing' ? 'bg-yellow-200 text-yellow-800' : order.status === 'cancelled' ? 'bg-red-200 text-red-800' : 'bg-blue-200 text-blue-800'}`}>{statusMap[order.status]}</span>
      </div>
      <p className="text-sm text-gray-500 mb-2">注文日時: {new Date(order.createdAt).toLocaleString('ja-JP')}</p>
      <ul className="text-sm space-y-1">
        {(order.menus || []).map(item => (<li key={item.id} className="flex justify-between"><span>・{item.name}</span><span className="font-semibold">x {quantities[item.id] || 0}</span></li>))}
      </ul>
      <p className="text-right font-bold mt-2">合計: {order.totalPrice}円</p>
      {order.status === 'completed' && (<button className="w-full mt-4 bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:bg-gray-400" onClick={handleReceiveClick} disabled={isReceiving}>{isReceiving ? '処理中...' : '受け取り完了'}</button>)}
    </div>
  );
}

// --- メインコンポーネント ---
function UserMenu() {
  // ★★★ ここからが診断ログの本番です ★★★
  console.log('%c[UserMenu] コンポーネントのレンダリングを開始します。', 'color: green; font-weight: bold;');

  const [activeView, setActiveView] = useState<'menu' | 'orders'>('menu');
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isMenuLoading, setIsMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState<string | null>(null);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchMenus = async () => {
    console.log('[UserMenu] メニューの取得を開始します...');
    try {
      setIsMenuLoading(true);
      const response = await apiClient.get<Menu[]>('/menus');
      setMenus(response.data);
      setMenuError(null);
      console.log('[UserMenu] メニューの取得に成功しました。', response.data);
    } catch (err) {
      setMenuError('メニューの読み込みに失敗しました。');
      console.error('[UserMenu] メニューの取得に失敗:', err);
    } finally {
      setIsMenuLoading(false);
    }
  };
  
  const fetchMyOrders = async () => {
    console.log('[UserMenu] 注文履歴の取得を開始します...');
    try {
      setIsOrdersLoading(true);
      const response = await apiClient.get<Order[]>('/orders/my-orders');
      setMyOrders(response.data);
      setOrdersError(null);
      console.log('[UserMenu] 注文履歴の取得に成功しました。', response.data);
    } catch (err) {
      setOrdersError('注文履歴の取得に失敗しました。');
      console.error('[UserMenu] 注文履歴の取得に失敗:', err);
    } finally {
      setIsOrdersLoading(false);
    }
  };

  useEffect(() => {
    console.log('[UserMenu] useEffect: 初回レンダリング時にメニューを読み込みます。');
    fetchMenus();
  }, []);

  useEffect(() => {
    console.log(`[UserMenu] useEffect: activeViewが「${activeView}」に変わりました。`);
    if (activeView === 'orders') {
      fetchMyOrders();
    }
  }, [activeView]);

  const handleReceiveOrder = async (orderId: number) => {
    console.log(`[UserMenu] 注文ID: ${orderId} の受け取り処理を開始します。`);
    try {
      await apiClient.delete(`/orders/${orderId}`);
      await fetchMyOrders();
    } catch (err) {
      alert('受け取り処理に失敗しました。');
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  console.log('[UserMenu] JSXのレンダリング直前です。現在のactiveView:', activeView);
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="fixed top-0 left-0 right-0 bg-white z-20 shadow-md">
        <div className="flex mx-auto max-w-7xl p-4 items-center">
          <div className="text-blue-700 text-xl font-bold">学食スマートオーダー</div>
          <button onClick={handleLogout} className="ml-auto text-red-500 font-semibold hover:text-red-700">ログアウト</button>
        </div>
      </header>

      <main className="pt-20 mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-6 p-4">
          <div className="w-full lg:w-2/3">
            {/* ★★★ このタブが表示されるかどうかが問題です ★★★ */}
            <div className="flex border-b mb-4">
              <button onClick={() => { console.log('「メニュー一覧」タブがクリックされました。'); setActiveView('menu'); }} className={`py-2 px-6 font-semibold ${activeView === 'menu' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}>メニュー一覧</button>
              <button onClick={() => { console.log('「注文状況」タブがクリックされました。'); setActiveView('orders'); }} className={`py-2 px-6 font-semibold ${activeView === 'orders' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}>注文状況</button>
            </div>

            {activeView === 'menu' && (
              isMenuLoading ? <p>メニューを読み込んでいます...</p> :
              menuError ? <p className="text-red-500">{menuError}</p> :
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {menus.map(menu => (<div key={menu.id} className="bg-white p-4 shadow rounded-lg flex flex-col justify-between"><div><div className="font-bold text-lg">{menu.name}</div><div className="text-gray-600 text-sm my-2 h-10 overflow-hidden">{menu.description || '商品説明がありません'}</div><div className="text-blue-500 font-bold text-xl">{menu.price}円</div><div className={`font-bold text-sm mt-1 ${menu.stock > 0 ? 'text-green-600' : 'text-gray-500'}`}>{menu.stock > 0 ? `在庫: ${menu.stock}点` : '売り切れ'}</div></div><button className="mt-4 w-full text-white bg-blue-500 hover:bg-blue-600 rounded p-2 disabled:bg-gray-400 font-semibold" onClick={() => addToCart(menu)} disabled={menu.stock === 0}>カートに追加</button></div>))}
              </div>
            )}
            {activeView === 'orders' && (
              isOrdersLoading ? <p>注文状況を読み込み中...</p> :
              ordersError ? <p className="text-red-500">{ordersError}</p> :
              myOrders.length === 0 ? <p>まだ注文はありません。</p> :
              <div>{myOrders.map(order => (<OrderHistoryCard key={order.id} order={order} onReceive={handleReceiveOrder} />))}</div>
            )}
          </div>
          <aside className="w-full lg:w-1/3"><div className="sticky top-24"><Cart /></div></aside>
        </div>
      </main>
    </div>
  );
}

export default UserMenu;
