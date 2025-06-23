import ManageSidebar from '../component/manageSidebar'


function OrderManage(){
    return(
        <>
            <div className="flex">
                <div className="fixed top-0 left-0">
                    <ManageSidebar/>
                </div>
                <div className="h-screen m-4 ml-44 text-lg font-bold">
                    注文管理
                </div>
            </div>
        </>
    )
}

export default OrderManage