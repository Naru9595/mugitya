import React, { useState, useEffect } from 'react';
import apiClient from '../api';
import { useCart } from '../cartcontext'; // ★ useCartをインポート

interface Menu {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

const MenuList = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart(); // ★ カートに追加する関数を取得

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await apiClient.get<Menu[]>('/menus');
        setMenus(response.data);
      } catch (err) {
        setError('メニューの読み込みに失敗しました。');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenus();
  }, []);

  if (isLoading) return <p>メニューを読み込んでいます...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>メニュー一覧</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {menus.map((menu) => (
          <div key={menu.id} style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', width: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3>{menu.name}</h3>
              <p>{menu.description}</p>
              <p>価格: {menu.price}円</p>
              <p style={{ fontWeight: 'bold', color: menu.stock > 0 ? 'green' : 'red' }}>
                {menu.stock > 0 ? `在庫あり (${menu.stock}点)` : '品切れ'}
              </p>
            </div>
            {/* ★ここから追加★ */}
            <button 
              onClick={() => addToCart(menu)} 
              disabled={menu.stock === 0} // 在庫が0ならボタンを無効化
              style={{ marginTop: '10px' }}
            >
              カートに追加
            </button>
            {/* ★ここまで追加★ */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuList;
