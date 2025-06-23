function UserSignin(){
    return(
        <>
            <div className="h-screen bg-gray-200">
                <div className="flex h-screen items-center justify-center">
                    <div  className="bg-white rounded w-auto">
                        <div className="flex justify-center text-xl text-blue-700 p-2 mx-10 font-bold">学食スマートオーダー</div>
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
                        <a href="./userMenu" className="flex justify-center text-sm text-white rounded mx-2 mt-2 mb-3 py-1 bg-blue-500 hover:bg-blue-600">
                            ログイン
                        </a>
                        <div className="border-t border-dashed border-gray-500">
                            <a href="./userSignup" className="flex justify-center text-sm text-white rounded mx-2 my-3 py-1 bg-green-500 hover:bg-green-600">
                                新規登録
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserSignin