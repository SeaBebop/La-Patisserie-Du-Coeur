import { useEffect, useRef } from "react"
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

const Home = () => {
  const containerRef = useRef(null);
  //https://i.ibb.co/hC4m8mk/40213353998.png
  //https://i.ibb.co/VtpN4L1/pexels-photo-205961.png


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

  const backgroundURL =
    'url("https://i0.wp.com/www.society19.com/ca/wp-content/uploads/sites/2/2019/02/bakeries-vanfeatured.png?fit=768%2C576&ssl=1")';
  return (
    <div className=" h-[500vh]">
      {/*First Picture*/}
      <div className=" z-[-10] w-[100vw]  bg-no-repeat h-[150vw]">
        <img className=" w-[99.9vw] h-[60vw]  z-[-10]  overflow-y-hidden overflow-hidden" ref={containerRef} loading="lazy" src='https://i.ibb.co/VtpN4L1/pexels-photo-205961.png' alt="" />
        <div className="w-[100vw] flex flex-row shadow-lg  mt-[6vw] h-[25vw]">
          <div className="w-[52%] z-50 rounded-2xl flex-col justify-center items-center flex h-full bg-[#fb3131] ">
            <p className="font-body font-bold mt-[2vw] text-yellow-200 text-[2vw] uppercase">at La Patisserie Du Coeur!</p>
            <p className="font-body font-bold text-white text-[2vw] ">Come indulge in our heart-made treats</p>
            <Link to="/location" className="p-[1vw] mt-[1vw] border rounded-sm border-yellow-400 hover:bg-yellow-300 text-[1.3vw] font-semibold bg-yellow-400">OUR LOCATIONS</Link>
          </div>
          {/*Second Picture*/}
          <div className="w-[50%] right-0 h-[24.9vw] absolute overflow-hidden  rounded-2xl z-[10]">
            <img src="https://i.ibb.co/QNCHHNc/sharpened-image-of-bakery.png" className="overflow-x-hidden" loading="lazy" alt="" />
          </div>
        </div>
        <div className="flex h-[100%] flex-row overflow-hidden w-[100vw] ">
          <img src="https://i.ibb.co/nCh1Q32/intro-1601499029.png" ref={containerRef} loading="lazy" className="w-[100vw] absolute unrevealed mt-[-6vw] overflow-hidden " alt="" />
          <div className="h-[26vw] font-body font-semibold absolute  justify-center text-[#fb3131] w-[40vw] items-center  flex flex-col rounded-sm hiring-color mt-[8vw] right-0 mr-[5vw] z-[10] overflow-hidden ">


            <p className="-rotate-12 outline border border-[#fb3131] z-10 rounded-lg bg-white mt-[-5vw] h-[6vw] text-[3vw] flex justify-center items-center outline-offset-4 w-[20vw]">
              <i className="absolute mt-[-12vw] ml-[-7vw]"><SVG_Story /></i> <i className="absolute mt-[-10.8vw] ml-[1.3vw]"><SVG_Location /></i> NOW HIRING!</p>
            <p className="text-yellow-300 absolute bottom-0 mb-[3vw]  text-[2vw]">APPLY IN OUR LOCATIONS NOW!</p>


          </div>

          {/*Not feeling this one
          <div className="h-[20vw] font-body font-semibold absolute flex-row   justify-center text-white w-[40vw] items-center bg-amber-900 flex rounded-sm  mt-[20vw]  ml-[3vw] z-[10] overflow-hidden ">

          <p className="text-[2vw]  mt-[2vw]">DEALS COMING SOON!!</p>
          <i className=" ml-[2vw] mt-[-4vw]"><SVG_Star /></i>


        </div>*/
          }

        </div>

      </div>
      {/*Third Picture*/}
      <div className="w-[90vw] flex flex-row shadow-lg  mt-[-3vw] h-[25vw]">
        <div className="w-[57%] z-50 rounded-2xl flex-row justify-center items-center flex h-full  bg-amber-300 ">

          <p className="text-[2vw] font-body  text-pink-600 mt-[2vw]">DEALS COMING SOON!!</p>
          <i className=" ml-[2vw] mt-[-4vw]"><SVG_Star /></i>
        </div>
        <div className="w-[56%]  right-0 mr-[-7vw] h-[24.9vw]  absolute overflow-hidden  rounded-2xl z-[10]">
          <img src="https://i.ibb.co/51LWKLG/sharpen-EPD.png" className="overflow-x-hidden h-[24.9vw] rounded-md" loading="lazy" alt="" />
        </div>
      </div>
      <div className="w-[100vw] z-[-1] mt-[-1vw]">
        <img className="w-[100vw]" loading="lazy" src="https://i.ibb.co/QQ9Vm51/girl-chef.png" alt=""/>
      </div>

    </div>



  )
}

export default Home