'use client'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api'; // ★ 作成したAPIクライアントをインポート
import { useCart } from '../../cartcontext'; // ★ 作成したCartContextをインポート

import shoppingCart from '../../icons/shoppingCart.svg';

// --- 型定義 ---
interface Menu {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

// --- カート表示用のコンポーネント ---
function ShowCart ({
  setCartClicked,
  handleOrderSubmit,
  isLoading,
}:{
  setCartClicked : () => void;
  handleOrderSubmit: () => void;
  isLoading: boolean;
}) {
    const { cartItems } = useCart(); // カートの中身をContextから取得

    // 合計金額を計算
    const totalPrice = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    return(
        <div className="flex justify-center items-center fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-30 z-20">
            <div className="bg-white w-2/3 rounded p-4">
                <div className="flex">
                    <div className="flex-2 text-xl font-bold">ショッピングカート</div>
                    <div className="flex-1 text-right">
                        <button className="w-4 h-4 text-sm" onClick={setCartClicked}>×</button>
                    </div>
                </div>
                {cartItems.length === 0 ? (
                  <p className="m-4 text-xl">カートは空です。</p>
                ) : (
                  <>
                    <ul className="my-4">
                      {cartItems.map(item => (
                        <li key={item.id} className="flex justify-between text-lg border-b py-2">
                          <span>{item.name}</span>
                          <span>{item.quantity}点 x {item.price}円</span>
                        </li>
                      ))}
                    </ul>
                    <div className="m-4 text-xl text-right font-bold">
                        合計金額 : {totalPrice}円
                    </div>
                  </>
                )}
                <button 
                    className="bg-blue-500 mx-4 p-2 rounded text-white disabled:bg-gray-400"
                    onClick={handleOrderSubmit}
                    disabled={isLoading || cartItems.length === 0}
                >
                    {isLoading ? '処理中...' : '注文する'}
                </button>
            </div>
        </div>
    );
}

// --- メインコンポーネント ---
function UserMenu(){
    // ★ stateを整理・変更
    const [menus, setMenus] = useState<Menu[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cartClicked, setCartClicked] = useState(false);
    const [orderStatus, setOrderStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    
    // ★ CartContextから必要な関数を取得
    const { addToCart, submitOrder } = useCart();

    // ★ useEffectを使って、コンポーネント表示時にメニューをDBから取得
    useEffect(() => {
      const fetchMenus = async () => {
        try {
          setIsLoading(true);
          const response = await apiClient.get<Menu[]>('/menus');
          setMenus(response.data);
          setError(null);
        } catch (err) {
          setError('メニューの読み込みに失敗しました。');
        } finally {
          setIsLoading(false);
        }
      };
      fetchMenus();
    }, []); // 空配列なので初回のみ実行

    // --- イベントハンドラ ---
    const showCart = () => setCartClicked(!cartClicked);

    const handleAddToCart = (menu: Menu) => {
      addToCart(menu);
      // ここで「カートに追加しました」という小さな通知（トースト）を出すのが理想的
      console.log(`${menu.name}をカートに追加しました。`);
    };

    const handleOrderSubmit = async () => {
      setOrderStatus('loading');
      try {
        await submitOrder();
        setOrderStatus('success');
        // カートを閉じる
        setCartClicked(false);
        // 成功メッセージを数秒表示して消すなどの処理
        setTimeout(() => setOrderStatus('idle'), 3000);
      } catch (err) {
        setOrderStatus('error');
        // エラーメッセージを数秒表示して消すなどの処理
        setTimeout(() => setOrderStatus('idle'), 3000);
      }
    };

    // --- レンダリング ---
    if (isLoading) return <p>メニューを読み込んでいます...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <>
            {/* カートモーダル */}
            {cartClicked && (
              <ShowCart
                setCartClicked={showCart}
                handleOrderSubmit={handleOrderSubmit}
                isLoading={orderStatus === 'loading'}
              />
            )}

            {/* 注文ステータス通知 */}
            {orderStatus === 'success' && <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-green-500 text-white p-4 rounded z-30">注文が完了しました！</div>}
            {orderStatus === 'error' && <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-red-500 text-white p-4 rounded z-30">注文に失敗しました。</div>}

            <div className="w-full bg-white">
                {/* ヘッダー */}
                <div className="fixed top-0 bg-white z-5 shadow w-full">
                    <div className="flex m-4 items-center">
                        <div className="text-blue-700 text-lg font-bold">学食スマートオーダー</div>
                        <Link to="/signin" className="absolute right-4 text-red-500 hover:text-red-200">ログアウト</Link>
                    </div>
                </div>

                {/* メニュー一覧 */}
                <div className="mt-20 ml-4 text-lg font-bold">本日のメニュー</div>
                <div className="mt-4">
                    {menus.map(menu => (
                        <div key={menu.id} className="m-4 p-4 shadow-md">
                            <div className="font-bold">{menu.name}</div>
                            <div className="flex items-center">
                                <div className="mt-2 ml-4 mr-4 text-blue-500 font-bold">{menu.price}円</div>
                                {menu.stock > 0 ? (
                                    <button 
                                        className="absolute right-6 text-white bg-blue-500 hover:bg-blue-600 rounded p-2"
                                        onClick={() => handleAddToCart(menu)}
                                    >
                                        カートに追加
                                    </button>
                                ) : (
                                    <button className="absolute right-6 text-white bg-gray-400 rounded py-2 px-6" disabled>
                                        売り切れ
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* カートを見るボタン */}
                <button className="flex items-center p-2 bg-blue-500 hover:bg-blue-600 rounded-full fixed bottom-3 right-3 text-white">
                    <img src={shoppingCart} alt="カート" className="w-8 h-8"/>
                    <div className="p-2 text-lg" onClick={showCart}>
                        カートを見る
                    </div>
                </button>
            </div>
        </>
    )
}

export default UserMenu;
