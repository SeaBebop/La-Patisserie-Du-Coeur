import { useEffect, useRef, useState } from "react"
import SVG_Story from "../components/SVG_Story";
import SVG_Location from "../components/SVG_Location";
import SVG_Star from "../components/SVG_Star";
import SVG_Star_Full from "../components/SVG_Star_Full";
import SVG_Pastries from '../components/SVG_Pastries.js';
import SVG_Bagel from '../components/SVG_Bagel.js';
import SVG_Cake from '../components/SVG_Cake.js';
import { Link } from "react-router-dom";
import SVG_facebook from "../components/SVG_Facebook";
import SVG_instagram from "../components/SVG_Instagram";
import SVG_twitter from "../components/SVG_Twitter";
import useCartChecker from "../Hooks/useCartChecker";



const Home = () => {
  
  const containerRef = useRef(null);
  const [visableState,setvisableState] = useState(false);
  const { cartTrigger, setcartTrigger } = useCartChecker();
  const { videoTrigger, setVideoTrigger } = useState(false);
  useEffect(() => {
    setcartTrigger(1);
  }, [])

  const HandleButton=()=>{

  setvisableState(!visableState); console.log(visableState);
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');

      }
      else {
        entry.target.classList.remove('unrevealed');
      }
    }
    )
  })
  useEffect(() => {
    const hiddenElements = document.querySelectorAll('.unrevealed');
    hiddenElements.forEach((el) => observer.observe(el))
  }, [containerRef])

  const playBack = () => {

    const video = document.getElementById('autoplayVideo');
    video.play();
  }

  useEffect(() => {
    const video = document.getElementById('autoplayVideo');
    video.play();


  }, [])
  useEffect(() => {

    const height = () => { return window.innerHeight };
    window.removeEventListener('height', height)
    window.addEventListener('height', height, { passive: true });
    return () => window.removeEventListener('height', height);
  }, [])

  return (
    <div className="lg:h-[115vw]  min-h-[100vh]  short:h-auto  overflow-hidden">
      {/*First Picture*/}
      <div className=" z-[-10] w-[100vw]  bg-no-repeat h-auto hidden lg:flex">
        <video id="autoplayVideo" className="w-[100vw] pb-[-10vw]" onEnded={() => {
          const video = document.getElementById('autoplayVideo');
          video.play();
        }} muted > <source src="static/mergeVod.mp4" type="video/mp4" /> </video>

      </div>
      <div className=" z-[-10] w-[100vw]  bg-no-repeat min-h-[300px] flex lg:hidden">
        <img className="w-[100vw]" src="static/bakery-m.webp" alt="Bakery " />
      </div>


      <div className="lg:h-[16.5vw] h-[34vw]  flex flex-col gap-[.2vw] font-body justify-center items-center  lg:text-[1.25vw] md:text-[2.5vw] text-[3vw] text-[#000000de] w-[85vw] mt-[8vw] lg:w-[70vw] ml-[5vw] lg:ml-[19vw] lg:mt-[2vw]">
      <h1 className="font-semibold underline lg:text-[1.45vw] md:text-[2.9vw]">BAKERY eCOMMERCE: FIND PASTRIES, CAKES, AND DESSERTS | LA PATISSERIE DU COEUR</h1>
        <p className="uppercase mt-[.3vw]">Amidst the bustling streets of LA, Alex & Max, two broke chefs, opened   </p>
        <p className="uppercase mt-[.3vw]"> "La Patisserie du Coeur."</p>
        <p className="uppercase">Their bond and love for baking create a magical bakery, winning hearts with delectable pastries & cakes.</p>
        <p className="uppercase hidden lg:flex"> As the community rallies behind them, their dream flourishes into a heartwarming tale of friendship and sweet success. </p>
        <button className=" " type=""> <p className="border bg-red-500 rounded-xl lg:p-[.2vw] p-[1vw]">COMMING SOON-GPT Story Telling</p></button>
      </div>
      <div className="lg:mt-[3vw] mt-[8vw] w-[95vw] lg:w-[90vw] lg:ml-[5vw] ml-[3.4vw] gap-[.2vw] flex flex-row h-[55vw] lg:h-[40vw]">

        <Link to='/items' id="img-Clip" title='Cake and pastry treats!' className="w-[50%] bg-red-400 group bg-blend-multiply h-[100%] transition-all delay-100 cursor-pointer group-hover:bg-blend-multiply group-hover:border-[.5vw] group-hover:border-red-500 group-active:opacity-80 group-active:border-[.5vw] group-active:border-red-500">
          <img className="h-[100%] transition-all delay-100 z-[100]" src="static/girl-chef.webp" alt="bakery" />
          <div className="absolute stroke-black  text-white font-body group-hover:translate-y-3 group-active:translate-y-3 font-semibold text-[4vw] group-hover:translate-x-4 group-active:translate-x-4 shadows-text transition-all delay-100 mt-[-15vw] ml-[-2vw]">
            SHOP→
          </div>
        </Link>

        <div className="h-[100%] flex flex-col block-A block-B gap-[.2vw] w-[50%]">
          <Link to='/cart' title='Your shopping cart!' className="group overflow-hidden bg-blue-300 cursor-pointer h-[50%] group-hover:border-blue-500 group-hover:border-[.5vw] group-hover:opacity-80 group-active:border-blue-500 group-active:opacity-80">
            <div className="h-[100%]">
              <img className="h-[32vw] transition-all delay-100" src="static/holiday.webp" alt="" />
              <div className="absolute stroke-black text-white group-hover:translate-x-4 group-active:translate-x-4 transition-all delay-100 cursor-pointer font-body font-semibold text-[4vw] shadows-text mt-[-17vw] ml-[-2vw]">
                CART→
              </div>
            </div>
          </Link>
          <Link title='Your shopping history!' to='/purchase-history' className="group overflow-hidden bg-green-300 h-[50%] group-hover:border-green-500 group-hover:opacity-80 group-active:border-green-500 group-active:opacity-80">
            <div className="overflow-hidden h-[100%] group hover:border-[.5vw] transition-all delay-100">
              <img className="h-[29vw] transition-all delay-100" src="static/products.webp" alt="" />
              <div className="absolute stroke-black text-white font-body group-hover:translate-x-4 group-active:translate-x-4 transition-all delay-100 font-semibold text-[4vw] shadows-text mt-[-19vw] ml-[-2vw]">
                PURCHASE HISTORY→
              </div>
            </div>
          </Link>
        </div>


      </div>
    </div>



  )
}

export default Home