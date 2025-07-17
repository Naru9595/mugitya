'use client'
import {useState} from 'react';

import shoppingCart from '../../icons/shoppingCart.svg';

function ShowCart ({setCartClicked}:{setCartClicked : () => void}) {
    return(
        <div className="flex justify-center items-center w-screen h-screen bg-black bg-opacity-30">
            <div className="bg-white w-2/3 rounded p-4">
                <div className="flex">
                    <div className="flex-2 text-xl font-bold">
                        ショッピングカート
                    </div>
                    <div className="flex-1 text-right">
                        <button 
                            className="w-4 h-4 text-sm"
                            onClick={setCartClicked}
                        >
                            ×
                        </button>
                    </div>
                </div>
                <div className="m-4 text-xl">
                    注文商品 : xxx
                </div>
                <div className="m-4 text-xl">
                    合計金額 : xxx円
                </div>
                <button 
                    className="bg-blue-500 mx-4 p-2 rounded text-white"
                    onClick={setCartClicked}
                >
                    注文する
                </button>
            </div>
        </div>
    );
}

function AddCart ({setAddClicked}:{setAddClicked : () => void}) {
    return(
        <button 
            className="flex justify-center items-center w-screen h-screen bg-black bg-opacity-30"
            onClick={setAddClicked}
        >
            <button 
                className="bg-white w-2/3 rounded p-4 "
                onClick={setAddClicked}
            >
                <button 
                    className="text-xl font-bold"
                    onClick={setAddClicked}
                >
                    カートに追加しました
                </button>
            </button>
        </button>
    );
}

function OrderCooked ({setReceiveClicked}:{setReceiveClicked: () => void}) {
    return(
        <div 
            className="flex justify-center items-center w-screen h-screen bg-black bg-opacity-30"
        >
            <div 
                className="flex justify-center bg-white w-2/3 rounded p-4 "
            >
                <div>
                    <div 
                        className="text-xl font-bold"
                    >
                        商品が完成しました
                    </div>
                    <div className="flex justify-center ">
                        <button 
                            className="bg-green-400 text-white rounded p-2 mt-2"
                            onClick={setReceiveClicked}
                        >
                            受け取り完了
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function UserMenu(){
    const [cartClicked,setCartClicked] = useState(false);
    const showCart = () => {
        setCartClicked(!cartClicked);
    };
    const [addClicked,setAddClicked] = useState(false);
    const addCart = () => {
        setAddClicked(!addClicked);
    }
    const [receiveClicked,setReceiveClicked] = useState(true);
    const reseive = () => {
        setReceiveClicked(!receiveClicked)
    }

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
    return (
        <>
            {receiveClicked ? (
                <div className="fixed top-0 left-0 z-10">
                    <OrderCooked setReceiveClicked = {() => setReceiveClicked(!receiveClicked)}/>
                </div>
            ):(
                <div></div>
            )}
            {addClicked ? (
                <div className="fixed top-0 left-0 z-10">
                    <AddCart setAddClicked = {() => setAddClicked(!addClicked)}/>
                </div>
            ):(
                <div></div>
            )}
            
            {cartClicked ? (
                <div className="fixed top-0 left-0 z-10">
                    <ShowCart setCartClicked={() => setCartClicked(!cartClicked)}/>
                </div>
            ):(
                <div></div>
            )}
            <div className="w-full gb-white">
                <div className="fixed top-0 bg-white z-5 shadow w-full">
                    <div className="flex m-4">
                        <div className="text-blue-700 text-lg font-bold">
                            学食スマートオーダー
                        </div>
                    </div>
                </div>
                <div className="mt-20 ml-4 text-lg font-bold">
                    本日のメニュー
                </div>
                <div className="mt-4">
                    {products.map(product => (
                        <div className="m-4 p-4 shadow-md">
                            <div className="font-bold">{product.name}</div>
                            <div className="flex">
                                <div className="mt-2 ml-4 mr-4 text-blue-500 font-bold">{product.price}円</div>
                                {product.stock != 0 ? (
                                    <button 
                                        className="absolute right-6 text-white bg-blue-500 hover:bg-blue-600 rounded p-2"
                                        onClick={addCart}
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
                <button className="flex items-center p-2 bg-blue-500 hover:bg-blue-600 rounded-full fixed bottom-3 right-3">
                    <img src={shoppingCart} alt="カート" className="w-8 h-8"/>
                    <button 
                        className="p-2 text-lg text-white"
                        onClick={showCart}
                    >
                        カートを見る
                    </button>
                </button>
            </div>
        </>
    )
}

export default UserMenu