import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return(
    <div className="mt-[12vw] h-[16vw]  flex flex-col items-center justify-center ml-[37vw] w-[28vw] bg-[#1a58ab] rounded-md shadow-lg">
    <p className="text-white">You can't be in the salty splatoon!</p>

    <button className={"rounded-md  py-[.2vw] w-[20vw]  mb-[2vw] hover:bg-slate-300 bg-slate-100"}  onClick={goBack}>Go Back</button>    
    </div>
  
  )
}

export default Unauthorized