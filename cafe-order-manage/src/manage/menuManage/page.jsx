import ManageSidebar from '../component/manageSidebar'

function MenuManage(){
    return(
        <>
            <div className="flex">
                <ManageSidebar/>
                <div className="h-screen m-4 text-lg font-bold">
                    メニュー・在庫管理
                </div>
            </div>
        </>
    )
}

export default MenuManage