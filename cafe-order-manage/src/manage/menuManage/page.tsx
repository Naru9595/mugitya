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
    return(
        <>
            {addClicked ? (
                <div className="fixed top-0 left-0 z-10">
                    <AddMenu setAddClicked={() => setAddClicked(!addClicked)}/>
                </div>
            ):(
                <div></div>
            )}
            
            <div className="flex bg-gray-200 h-screen">
                <div className="fixed top-0 left-0">
                    <ManageSidebar/>
                </div>
                <div className="m-4 ml-44">
                    <div className="text-lg font-bold">
                        メニュー・在庫管理
                    </div>
                </div>
                <button 
                    className="absolute top-2 text-white right-5 bg-blue-500 hover:bg-blue-600 p-2 rounded z-1"
                    onClick={addMenu}
                    >
                        メニュー追加
                </button>
                    
                
            </div>
        </>
    )
}

export default MenuManage