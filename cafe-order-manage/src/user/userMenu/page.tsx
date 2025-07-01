import shoppingCart from '../../icons/shoppingCart.svg';

function UserMenu(){
    return (
        <>
            <div className="w-full gb-white">
                <div className="fixed top-0 bg-white z-10 shadow w-full">
                    <div className="flex m-4">
                        <div className="text-blue-700 text-lg font-bold">
                            学食スマートオーダー
                        </div>
                    </div>
                </div>
                <div className="mt-20 ml-4 text-lg font-bold">
                    本日のメニュー
                </div>
                <button>
                    <img src={shoppingCart} alt="カート" className="bg-blue-500 rounded-full w-10 h-10 fixed bottom-3 right-3" />
                </button>
            </div>
        </>
    )
}

export default UserMenu