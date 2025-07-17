import React from 'react';

// Propsの型定義をより正確に
interface ProductType {
    id: string;
    name: string;
    isCompleted: boolean; // 新しく追加するプロパティ
}

interface CompleteProps {
    product: ProductType;
    // この商品はどのCompleteコンポーネントがクリックされたかを特定できるようIDを渡す
    onComplete: (productId: string) => void;
}

function Complete({ product, onComplete }: CompleteProps) {
    // isCompleted が true なら表示しない、または完了済みとして表示するなど、
    // ここで product.isCompleted を直接利用して条件分岐させます。
    // 今回の要件「消す」に合わせて、isCompletedがtrueなら何もレンダリングしない
    if (product.isCompleted) {
        return null; // または <div></div> でも可、視覚的に何もない状態
    }

    return (
        // keyはCompleteコンポーネントをマップする親要素で指定するため、ここでは不要
        <div className="flex m-2 items-center rounded bg-white shadow-md"> {/* shadow-mdを追加してカード感を出す */}
            <div className="px-2 py-2 font-semibold"> {/* paddingとfont-semibold追加 */}
                {product.name}
            </div>
            <button
                className="p-1 m-1 bg-green-500 rounded text-white hover:bg-green-600 ml-auto" // ml-autoで右寄せ
                onClick={() => onComplete(product.id)} // この商品のIDをonCompleteに渡す
            >
                完成
            </button>
        </div>
    );
}

export default Complete;