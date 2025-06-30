import ManageSidebar from '../component/manageSidebar'


function ManageSetting(){
    return(
        <>
            <div className="flex bg-gray-200 h-screen">
                <div className="fixed top-0 left-0">
                    <ManageSidebar/>
                </div>
                <div className="m-4 ml-44 text-lg font-bold w-screen">
                    <div>設定</div>
                    <div className="bg-white m-4 rounded pb-1 px-1">
                        <div className="text-base p-2">アカウント作成</div>
                        <div className="px-2 pb-2">
                            <div className="text-xs">メールアドレス</div>
                            <div>
                                <input type="email" placeholder="kosentarou@gmail.com" className="w-full rounded border border-gray-500"/>
                            </div>
                        </div>
                        <div className="px-2 pb-2">
                            <div className="text-xs">パスワード</div>
                            <div>
                                <input type="password" placeholder="KosenTarou-01" className="w-full rounded border border-gray-500"/>
                            </div>
                        </div>
                        <div className="px-2 pb-2">
                            <div className="text-xs">パスワード（確認用）</div>
                            <div>
                                <input type="password" placeholder="KosenTarou-01" className="w-full rounded border border-gray-500"/>
                            </div>
                        </div>
                        <a href="./orderManage" className="flex justify-center text-sm text-white rounded mx-2 mt-2 mb-3 py-1 bg-green-500 hover:bg-green-600">
                                新規登録
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ManageSetting