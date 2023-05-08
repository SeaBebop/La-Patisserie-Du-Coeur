import { Link } from "react-router-dom"
import SVG_facebook from "./SVG_Facebook"
import SVG_instagram from "./SVG_Instagram"
import SVG_twitter from "./SVG_Twitter"



const Footer = () =>{
    return (
        <div id='footer' className="absolute w-[100vw] mt-[2vw] items-center text-slate-300 justify-end bg-[#ee4848] h-[7vw] flex">
        <div className="flex gap-[1vw]">
          <i className="cursor-pointer  hover:opacity-70"><SVG_facebook /></i>
          <i className="cursor-pointer  hover:opacity-70"><SVG_instagram /></i>
          <i className="cursor-pointer  hover:opacity-70"><SVG_twitter /></i>
          <Link to="/terms" className="  border-l pl-[1vw] hover:text-slate-400 rounded-sm text-[1.3vw] font-semibold ">terms and conditions</Link>
          <Link to="/privacy" className="   rounded-sm text-[1.3vw] hover:text-slate-400 font-semibold mr-[10vw]">privacy</Link>
        </div>
      </div>
      
    )
}

export default Footer