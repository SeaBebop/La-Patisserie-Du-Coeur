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
const CART_URL = '/api/v1/cart/'

const Navbar = () => {

  const containerRef = useRef(null);
  const { auth } = useAuth();

  const { cartTrigger, setcartTrigger } = useCartChecker();
  const [activedBurger, setActivatedBurger] = useState(false);
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

  useEffect(() => {
    if (offset > 0) {

      document.getElementById("navbar-d").style.backgroundColor = "#000000ea";
      document.getElementById("navbar-m").style.backgroundColor = "#000000e5";
    } else {

      document.getElementById("navbar-d").style.backgroundColor = "#000000de";
      document.getElementById("navbar-m").style.backgroundColor = "#000000e5";
    }
  }, [offset])
  const hamburger = () => {
    if (document.getElementById("hamburgerBTN").className == "menu") {
      document.getElementById("hamburgerBTN").className = "menu opened";
      setActivatedBurger(true);

    } else {
      document.getElementById("hamburgerBTN").className = "menu";
      setActivatedBurger(false);

    }
  }
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
    setcartTrigger(10);
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
        setData(response.data.length);

      }

      catch (err) {
        if (err.response) {

        }
        else {
          console.log('failed to connect to server')
        }
      }
    }
    fetchCart();
    console.log('Finally this  triggered')
  }
    , [access_token])
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
          setData(response.data.length);
  
        }
  
        catch (err) {
          if (err.response) {
  
          }
          else {
            console.log('failed to connect to server')
          }
        }
      }
      fetchCart();
      console.log('Finally this  triggered')
    }
      , [ cartTrigger])

  return (
    <div>
      {/*Desktop*/}
      <div id="navbar-d" className="fixed lg:flex h-[9vw] w-[100vw]   bg-[#000000de] hidden z-[10000] justify-center items-center overflow-x-hidden ">
        {/*Next time plan ahead for mobile and desktop design*/}
        <div className="flex flex-row gap-[2vw] text-white font-body text-[1.3vw] ml-[-9vw] lg:justify-center justify-around  w-screen items-center">


          <Link className=" shadows-text flex  hover:opacity-70 rounded-[0.07rem]   bg    flex-row ml-[1vw] " bg- to="/" >HOME</Link>
          <Link to="/items" className=" flex    shadows-text  hover:opacity-70 font-semibold rounded-[0.07rem]  bg   flex-row ml-[1vw]" ><i className=" "><SVG_Spoon_Fork /></i>  ORDER!!</Link>
          <Link to="/cart" className="  flex     shadows-text  flex-row hover:opacity-70  rounded-lg " ><i className=""><SVG_Cart /></i>CART & CHECKOUT
            {data != 0 ?
              <div className="bg-red-500  flex    rounded-full px-[.6vw]">
                {data}
              </div> :
              <div></div>
            }

          </Link>
          <Link className="hover:opacity-80    " bg- to="/" >
            <div className="flex-col flex justify-center text-[1.4] shadows-text mx-[1vw] items-center">



              <h1 className="font-Fancy text-[3.5vw]     text-orange-200">L</h1>
              <h1 className="text-blue-300    ">LA PATISSERIE</h1>
              <h2 className="text-red-400     ">DU COEUR</h2>

              {/* Original idea until I decided to just create a logo with canva.com
     <div className=" text-[#faa41a]  border-t-[.2vw] border-white  z-[10] text-[1.7vw] font-bold pl-[2.5vw] pr-[1vw]">
       La Pâtisserie
     </div>
     <div className="ml-[3vw] text-[#ffd93a] mt-[-1vw]  border-b-[.2vw] border-white text-[1.7vw] font-semibold pl-[2vw]">
     du Coeur
     </div>*/}
            </div>
          </Link>

          <Link to="/purchase-history" className="  lg:visible lg:flex  hidden   shadows-text   flex-row hover:opacity-70  rounded-lg " >PURCHASE HISTORY</Link>



          {auth.accessToken ? (
            <div className=" lg:visible lg:flex  hidden  ">
              <button className="shadows-text text-[1.3vw]  hover:opacity-70 " onClick={signOut}>Log Out</button>

            </div>
          )
            :
            <div className="  font-semibold  lg:visible lg:flex  hidden    font-body shadows-text text-[1.3vw]  gap-[2vw] items-center">
              <Link to="/sign-in" className="hover:opacity-70">SIGNUP</Link>
              <Link to="/login" className="hover:opacity-70">LOGIN</Link>

            </div>

          }


        </div>
      </div>
      <div id="navbar-m" className={activedBurger === false ? "fixed lg:hidden min-h-[75px] h-[10vh]  w-[100vw] bg-[#000000de] flex transition-all delay-75  z-[10000] justify-center items-center overflow-x-hidden " : "fixed lg:hidden transition-all delay-75 h-[50vw] overflow-x-hidden  w-[100vw] bg-[#000000e5] flex  z-[10000] justify-center items-center overflow-hidden "}>
        <div className="flex  flex-row gap-[2vw]  text-white font-body text-[1.3vw] ml-[-9vw] lg:justify-center justify-around  w-screen items-center">
          <div className="lg:hidden flex mr-[10vw] hover:opacity-60 visible">
            <button id='hamburgerBTN' class="menu" onClick={() => { hamburger(); }} aria-label="Main Menu">
              <svg width="8vw" height="10vw" viewBox="0 0 100 100">
                <path class="line line1" d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058" />
                <path class="line line2" d="M 20,50 H 80" />
                <path class="line line3" d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942" />
              </svg>
            </button>
          </div>
          <div id='mobile-bar' className={activedBurger === false ? "flex w-[50vw]  items-center gap-[1.5vw] transition-all delay-500 opacity-100" : "hidden transition-all delay-500 opacity-0"}>


            <Link className=" shadows-text lg:visible lg:flex  hidden  hover:opacity-70 rounded-[0.07rem]   bg    flex-row ml-[1vw] " bg- to="/" >HOME</Link>
            <Link to="/items" className="  lg:visible lg:flex  hidden   shadows-text  hover:opacity-70 font-semibold rounded-[0.07rem]  bg   flex-row ml-[1vw]" ><i className=" "><SVG_Spoon_Fork /></i>  ORDER!!</Link>
            <Link to="/cart" className="  lg:visible lg:flex  hidden     shadows-text  flex-row hover:opacity-70  rounded-lg " ><i className=""><SVG_Cart /></i>CART & CHECKOUT
              {data != 0 ?
                <div className="bg-red-500  lg:visible lg:flex  hidden   rounded-full px-[.6vw]">
                  {data}
                </div> :
                <div></div>
              }

            </Link>
            {/* Mobile*/}
            <Link className="hover:opacity-80 lg:hidden flex " bg- to="/" >

              <div className=" flex-row gap-[2vw] lg:hidden flex  text-[3vw] shadows-text mx-[1vw] items-center">



                <h1 className="font-Fancy text-[6vw] mr-[10vw]  text-orange-200">L</h1>



                {/* Original idea until I decided to just create a logo with canva.com
        <div className=" text-[#faa41a]  border-t-[.2vw] border-white  z-[10] text-[1.7vw] font-bold pl-[2.5vw] pr-[1vw]">
          La Pâtisserie
        </div>
        <div className="ml-[3vw] text-[#ffd93a] mt-[-1vw]  border-b-[.2vw] border-white text-[1.7vw] font-semibold pl-[2vw]">
        du Coeur
        </div>*/}
              </div>


            </Link>
            <div className="flex flex-row mr-[1vw]">
              <Link to="/cart" className="  lg:hidden flex  text-[3vw] shadows-text  flex-row hover:opacity-70  rounded-lg " >
                <i className="mt-[.4vw]">
                  <SVG_Cart width='4vw' height='4vw' /></i>
                <div className="  text-[4vw] ">
                  CART
                </div>
                {data != 0 ?
                  <div className="bg-red-500  lg:hidden flex  mt-[.4vw] text-[3vw] rounded-full md:w-[4vw] h-[4vw]  px-[1.4vw]">
                    {data}
                  </div> :
                  <div></div>
                }
              </Link>
              <Link to="/items" className=" lg:hidden flex   shadows-text text-[4vw]  hover:opacity-70 font-semibold rounded-[0.07rem]  bg   flex-row ml-[1vw]" >
                <i className="mt-[.5vw] "><SVG_Spoon_Fork width='4vw' height='4vw' /></i>  ORDER!!</Link>

            </div>

          </div>
          <div id='mobile-bar' className={activedBurger === true ? "flex items-center opacity-100 delay-500 transition-all" : "hidden delay-500 transition-all opacity-0"}>

            <div className=" w-[50vw] h-[50vw] flex flex-col">
              <div className=" flex justify-center items-center  h-[25%]">
              <Link to="/items" onClick={()=>{hamburger();}}  className=" lg:hidden flex   shadows-text text-[4.7vw]  hover:opacity-70 font-semibold rounded-[0.07rem]  bg   flex-row ml-[1vw]" >
                  <i className=" "><SVG_Spoon_Fork width='5vw' height='5vw' /></i>  ORDER!!</Link>
              </div>
              <div className="  flex justify-center items-center h-[25%]">

                    <Link to="/purchase-history" onClick={()=>{hamburger();}}  className="shadows-text text-[4.7vw] flex-row hover:opacity-70  rounded-lg " >PURCHASE HISTORY</Link>
              </div>
              <div className=" flex justify-center items-center h-[25%]">
                <Link to="/cart" onClick={()=>{hamburger();}}  className="  lg:hidden flex  text-[3vw] shadows-text  flex-row hover:opacity-70  rounded-lg " >
                  <i className="">
                    <SVG_Cart width='5vw' height='5vw' /></i>
                  <div className="  text-[4.7vw] ">
                    CART
                  </div>
                  {data != 0 ?
                    <div className="bg-red-500  lg:hidden flex  text-[3.6vw] rounded-full md:w-[6vw] h-[6vw]  px-[2vw]">
                      <p className="mt-[.4vw]">{data}</p>
                    </div> :
                    <div></div>
                  }
                </Link>
              </div>
              <div className=" flex justify-center items-center h-[25%]">
                {auth.accessToken ? (

                  <button   className="shadows-text text-[4.7vw]   hover:opacity-70 " onClick={()=>{hamburger();signOut();}}>Log Out</button>


                )
                  :
                  <div className="  flex font-body shadows-text text-[4.4vw]   gap-[5vw] items-center">
                    <Link to="/sign-in" onClick={()=>{hamburger();}} className="hover:opacity-70">SIGNUP</Link>
                    <Link to="/login" onClick={()=>{hamburger();}}  className="border-l pl-[3.25vw] hover:opacity-70">LOGIN</Link>

                  </div>

                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}


export default Navbar;