import ManageSidebar from '../component/manageSidebar'

function MenuManage(){
    return(
        <>
            <div className="flex">
                <div className="fixed top-0 left-0">
                    <ManageSidebar/>
                </div>
                <div className="m-4 ml-44 text-lg font-bold">
                    メニュー・在庫管理
                </div>
            </div>
        </>
    )
}

export default MenuManage