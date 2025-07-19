// src/manage/menuManage/page.tsx

"use client"
import React, { useState, useEffect } from 'react';
import ManageSidebar from '../component/manageSidebar';
import apiClient from '../../api'; // 設定済みのaxiosインスタンス

// --- 型定義 ---
interface Menu {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
}

// 新規作成・更新時にAPIに送るデータの型
type MenuDto = Omit<Menu, 'id' | 'description'>;

// --- 新規メニュー追加モーダル (変更なし) ---
function AddMenu({ 
  onClose, 
  onAddMenu 
}: { 
  onClose: () => void;
  onAddMenu: (newMenu: MenuDto) => Promise<void>;
}) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onAddMenu({
        name,
        price: Number(price),
        stock: Number(stock),
      });
      onClose();
    } catch (error) {
      console.error("メニュー追加中にエラー", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-30 z-20">
      <div className="bg-white w-2/3 max-w-md rounded p-6">
        <form onSubmit={handleSubmit}>
          <div className="m-2 text-xl font-bold">新規メニュー追加</div>
          <div className="mt-4">
            <label htmlFor="menuName" className="text-base px-2 p-2">商品名</label>
            <input id="menuName" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded border border-gray-500 p-2" required />
          </div>
          <div className="mt-4">
            <label htmlFor="menuPrice" className="text-base px-2 p-2">値段 (円)</label>
            <input id="menuPrice" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded border border-gray-500 p-2" required />
          </div>
          <div className="mt-4">
            <label htmlFor="menuStock" className="text-base px-2 p-2">在庫数</label>
            <input id="menuStock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full rounded border border-gray-500 p-2" required />
          </div>
          <div className="flex justify-end mt-6">
            <button type="button" className="bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded" onClick={onClose} disabled={isSubmitting}>キャンセル</button>
            <button type="submit" className="text-white bg-blue-500 hover:bg-blue-600 py-2 px-6 ml-4 rounded disabled:bg-gray-400" disabled={isSubmitting}>{isSubmitting ? '保存中...' : '保存'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ★★★ メニュー編集モーダル (新規実装) ★★★
function EditMenu({
  menu,
  onClose,
  onUpdateMenu,
}: {
  menu: Menu;
  onClose: () => void;
  onUpdateMenu: (id: number, updatedMenu: MenuDto) => Promise<void>;
}) {
  const [name, setName] = useState(menu.name);
  const [price, setPrice] = useState(String(menu.price));
  const [stock, setStock] = useState(String(menu.stock));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onUpdateMenu(menu.id, {
        name,
        price: Number(price),
        stock: Number(stock),
      });
      onClose();
    } catch (error) {
      console.error("メニュー更新中にエラー", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-30 z-20">
      <div className="bg-white w-2/3 max-w-md rounded p-6">
        <form onSubmit={handleSubmit}>
          <div className="m-2 text-xl font-bold">メニュー編集</div>
          {/* フォーム部分はAddMenuとほぼ同じ。初期値が設定されている点が異なる。 */}
          <div className="mt-4">
            <label htmlFor="editMenuName" className="text-base px-2 p-2">商品名</label>
            <input id="editMenuName" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded border border-gray-500 p-2" required />
          </div>
          <div className="mt-4">
            <label htmlFor="editMenuPrice" className="text-base px-2 p-2">値段 (円)</label>
            <input id="editMenuPrice" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded border border-gray-500 p-2" required />
          </div>
          <div className="mt-4">
            <label htmlFor="editMenuStock" className="text-base px-2 p-2">在庫数</label>
            <input id="editMenuStock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full rounded border border-gray-500 p-2" required />
          </div>
          <div className="flex justify-end mt-6">
            <button type="button" className="bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded" onClick={onClose} disabled={isSubmitting}>キャンセル</button>
            <button type="submit" className="text-white bg-blue-500 hover:bg-blue-600 py-2 px-6 ml-4 rounded disabled:bg-gray-400" disabled={isSubmitting}>{isSubmitting ? '更新中...' : '更新'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ★★★ 削除確認モーダル (新規実装) ★★★
function DeleteConfirmationModal({
  menu,
  onClose,
  onDelete,
}: {
  menu: Menu;
  onClose: () => void;
  onDelete: (id: number) => Promise<void>;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(menu.id);
      onClose();
    } catch (error) {
      console.error("削除中にエラー", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex justify-center items-center fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-30 z-20">
      <div className="bg-white w-2/3 max-w-md rounded p-6">
        <div className="text-xl font-bold">削除の確認</div>
        <p className="mt-4">本当に「<span className="font-bold">{menu.name}</span>」を削除しますか？<br/>この操作は元に戻せません。</p>
        <div className="flex justify-end mt-6">
          <button className="bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded" onClick={onClose} disabled={isDeleting}>キャンセル</button>
          <button className="text-white bg-red-500 hover:bg-red-600 py-2 px-6 ml-4 rounded disabled:bg-gray-400" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? '削除中...' : '削除する'}
          </button>
        </div>
      </div>
    </div>
  );
}


// --- メインコンポーネント ---
function MenuManage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // モーダルの状態管理
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null); // ★編集対象のメニューを保持
  const [deletingMenu, setDeletingMenu] = useState<Menu | null>(null); // ★削除対象のメニューを保持

  // メニュー一覧をDBから取得する関数
  const fetchMenus = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get<Menu[]>('/menus');
      setMenus(response.data);
      setError(null);
    } catch (err) {
      setError('メニューの読み込みに失敗しました。');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // コンポーネントが最初に表示されたときにメニューを取得
  useEffect(() => {
    fetchMenus();
  }, []);

  // 新規メニューを追加する処理
  const handleAddMenu = async (newMenu: MenuDto) => {
    try {
      await apiClient.post('/menus', newMenu);
      await fetchMenus(); // 成功したら一覧を再取得
    } catch (err) {
      alert('メニューの追加に失敗しました。');
      throw err;
    }
  };

  // ★★★ メニューを更新する処理 (新規実装) ★★★
  const handleUpdateMenu = async (id: number, updatedMenu: MenuDto) => {
    try {
      // PATCHリクエストで特定のIDのメニューを更新
      await apiClient.patch(`/menus/${id}`, updatedMenu);
      await fetchMenus(); // 成功したら一覧を再取得
    } catch (err) {
      alert('メニューの更新に失敗しました。');
      throw err;
    }
  };

  // ★★★ メニューを削除する処理 (新規実装) ★★★
  const handleDeleteMenu = async (id: number) => {
    try {
      // DELETEリクエストで特定のIDのメニューを削除
      await apiClient.delete(`/menus/${id}`);
      await fetchMenus(); // 成功したら一覧を再取得
    } catch (err) {
      alert('メニューの削除に失敗しました。');
      throw err;
    }
  };

  // --- レンダリング ---
  return (
    <>
      {isAddModalOpen && <AddMenu onClose={() => setIsAddModalOpen(false)} onAddMenu={handleAddMenu} />}
      {editingMenu && <EditMenu menu={editingMenu} onClose={() => setEditingMenu(null)} onUpdateMenu={handleUpdateMenu} />}
      {deletingMenu && <DeleteConfirmationModal menu={deletingMenu} onClose={() => setDeletingMenu(null)} onDelete={handleDeleteMenu} />}
      
      <div className="bg-gray-200 min-h-screen">
        <div className="flex">
          <div className="fixed top-0 left-0">
            <ManageSidebar />
          </div>
          <div className="m-4 ml-44 w-full pr-8">
            <div className="flex justify-between items-center mb-4">
              <div className="text-xl font-bold">メニュー・在庫管理</div>
              <button className="text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded font-bold" onClick={() => setIsAddModalOpen(true)}>メニュー追加</button>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex pb-2 border-b border-gray-200 font-bold">
                <div className="w-2/6 text-left px-2">商品名</div>
                <div className="w-1/6 text-left px-2">値段</div>
                <div className="w-1/6 text-left px-2">在庫</div>
                <div className="w-2/6 text-center px-2">操作</div>
              </div>
              {isLoading ? (
                <div className="text-center py-4">読み込み中...</div>
              ) : error ? (
                <div className="text-center py-4 text-red-500">{error}</div>
              ) : (
                <div>
                  {menus.map(menu => (
                    <div key={menu.id} className="flex items-center mt-2 py-2 border-b border-gray-100">
                      <div className="w-2/6 text-left px-2">{menu.name}</div>
                      <div className="w-1/6 text-left px-2">{menu.price}円</div>
                      <div className="w-1/6 text-left px-2">{menu.stock}</div>
                      <div className="w-2/6 text-center px-2 space-x-2">
                        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-sm" onClick={() => setEditingMenu(menu)}>編集</button>
                        <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm" onClick={() => setDeletingMenu(menu)}>削除</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MenuManage;
