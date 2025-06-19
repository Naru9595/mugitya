import ManageSidebar from '../component/manageSidebar'


function ManageSetting(){
    return(
        <>
            <div className="flex">
                <ManageSidebar/>
                <div className="h-screen m-4 text-lg font-bold">
                    設定
                </div>
            </div>
        </>
    )
}

export default ManageSetting