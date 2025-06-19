import ManageSidebar from '../component/manageSidebar'


function OrderManage(){
    return(
        <>
            <div className="flex">
                <ManageSidebar/>
                <div className="h-screen m-4 text-lg font-bold">
                    注文管理
                </div>
            </div>
        </>
    )
}

export default OrderManage