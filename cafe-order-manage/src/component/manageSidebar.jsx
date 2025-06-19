function ManageSidebar(){
    return(
        <>
            <div className="w-40 text-white bg-slate-800 h-screen">
                <div className="p-4 text-base">
                    管理メニュー
                </div>
                <div className="p-4 text-xs hover:bg-slate-700">
                    <button>注文管理</button>
                </div>
                <div className="p-4 text-xs hover:bg-slate-700">
                    <button>メニュー・在庫管理</button>
                </div>
                <div className="p-4 text-xs hover:bg-slate-700">
                    <button>売り上げ分析</button>
                </div>
                <div className="p-4 text-xs hover:bg-slate-700">
                    <button>設定</button>
                </div>
                <div className="p-4 absolute bottom-4 text-xxs">
                    <div>k21200hw@apps.kct.ac.jp</div>
                    <div className="w-20 text-red-500 hover:text-red-400">
                        <button>ログアウト</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ManageSidebar