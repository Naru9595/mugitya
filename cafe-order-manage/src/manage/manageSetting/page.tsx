import ManageSidebar from '../component/manageSidebar'


function ManageSetting(){
    return(
        <>
            <div className="flex">
                <div className="fixed top-0 left-0">
                    <ManageSidebar/>
                </div>
                <div className="m-4 ml-44 text-lg font-bold">
                    設定
                </div>
            </div>
        </>
    )
}

export default ManageSetting