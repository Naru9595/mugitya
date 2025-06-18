function ManageSidebar(){
    return(
        <>
            <div className="w-40 text-white bg-slate-800 h-screen">
                <div className="p-2 text-base">
                    <button>管理メニュー</button>
                </div>
                <div className="p-4 text-xs">
                    <button>注文管理</button>
                </div>
                <div className="p-4 text-xs">
                    <button>メニュー・在庫管理</button>
                </div>
                <div className="p-4 text-xs">
                    <button>売り上げ分析</button>
                </div>
                <div className="p-4 text-xs">
                    <button>設定</button>
                </div>
                <div className="p-4 absolute bottom-4 text-xs">
                    <div>kosentarou@gmail.com</div>
                    <div className="text-red-300">
                        <button>ログアウト</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ManageSidebar