import ManageSidebar from '../component/manageSidebar'

function SalesAnalyze(){
    return(
        <>
            <div className="flex bg-gray-200 h-screen">
                <div className="fixed top-0 left-0">
                    <ManageSidebar/>
                </div>
                <div className="m-4 ml-44 text-lg font-bold">
                    売り上げ分析
                </div>
            </div>
        </>
    )
}

export default SalesAnalyze