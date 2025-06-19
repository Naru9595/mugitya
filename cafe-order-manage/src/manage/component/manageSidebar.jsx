function ManageSidebar(){
    return(
        <>
            <div className="w-40 text-white bg-slate-800 h-screen">
                <div className="p-4 text-base">
                    管理メニュー
                </div>
                <div className="text-xs hover:bg-slate-700">
                    <a href="./orderManage" className="p-4 w-full block">
                        注文管理
                    </a>
                </div>
                <div className="text-xs hover:bg-slate-700">
                    <a href="./menuManage" className="p-4 w-full block">
                        メニュー・在庫管理
                    </a>
                </div>
                <div className="text-xs hover:bg-slate-700">
                    <a href="./salesAnalyze" className="p-4 w-full block">
                        売り上げ分析
                    </a>
                </div>
                <div className="text-xs hover:bg-slate-700">
                    <a href="./manageSetting" className="p-4 w-full block">
                        設定
                    </a>
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