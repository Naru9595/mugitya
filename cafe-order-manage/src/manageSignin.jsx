function ManageSignin(){
    return(
        <>
            <div className="h-screen bg-gray-200">
                <div className="flex h-screen items-center justify-center">
                    <div  className="bg-white">
                        <div className="text-xl text-blue-700">管理者としてログイン</div>
                        <div className="text-xs">メールアドレス</div>
                        <input type="email" placeholder="kosentarou@gmail.com"/>
                        <div className="text-xs">パスワード</div>
                        <input type="password" placeholder="KosenTarou-01"/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ManageSignin