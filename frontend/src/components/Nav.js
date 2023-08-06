import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext.js";
import useLogout from "../Hooks/useLogout.js";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios"
import SVG_Spoon_Fork from "./SVG_Spoon_Fork.js";
import SVG_Cart from "./SVG_Cart.js";
import SVG_Location from "./SVG_Location.js";
import SVG_Story from "./SVG_Story.js";
import Cart from "../pages/cart.js";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import PersistLogin from "./PersistLogin.js";
import Products from "../pages/products.js";
import useCartChecker from "../Hooks/useCartChecker.js";

import useAuth from "../Hooks/useAuth.js";
const CART_URL = 'http://127.0.0.1:8000/api/v1/cart/'

const Navbar = () => {

  const containerRef = useRef(null);
  const { auth } = useAuth();

  const { cartTrigger, setcartTrigger } = useCartChecker();

  //Scrolling https://stackoverflow.com/questions/29725828/update-style-of-a-component-onscroll-in-react-js
  const [offset, setOffset] = useState(0);
  
  useEffect(() => {
    //I didn't know that you can constantly listen to information after the inital use
    //Of a useEffect
    const onScroll = () => setOffset(window.scrollY);
    // clean up code
    window.removeEventListener('scroll', onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(()=>{
      if(offset >0){
     
          document.getElementById("navbar").style.backgroundColor = "#000000ea";
      }else{
        document.getElementById("navbar").style.backgroundColor = "#000000de";
      }
    },[offset])

  //Navbar set Up
  const navigate = useNavigate();
  const logout = useLogout();
  const [data, setData] = useState('');
  const access_token = auth.accessToken === undefined ? undefined : auth.accessToken;
  const header_context = access_token === undefined ? { 'Content-Type': 'application/json', } :
    {
      'Authorization': `JWT ${access_token}`,
      'Content-Type': 'application/json',
    }
  const signOut = async () => {
    await logout();
    navigate('/');
  }

  useEffect(() => {
    setcartTrigger(1);
    //Testing out useContext
    //console.log('what does this do? ',cartTrigger);
    //console.log('This somehow triggered');
  },
    [access_token, cartTrigger])
  useEffect(() => {
    const fetchCart = async () => {
      const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

      await sleep(300);
      try {
        const response = await axios.get(CART_URL, {
          headers: header_context, withCredentials: true
        })
        //Added this condition once I realized that the website bricks
        //If the cart is empty
        console.log('fetched', response.data.length);
        setData(response.data.length);

      }

      catch (err) {
        if (err.response) {
          console.log(err.response.data)
          console.log(err.response.status)
        }
        else {
          console.log('failed to connect to server')
        }
      }
    }
    fetchCart();
    console.log('Finally this  triggered')
  }
    , [access_token, cartTrigger])
  const backgroundURL =
    'url("")';

  return (
    <div id="navbar"  className="fixed flex h-[9vw] w-[100vw] bg-[#000000de]  z-[10000] justify-center items-center overflow-hidden ">

      <div className="flex flex-row gap-[2vw] text-white font-body text-[1.3vw] ml-[-9vw]  items-center">
      <Link className=" shadows-text  hover:opacity-70 rounded-[0.07rem]   bg   flex flex-row ml-[1vw] " bg- to="/" >HOME</Link>
        <Link to="/products" className=" shadows-text  hover:opacity-70 font-semibold rounded-[0.07rem]  bg  flex flex-row ml-[1vw]" ><i className=" "><SVG_Spoon_Fork /></i>  ORDER!!</Link>
        <Link to="/cart" className="    shadows-text flex flex-row hover:opacity-70  rounded-lg " ><i className=""><SVG_Cart /></i>CART & CHECKOUT
          {data != 0 ?
            <div className="bg-red-500 rounded-full px-[.6vw]">
              {data}
            </div> :
            <div></div>
          }

        </Link>

        <Link className="hover:opacity-80  " bg- to="/" >
          <div className="flex flex-col justify-center text-[1.4] shadows-text mx-[1vw] items-center">

            <h1 className="font-Fancy text-[3.5vw] text-orange-200">L</h1>
            <h1 className="text-blue-300">LA PATISSERIE</h1>
            <h2 className="text-red-400 ">DU COEUR</h2>

            {/* Original idea until I decided to just create a logo with canva.com
        <div className=" text-[#faa41a]  border-t-[.2vw] border-white  z-[10] text-[1.7vw] font-bold pl-[2.5vw] pr-[1vw]">
          La Pâtisserie
        </div>
        <div className="ml-[3vw] text-[#ffd93a] mt-[-1vw]  border-b-[.2vw] border-white text-[1.7vw] font-semibold pl-[2vw]">
        du Coeur
        </div>*/}
          </div>

        </Link>

        <Link to="/purchase-history" className=" shadows-text  flex flex-row hover:opacity-70  rounded-lg " >PURCHASE HISTORY</Link>

      

      {auth.accessToken ? (
        <div>
          <button className="shadows-text text-[1.3vw]  hover:opacity-70 " onClick={signOut}>Log Out</button>

        </div>
      )
        :
        <div className="  font-semibold flex font-body shadows-text text-[1.3vw]  gap-[2vw] items-center">
          <Link to="/sign-in" className="hover:opacity-70">SIGNUP</Link>
          <Link to="/login" className="hover:opacity-70">LOGIN</Link>

        </div>

      }
</div>
      {/* testing if context works, it works !
  {auth.accessToken && <p>hello {auth.username}</p>} */
      }

    </div>

  )
}


export default Navbar;