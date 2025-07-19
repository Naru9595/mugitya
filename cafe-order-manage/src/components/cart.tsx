import React, { useState } from 'react';
// ★修正: 正しいパスからインポートします
import { useCart } from '../cartcontext';

// このコンポーネントで使う型を定義します
interface Menu {
  id: number;
  name: string;
  price: number;
}
interface CartItem extends Menu {
  quantity: number;
}

const Cart = () => {
  const { cartItems, submitOrder } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const totalPrice = cartItems.reduce(
    (total: number, item: CartItem) => total + item.price * item.quantity,
    0
  );

  const handleOrderSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await submitOrder();
      setSuccess('注文が完了しました！');
    } catch (err: any) {
      setError(err.response?.data?.message || '注文処理中にエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ border: '2px solid #007bff', padding: '16px', borderRadius: '8px', marginTop: '20px' }}>
      <h2>カートの中身</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      
      {cartItems.length === 0 && !success ? (
        <p>カートは空です。</p>
      ) : (
        !success && (
          <div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {cartItems.map((item) => (
                <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                  <span>{item.name}</span>
                  <span>{item.quantity}点 x {item.price}円</span>
                </li>
              ))}
            </ul>
            <hr />
            <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '1.2em' }}>
              合計金額: {totalPrice}円
            </div>
            <button 
              onClick={handleOrderSubmit}
              disabled={isLoading || cartItems.length === 0}
              style={{ width: '100%', padding: '10px', marginTop: '16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {isLoading ? '処理中...' : '注文を確定する'}
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default Cart;
