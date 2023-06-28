import React, { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext.js";
import useLogout from "../Hooks/useLogout.js";
import { useNavigate } from "react-router-dom";
import SVG_Spoon_Fork from "./SVG_Spoon_Fork.js";
import SVG_Cart from "./SVG_Cart.js";
import SVG_Location from "./SVG_Location.js";
import SVG_Story from "./SVG_Story.js";
import Cart from "../pages/cart.js";
import { LazyLoadImage } from 'react-lazy-load-image-component';

const Navbar = () => {
  const containerRef = useRef(null);  
  let { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const logout = useLogout();

  const signOut = async () => {
    await logout();
    navigate('/');
  }


  const backgroundURL =
    'url("")';

  return (
    <div id="navbar"  className="fixed flex h-[10vw]   w-[99.9vw]  z-[10000] justify-end items-center overflow-hidden ">

      <Link className="hover:opacity-80  mr-[25vw]" bg- to="/" >
        <div className="">

          <LazyLoadImage className="h-[10vw]  ease-in z-[10] " 
          effect={"opacity"}
            loading="lazy"
            src="https://i.ibb.co/nQV2vQZ/La-P-tisserie-du-Coeur-Seal.png" alt="" />

          {/* Original idea until I decided to just create a logo with canva.com
        <div className=" text-[#faa41a]  border-t-[.2vw] border-white  z-[10] text-[1.7vw] font-bold pl-[2.5vw] pr-[1vw]">
          La Pâtisserie
        </div>
        <div className="ml-[3vw] text-[#ffd93a] mt-[-1vw]  border-b-[.2vw] border-white text-[1.7vw] font-semibold pl-[2vw]">
        du Coeur
  </div>*/}
        </div>

      </Link>
      <div className=" flex-row flex  h-[3vw] border-t-[.1vw] justify-between border-r-[.1vw]  border-blue-500 mr-[4vw]  w-[50vw] bg-[#034baaf1] shadow-lg  text-white pr-[1vw]  rounded-sm gap-[5vw]">
        <div className=" absolute flex border-b-[.1vw] border-l-[.1vw] border-red-400 h-[2.7vw] w-[50vw] mt-[.8vw]  -right-0 mr-[5.2vw] z-[-10] rounded-sm bg-[#fe3232]">

        </div>
        <div className="flex flex-row gap-[2vw] font-body  text-[1.4vw] items-center">
          <Link to="/products" className="   text-[#02f407] hover:opacity-70 rounded-[0.07rem]  bg font-semibold flex flex-row ml-[1vw]" ><i className=" "><SVG_Spoon_Fork /></i>  ORDER</Link>
          <Link to="/cart" className="  font-semibold flex flex-row hover:opacity-70  rounded-lg " ><i className=""><SVG_Cart /></i>CART</Link>
          <Link to="/purchase-history" className="  font-semibold flex flex-row hover:opacity-70  rounded-lg " >PURCHASE HISTORY</Link>
         
        </div>

        {auth.accessToken ? (
          <div>
            <button onClick={signOut}>Log Out</button>
           
          </div>
        )
          :
          <div className="  font-semibold flex font-body  text-[1.2vw]  gap-[2vw] items-center">
            <Link to="/sign-in" className="hover:opacity-70">SIGNUP</Link>
            <Link to="/login" className="hover:opacity-70">LOGIN</Link>

          </div>

        }

        {/* testing if context works, it works !
  {auth.accessToken && <p>hello {auth.username}</p>} */
        }
      </div>
    </div>

  )
}


export default Navbar;