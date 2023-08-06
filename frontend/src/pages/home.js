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
  //https://i.ibb.co/hC4m8mk/40213353998.png
  //https://i.ibb.co/VtpN4L1/pexels-photo-205961.png
  const { cartTrigger, setcartTrigger } = useCartChecker();
  const { videoTrigger, setVideoTrigger } = useState(false);
  useEffect(() => {
    setcartTrigger(1);
  }, [])
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        console.log(entry)
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
    console.log('Hello N-')
    const video = document.getElementById('autoplayVideo');
    video.play();
  }

  useEffect(() => {
    const video = document.getElementById('autoplayVideo');
    video.play();


  }, [])
  useEffect(() => {

  }, [])
  const backgroundURL =
    'url("https://i0.wp.com/www.society19.com/ca/wp-content/uploads/sites/2/2019/02/bakeries-vanfeatured.png?fit=768%2C576&ssl=1")';
  return (
    <div className=" h-[115vw] overflow-hidden">
      {/*First Picture*/}
      <div className=" z-[-10] w-[100vw]  bg-no-repeat h-auto">
        <video id="autoplayVideo" className="w-[100vw] pb-[-10vw]" onEnded={() => {
          const video = document.getElementById('autoplayVideo');
          video.play();
        }} muted > <source src="static/mergeVod.mp4" type="video/mp4" /> </video>

      </div>
      <div className=" h-[10vw] flex flex-col gap-[.2vw] font-body justify-center items-center  text-[1.25vw] text-[#000000de] ] w-[70vw] ml-[15vw] mt-[2vw]">
      <p className="uppercase mt-[.3vw]">Amidst the bustling streets of LA, Alex & Max, two broke chefs, opened "La Patisserie du Coeur."  </p>
        <p className="uppercase">Their bond and love for baking create a magical bakery, winning hearts with delectable pastries & cakes.</p>
        <p className="uppercase"> As the community rallies behind them, their dream flourishes into a heartwarming tale of friendship and sweet success. </p>
        <button className=" " type=""> <p className="border bg-red-500 rounded-xl p-[.2vw]">OUR STORY</p></button>
      </div>
      <div  className=" mt-[3vw]  w-[90vw] ml-[5vw] gap-[.2vw]   flex flex-row h-[40vw] ">
        <div id="img-Clip"  className=" w-[50%] bg-red-400 group  bg-blend-multiply h-[100%]   transition-all delay-100 cursor-pointer">
          <img  className=" h-[40vw] group-hover:bg-blend-multiply overflow-hidden group-hover:border-[.5vw] group-hover:border-red-500   transition-all delay-100 group-hover:opacity-80   z-[100]" src="static/girl-chef.png" alt="" />
          <div className="absolute  text-white cursor-pointer font-body group-hover:translate-y-3  font-semibold text-[4vw] group-hover:translate-x-4 shadows-text transition-all delay-100  mt-[-15vw] ml-[-2vw]">
            JOIN OUR TEAM🢡 
          </div>
        </div>
 
        <div className=" h-[100%] flex flex-col  block-A block-B gap-[.2vw]  w-[50%] ">
        <div className="group overflow-hidden bg-blue-300 cursor-pointer h-[50%]">    <div className=" h-[100%] group-hover:border-blue-500 group-hover:border-[.5vw]   ">
            <img className=" h-[30vw] overflow-hidden  transition-all delay-100  group-hover:opacity-80 " src="static/holiday.jpg" alt="" />
            <div className="absolute text-white group-hover:translate-x-4 transition-all delay-100  cursor-pointer font-body font-semibold text-[4vw] shadows-text mt-[-17vw] ml-[-2vw]">
           HOLIDAY ORDERS🢡  
          </div>
          </div></div>
          <div className="group overflow-hidden bg-green-300   h-[50%]">  
            
       
          <div className=" overflow-hidden h-[100%] group cursor-pointer hover:border-[.5vw] transition-all delay-100  group-hover:border-green-500">
            <img className=" h-[29vw]     transition-all delay-100  group-hover:opacity-80" src="static/products.png" alt="" />
            <div className="absolute text-white  font-body group-hover:translate-x-4 transition-all delay-100 font-semibold text-[4vw] shadows-text mt-[-19vw] ml-[-2vw]">
            OUR PRODUCTS🢡 
          </div>
          </div>
          </div>
        </div>

      </div>
    </div>



  )
}

export default Home