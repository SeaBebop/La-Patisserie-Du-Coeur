import SVG_Food from "./SVG_Food"
const Loading_art = () => {


    return (
        <div className=' h-[75vh] flex justify-center items-center min-h-[860px]'>
            <span class="absolute shadow-sm mb-[20vw] justify-center gap-[.2vw] flex-col">
                <i className=" animate-pulse lg:flex hidden justify-center "><SVG_Food 
     /></i>
                <i className=" animate-pulse flex justify-center lg:hidden"><SVG_Food width="14vw"
    height="14vw" /></i>
                <div className='animate-pulse lg:loader-m loader '>

                    <div className="animate-bounce  bg-[#ec3c5f]">

                    </div>
                    <div className="animate-bounce  bg-[#e6e933]">

                    </div>
                    <div className="animate-bounce  bg-[#f1853c]">

                    </div>
                </div>
            </span>

        </div>
    )
}

export default Loading_art
