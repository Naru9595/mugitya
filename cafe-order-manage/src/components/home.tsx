import React from 'react';
import { useAuth } from '../AuthContext';
import MenuList from './menulist';
import Cart from './cart'; 

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ width: '90%', maxWidth: '1200px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #ccc' }}>
        <h1>食堂注文システム</h1>
        <div>
          <span>こんにちは、<strong>{user?.email}</strong> さん</span>
          <button onClick={logout} style={{ marginLeft: '16px' }}>ログアウト</button>
        </div>
      </header>
      
      <main style={{ display: 'flex', gap: '24px' }}>
        {/* ★ 左側にメニュー一覧 */}
        <div style={{ flex: 2 }}>
          <MenuList />
        </div>
        
        {/* ★ 右側にカート */}
        <div style={{ flex: 1 }}>
          <Cart />
        </div>
      </main>
    </div>
  );
};

export default Home;
