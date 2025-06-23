function ManageSignup(){
    return(
        <>
            <div className="h-screen bg-gray-200">
                <div className="flex h-screen items-center justify-center">
                    <div  className="bg-white rounded">
                        <div className="text-xl text-blue-700 p-2 mx-2">管理者としてアカウント登録</div>
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

export default ManageSignup