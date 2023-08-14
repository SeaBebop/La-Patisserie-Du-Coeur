import { Link } from "react-router-dom"
import SVG_facebook from "./SVG_Facebook"
import SVG_instagram from "./SVG_Instagram"
import SVG_twitter from "./SVG_Twitter"
import SVG_Github from './SVG_Github.js';


const Footer = () => {
  return (
    <div>
      {/*Desktop*/}
      <div id='footer-d' className="overflow-y-hidden w-[100vw] hidden mt-[1vw] bottom-0 text-white  bg-[#ee4848] lg:h-[13vw] lg:flex flex-col">
        <div className="flex flex-row justify-evenly">
          <div className="flex-col flex">
            <div className=" mt-[.5vw] mr-[5vw]">
              <h1 class="font-Fancy text-[3.5vw] text-orange-200">La Patisserie </h1>
              <h1 class="font-Fancy text-[3.5vw] text-orange-200"> Du Coeur </h1>

            </div>


          </div>
          <div className="flex-col flex">
            <div>
              <p className="text-[1.45vw] text-black">Contact</p>
            </div>
            <div>
              <p className="text-[1.15vw]">Phone: +1 (555) 123-4567</p>
            </div>
            <div>
              <p className="text-[1.15vw]">Email: lapatisserieducoeur@gmail.com</p>
            </div>
            <div>
              <p className="text-[1.15vw]"> Address:123 Main Street, Anytown, USA</p>
            </div>

          </div>
          <div className="flex-col flex">
            <div>
              <p className="text-[1.45vw] text-black">Keep in Touch!</p>
            </div>
            <div className="flex mt-[.2vw]">
              <i className="cursor-pointer  hover:opacity-70"><SVG_facebook /></i>
              <i className="cursor-pointer  hover:opacity-70"><SVG_instagram /></i>
              <i className="cursor-pointer  hover:opacity-70"><SVG_twitter /></i>
              <i className="cursor-pointer  hover:opacity-70"><SVG_Github /></i>
            </div>


          </div>
        </div>
        <div className="flex justify-end">
          <Link to="/terms" className="   pl-[1vw] hover:text-slate-400 rounded-sm mr-[1vw]  text-[1vw] font-semibold ">terms and conditions</Link>
          <Link to="/privacy" className=" border-l pl-[1vw]  rounded-sm text-[1vw] hover:text-slate-400 font-semibold mr-[10vw]">privacy</Link>
        </div>
      </div>
      {/*Mobile*/}
      <div id='footer-m' className="overflow-y-hidden w-[100vw]  mt-[4vw] bottom-0 text-white lg:hidden  bg-[#ee4848]  items-center  h-auto  flex flex-col">
        <div className="flex lg:flex-row flex-col">
          <div className="flex-col flex ">
            <div className=" mt-[.5vw] mr-[5vw]">
              <h1 class="font-Fancy text-[5vw] lg:text-[3.5vw] text-orange-200">La Patisserie </h1>
              <h1 class="font-Fancy text-[5vw]  lg:text-[3.5vw] text-orange-200"> Du Coeur </h1>

            </div>


          </div>
          <div className="flex flex-row gap-[4vw]">
          <div className="flex-col text-[3vw] ">
            <div>
              <p className="text-[3.45vw]  text-black">Contact</p>
            </div>
            <div>
              <p className="">Phone: +1 (555) 123-4567</p>
            </div>
            <div>
              <p className="">Email: lapatisserieducoeur@gmail.com</p>
            </div>
            <div>
              <p className=""> Address:123 Main Street, Anytown, USA</p>
            </div>

          </div>
          <div className="flex-col flex">
            <div>
              <p className="text-[3.45vw] text-black">Keep in Touch!</p>
            </div>
            <div className="flex mt-[.2vw]">
              <i className="cursor-pointer  hover:opacity-70"><SVG_facebook width={"5.7vw"} height={"5.7vw"}/></i>
              <i className="cursor-pointer  hover:opacity-70"><SVG_instagram width={"5.7vw"} height={"5.7vw"}/></i>
              <i className="cursor-pointer  hover:opacity-70"><SVG_twitter width={"5.7vw"} height={"5.7vw"}/></i>
              <i className="cursor-pointer  hover:opacity-70"><SVG_Github width={"5.7vw"} height={"5.7vw"}/></i>
            </div>


          </div>
          </div>
          
        </div>
        <div className="flex justify-end mt-[1vw] text-[2.4vw]">
          <Link to="/terms" className="   pl-[1vw] hover:text-slate-400 rounded-sm mr-[1vw]  font-semibold ">terms and conditions</Link>
          <Link to="/privacy" className=" border-l pl-[1vw]  rounded-sm  hover:text-slate-400 font-semibold mr-[10vw]">privacy</Link>
        </div>
      </div>
    </div>

  )
}

export default Footer