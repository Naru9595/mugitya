"use client"
import ManageSidebar from '../component/manageSidebar'
import {useState} from 'react';

function AddMenu({setAddClicked}:{setAddClicked: () => void}){
    return(
        <div className="flex justify-center items-center w-screen h-screen bg-black bg-opacity-30">
            <div className="bg-white w-2/3 rounded p-4">
                <div className="m-2 text-lg font-bold">
                    新規メニュー追加
                </div>
                <div className="text-base px-2 p-2">
                    商品名
                </div>
                <input 
                    type="menuName"
                    className="w-full rounded border border-gray-500 p-1"
                />
                <div className="text-base px-2 p-2">
                    値段
                </div>
                <input 
                    type="menuPrice"
                    className="w-full rounded border border-gray-500 p-1"
                />
                <div className="text-base px-2 p-2">
                    在庫
                </div>
                <input 
                    type="menuStock"
                    className="w-full rounded border border-gray-500 p-1"
                />
                <div className="flex">
                    <button 
                        className="bg-gray-200 hover:bg-gray-300 p-3 mt-5 rounded"
                        onClick={setAddClicked}
                        >
                            キャンセル
                    </button>
                    <button 
                        className="text-white bg-blue-500 hover:bg-blue-600 px-4 mx-10 mt-5 rounded"
                        onClick={setAddClicked}
                    >
                            保存
                    </button>
                </div>
            </div>
        </div>
    )
}

function EditMenu({setEditClicked}:{setEditClicked: () => void}){
    return(
        <div className="flex justify-center items-center w-screen h-screen bg-black bg-opacity-30">
            <div className="bg-white w-2/3 rounded p-4">
                <div className="m-2 text-lg font-bold">
                    メニュー編集
                </div>
                <div className="text-base px-2 p-2">
                    商品名
                </div>
                <input 
                    type="menuName"
                    className="w-full rounded border border-gray-500 p-1"
                />
                <div className="text-base px-2 p-2">
                    値段
                </div>
                <input 
                    type="menuPrice"
                    className="w-full rounded border border-gray-500 p-1"
                />
                <div className="text-base px-2 p-2">
                    在庫
                </div>
                <input 
                    type="menuStock"
                    className="w-full rounded border border-gray-500 p-1"
                />
                <div className="flex">
                    <button 
                        className="bg-gray-200 hover:bg-gray-300 p-3 mt-5 rounded"
                        onClick={setEditClicked}
                        >
                            キャンセル
                    </button>
                    <button 
                        className="text-white bg-blue-500 hover:bg-blue-600 px-4 mx-10 mt-5 rounded"
                        onClick={setEditClicked}
                    >
                            保存
                    </button>
                </div>
            </div>
        </div>
    )
}

function MenuManage(){
    const [addClicked,setAddClicked] = useState(false);
    const addMenu = () => {
        setAddClicked(!addClicked);
    };
    const [editClicked,setEditClicked] = useState(false);
    const editMenu =() => {
        setEditClicked(!editClicked);
    };
// 一旦手入力のデータでテスト
    const productsData = [
        {
            id: 'p1', // 一意のキーのためにIDを追加
            name: "唐揚げ定食",
            price: 500,
            stock: 30
        },
        {
            id: 'p2',
            name: "カレーライス",
            price: 500,
            stock: 20
        },
        {
            id: 'p3',
            name: "豚骨ラーメン",
            price: 800,
            stock: 15
        },
        {
            id: 'p4',
            name: "肉うどん",
            price: 400,
            stock: 0
        }
    ];
// テストなので直接参照
    const products = productsData;

    return(
        <>
            {addClicked ? (
                <div className="fixed top-0 left-0 z-10">
                    <AddMenu setAddClicked={() => setAddClicked(!addClicked)}/>
                </div>
            ):(
                <div></div>
            )}

            {editClicked ? (
                <div className="fixed top-0 left-0 z-10">
                    <EditMenu setEditClicked={() => setEditClicked(!editClicked)}/>
                </div>
            ):(
                <div></div>
            )}
            
            <div className="bg-gray-200 h-screen">
                <div className="flex">
                    <div className="fixed top-0 left-0">
                        <ManageSidebar/>
                    </div>
                    <div className="m-4 ml-44">
                        <div className="text-lg font-bold">
                            メニュー・在庫管理
                        </div>
                    </div>
                    <button 
                        className="absolute top-2 text-white right-5 bg-blue-500 hover:bg-blue-600 p-2 rounded font-bold z-1"
                        onClick={addMenu}
                        >
                            メニュー追加
                    </button>
                </div>
                <div className="m-4 ml-44">
                    <div className="bg-white p-2 rounded-lg shadow-md">
                        {/* ヘッダー行 */}
                        <div className="flex pb-2 border-b border-gray-200">
                            <div className="font-bold flex-1 text-left px-2">
                                商品名
                            </div>
                            <div className="font-bold flex-1 text-left px-2">
                                値段
                            </div>
                            <div className="font-bold flex-1 text-left px-2">
                                在庫
                            </div>
                            <div className="font-bold w-20 text-center px-2">
                                編集
                            </div>
                        </div>

                        {/* 商品データ行 */}
                        <div>
                            {products.map(product => (
                                <div key={product.id} className="flex mt-2 items-center">
                                    <div className="flex-1 text-left px-2">
                                        {product.name}
                                    </div>
                                    <div className="flex-1 text-left px-2">
                                        {product.price}円
                                    </div>
                                    <div className="flex-1 text-left px-2">
                                        {product.stock}
                                    </div>
                                    <div className="w-20 text-center px-2">
                                        <button 
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
                                            onClick={editMenu}
                                        >
                                            編集
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
        </>
    )
}

export default MenuManage