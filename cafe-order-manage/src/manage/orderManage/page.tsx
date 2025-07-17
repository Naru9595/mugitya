"use client"
import React, { useState } from 'react';
import ManageSidebar from '../component/manageSidebar';
import Complete from '../component/complete'; // Complete.tsx のパスに合わせて修正

// 仮のデータ構造 (後でDBから取得するデータを想定)
interface ProductType {
    id: string;
    name: string;
    isCompleted: boolean; // 各商品の完成状態を管理するプロパティ
}

function OrderManage() {
    // productsの状態をuseStateで管理する
    // 初期データには isCompleted: false を追加
    const [products, setProducts] = useState<ProductType[]>([
        { id: 'p1', name: "唐揚げ定食", isCompleted: false },
        { id: 'p2', name: "カレーライス", isCompleted: false },
        { id: 'p3', name: "豚骨ラーメン", isCompleted: false },
        { id: 'p4', name: "肉うどん", isCompleted: false },
        { id: 'p5', name: "きつねうどん", isCompleted: false }
    ]);

    // 未完了アイテムの「完成」ボタンが押されたときに、そのアイテムを完了状態にする関数
    const handleComplete = (productId: string) => {
        setProducts(prevProducts =>
            prevProducts.map(product =>
                product.id === productId ? { ...product, isCompleted: true } : product
            )
        );
        // ここでDBへの更新APIを呼び出す（例）
        console.log(`Product ${productId} marked as completed.`);
    };

    // 完了済みアイテムの「表示を消す」ボタンが押されたときに、そのアイテムをリストから完全に削除する関数
    const handleRemoveCompleted = (productId: string) => {
        setProducts(prevProducts =>
            prevProducts.filter(product => product.id !== productId)
        );
        // ここでDBへの削除APIを呼び出す（例）
        console.log(`Product ${productId} removed from list.`);
    };


    // 未完成の商品のみを表示するためのフィルタリング
    const incompleteProducts = products.filter(product => !product.isCompleted);
    // 完成した商品のみを表示するためのフィルタリング
    const completedProducts = products.filter(product => product.isCompleted);


    return (
        <>
            <div className="flex bg-gray-200 h-screen">
                <div className="fixed top-0 left-0">
                    <ManageSidebar />
                </div>
                {/* 注文管理全体のコンテンツを囲むdiv。ml-44をここに適用することで、サイドバーの分を空ける */}
                <div className="flex-1 ml-44 p-4"> {/* ml-44をここに移動し、p-4で全体にパディング */}
                    <div className="text-lg font-bold mb-4">
                        注文管理
                    </div>
                    {/* 未処理の注文セクション */}
                    <div className="mb-8"> {/* 余白を追加 */}
                        <div className="text-lg font-bold mb-4">
                            未処理の注文
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {incompleteProducts.length === 0 ? (
                                <p className="text-gray-600">未処理の注文はありません。</p>
                            ) : (
                                incompleteProducts.map(product => (
                                    <Complete
                                        key={product.id}
                                        product={product}
                                        onComplete={handleComplete}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* 完了済みの注文セクション */}
                    <div>
                        <div className="text-lg font-bold mb-4">
                            完了済みの注文
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {completedProducts.length === 0 ? (
                                <p className="text-gray-600">完了済みの注文はありません。</p>
                            ) : (
                                completedProducts.map(product => (
                                    <div key={product.id} className="flex m-2 items-center rounded bg-gray-100 shadow-sm text-gray-500">
                                        <div className="px-2 py-2 font-semibold line-through">
                                            {product.name}
                                        </div>
                                        {/* 「表示を消す」ボタンを呼び出し、handleRemoveCompleted を使用 */}
                                        <button
                                            className="p-1 m-1 bg-red-500 rounded text-white hover:bg-red-600 ml-auto"
                                            onClick={() => handleRemoveCompleted(product.id)}
                                        >
                                            表示を消す
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OrderManage;