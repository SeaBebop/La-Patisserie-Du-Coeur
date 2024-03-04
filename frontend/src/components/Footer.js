import { Link } from "react-router-dom"
import SVG_facebook from "./SVG_Facebook"
import SVG_instagram from "./SVG_Instagram"
import SVG_twitter from "./SVG_Twitter"
import SVG_Github from './SVG_Github.js';
import useAuth from "../Hooks/useAuth.js";
import jwt_decode from 'jwt-decode'
import SVG_Spoon_Fork from "./SVG_Spoon_Fork.js";

const Footer = () => {
  const { auth } = useAuth();
  const access_token = auth.accessToken;
  const decoded = auth?.accessToken ?
    jwt_decode(auth.accessToken) : undefined
  return (
    <div className="bottom-0">
      {/*Mobile*/}
      <div id='footer-m' className="overflow-y-hidden  w-[100vw] lg:hidden gap-[1vw] min-h-[20vw] mt-[1vw] bottom-0 text-white  bg-[#ee4848] lg:h-[16vw] flex flex-col items-center justify-center ">

        <div className="flex mt-[.2vw] gap-[3vw]">
          <i className="cursor-pointer  hover:opacity-70"><SVG_facebook width='4.5vw' height='4.5vw' /></i>
          <i className="cursor-pointer  hover:opacity-70"><SVG_instagram width='4.5vw' height='4.5vw' /></i>
          <i className="cursor-pointer  hover:opacity-70"><SVG_twitter width='4.5vw' height='4.5vw' /></i>
          <i className="cursor-pointer  hover:opacity-70"><SVG_Github width='4.5vw' height='4.5vw' /></i>
        </div>


        <div className="flex h-[.2vw] w-[70vw] border-b ">

        </div>
        <div className="text-[1.2vw]">

          © 2019-2023 La Patisserie du Coeur. All rights reserved.
        </div>
        <div className="absolute right-0 items-end">

        </div>

      </div>
      {/*Desktop*/}
      <div id='footer-d' className="overflow-y-hidden hidden min-h-[20vw] lg:flex w-[100vw] gap-[1vw] mt-[1vw] bottom-0 text-white  bg-[#ee4848] lg:h-[16vw]  flex-col items-center justify-center ">

        <div className="flex mt-[.2vw] gap-[3vw]">
          <i className="cursor-pointer  hover:opacity-70"><SVG_facebook width='3vw' height='3vw' /></i>
          <i className="cursor-pointer  hover:opacity-70"><SVG_instagram width='3vw' height='3vw' /></i>
          <i className="cursor-pointer  hover:opacity-70"><SVG_twitter width='3vw' height='3vw' /></i>
          <i className="cursor-pointer  hover:opacity-70"><SVG_Github width='3vw' height='3vw' /></i>
        </div>


        <div className="flex h-[.2vw] w-[50vw] border-b ">

        </div>
        <div className="text-[1vw]">

          © 2019-2023 La Patisserie du Coeur. All rights reserved.
        </div>
        <div className="absolute right-0 items-end">

        </div>

      </div>
    </div>
  )
}

export default Footer