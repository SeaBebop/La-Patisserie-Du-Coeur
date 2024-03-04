import { useEffect, useRef, useState } from "react"
import SVG_Story from "../components/SVG_Story";
import SVG_Location from "../components/SVG_Location";
import SVG_Star from "../components/SVG_Star";
import SVG_Food from "../components/SVG_Food";
import axios from "../api/axios";
import useAuth from "../Hooks/useAuth";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import { add, addDays } from 'date-fns'
import Loader from "../components/loading";
import useCartChecker from "../Hooks/useCartChecker";

const PurchaseHistory = () => {
  const { auth } = useAuth();
  const {cartTrigger,setcartTrigger} = useCartChecker();
  
  //Thresholds of lower and upperlimit
  //Could make this a backend feature instead
  const yesterday = addDays(new Date(), -1).getTime() / 1000;
  const threeMonth = addDays(new Date(), -90).getTime() / 1000;
  const sixMonth = addDays(new Date(), -90 * 2).getTime() / 1000;
  const year = addDays(new Date(), -365).getTime() / 1000;
  const reset = 0;
  const today = new Date();
  const filter = ['time-3m', 'time-y', 'time-6m', 'time-1y', 'time-A']

  //Hooks and Ref
  const [lowerLimit, setLowerLimit] = useState(threeMonth);
  const [upperLimit, setUpperLimit] = useState(today);
  const [trigger, setTrigger] = useState(true);
  const [getPurchase, setPurchase] = useState('')
  const [errMsg, setErrMsg] = useState('');
  const [length,setLength] = useState(1);
  const amount =  "flex h-[calc(75vh_+_" + 50*length +"vh)]  flex-col w-screen items-center  overflow-y-hidden gap-3" 
  const overflowChecker = ()=>{
    return document.getElementById("purchase").scrollHeight > document.getElementById("purchase").clientHeight}


  const ColorUp = (e) => {
    e.preventDefault();

    
    document.getElementById(e.target.id).style.backgroundColor = '#ec3c5f';

    filter.map((type, index) => {
      if (type != e.target.id) {
        document.getElementById(type).style.backgroundColor = '#e2e8f9';
      }
    })
  }


  useEffect(() => {
    setcartTrigger(0);
    document.getElementById('time-6m').click();
    
  },
    [])

  const PURCHASE_HISTORY_URL = '/api/v1/customer/purchase-history/'
  const access_token = auth.accessToken === undefined ? undefined : auth.accessToken;
  const header_context = access_token === undefined ? { 'Content-Type': 'application/json', } :
    {
      'Authorization': `JWT ${access_token}`,
      'Content-Type': 'application/json',
    }



  useEffect(() => {


    const getPurchaseHistory = async () => {

      try {
        const response = await axios.get(PURCHASE_HISTORY_URL, {

          headers: header_context, withCredentials: true

        })
        if (response.data != '') {
          setPurchase(response.data);
          setLength(response.data.length);
        }
     
      }

      catch (err) {
        if (err.response?.status == 503) {
          const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
          await sleep(400)
          setErrMsg(err.response.data);

          setTrigger(false);
        }
      }


    }
    getPurchaseHistory();
  }, [])
  return (

    <div id="purchase" className={ getPurchase ?  "flex min-h-[800px]  flex-col w-screen items-center  overflow-x-hidden gap-3"  : "flex h-[100vh] flex-col w-screen items-center  overflow-y-hidden gap-3"}>
      
      <div className="lg:mt-[10vw] mt-[10vh] flex gap-[2vw]">
      <div className="flex flex-col">
      <div className="mb-[2vw] text-[#4d3526]  font-semibold underline text-[4vw] lg:text-[1.6vw] font-body">
       PURCHASE HISTORY
      </div>
   
        { } 
<div className=" flex gap-[2vw] lg:gap-[1.4vw]">

        {/*Creating filter*/}
        <button id='time-y' className="px-[.6vw] text-[3.7vw] lg:text-[1.5vw] font-body rounded-full 
         bg-white border-red-400 transition-all delay-150 ease-in " onClick={(e) => { setLowerLimit(yesterday); setUpperLimit(today); ColorUp(e); }} >YESTERDAY</button>
        <button id='time-3m' className="px-[.6vw] text-[3.7vw] lg:text-[1.5vw] font-body rounded-full 
         bg-white border-red-400 transition-all delay-150 ease-in " onClick={(e) => { setLowerLimit(threeMonth); setUpperLimit(today); ColorUp(e); }} >3 MONTHS</button>
        <button id='time-6m' type="" className="px-[.6vw] text-[3.7vw] lg:text-[1.5vw] font-body rounded-full 
         bg-white border-red-400 transition-all delay-150 ease-in" onClick={(e) => { setLowerLimit(sixMonth); setUpperLimit(today); ColorUp(e); }}>6 MONTHS</button>
        <button id='time-1y' type="" className="px-[.6vw] text-[3.7vw] lg:text-[1.5vw] font-body rounded-full 
         bg-white border-red-400 transition-all delay-150 ease-in " onClick={(e) => { setLowerLimit(year); setUpperLimit(today); ColorUp(e); }} >1 YEAR AGO</button>
        <button id='time-A' type="" className="px-[.6vw] text-[3.7vw] lg:text-[1.5vw] font-body rounded-full 
         bg-white border-red-400 transition-all delay-150 ease-in" onClick={(e) => { setLowerLimit(reset); setUpperLimit(reset); ColorUp(e); }} >All</button>
       </div>
  
       </div>
      </div>
      {getPurchase ?
        upperLimit == 0 || lowerLimit == 0 ? getPurchase.map((Purchases, index) => {

          return (

            <div key={index} id={Purchases.date} className="flex  font-body uppercase  ">
              <div className="flex mt-[1vw] px-[1vw] text-[#4d3526] text-[2.6vw] lg:text-[1.5vw] mr-[5vw] bg-[#ff6e61a9] 
              flex-row justify-around h-auto lg:w-[60vw] py-[3vw] before:border-t before:absolute before:w-[55%] before:mt-[-.3vw]">
                <p className="text-white">{Purchases.date}</p>
                <div className="">
                  <p className="text-white">Name</p>
                  {Purchases.productsName.map((items, index) => {
                    return (

                      <p className="flex flex-col"> {items} </p>

                    )
                  })}
                </div>
                <div>
                <p className="text-white">Quantity</p>
                  {Purchases.productsQuantity.map((items, index) => {
                    return (
                      <div>
                        <p className="flex flex-col">x {items} </p>

                      </div>

                    )
                  })}


                </div>
                <div className="ml-[1.2vw]">
                  <p className=" text-white">Total Price</p>
                  <div>
                    {Purchases.amount_total}
                  </div>

                </div>
                <div className="flex items-end">
                  <div className=" bottom-0">
                    <a target="_blank" rel="noreferrer"  className="flex text-blue-800 hover:opacity-75" href={Purchases.reciept}>Reciept</a>
                  </div>

                </div>

              </div>



            </div>
          )



        }) :
          getPurchase.filter(Purchases => lowerLimit <= Purchases.dateUnix && Purchases.dateUnix <= upperLimit).map((Purchases, index) => {

            return (

              <div key={index} id={Purchases.date} className="flex font-body uppercase  ">
              <div className="flex mt-[1vw] px-[1vw] text-[#4d3526] text-[2.6vw] lg:text-[1.5vw] mr-[5vw] bg-[#ff6e61a9] 
              flex-row justify-around h-auto lg:w-[60vw] py-[3vw] before:border-t before:absolute before:w-[55%] before:mt-[-.3vw]">                  
              <p className="text-white">{Purchases.date}</p>
                  <div>
                    <p className="text-white">Name</p>
                    {Purchases.productsName.map((items, index) => {
                      return (

                        <p className="flex flex-col"> {items} </p>
                      )
                    })}
                  </div>
                  <div>
                    <p className="text-white">Quantity</p>
                    {Purchases.productsQuantity.map((items, index) => {
                      return (
                        <div>
                          <p className="flex flex-col">x  {items} </p>

                        </div>

                      )
                    })}


                  </div>
                  <div className="ml-[2vw]">
                    <p className="text-white"> Total Price</p>
                    <div>
                      {Purchases.amount_total}
                    </div>

                  </div>
                  <div className="flex items-end">
                    <div className=" bottom-0">
                      <a target="_blank" rel="noreferrer" className="flex text-blue-800 hover:opacity-75" href={Purchases.reciept}>Reciept</a>
                    </div>

                  </div>

                </div>



              </div>
            )

          })
        : (trigger == true ? <div>
          <Loader />
        </div>
          :
          <div className=" flex uppercase justify-center text-[#4d3526] bg-[#ff6e61a9] flex-row h-[15vw] w-[90vw] mr-[4vw] lg:h-[10vw] lg:w-[60vw] pt-[1vw] before:border-t before:absolute before:w-[75%] lg:before:w-[55%] before:mt-[vw]">
            {/*Somehow error msg failed {errMsg} but this worked
          ,setting hooks are a bit finicky 
          */}
            <p className={errMsg ? "errmsg text-[#4d3526] text-[3.1vw] lg:text-[1.4vw] mt-[3vw]" : "offscreen"} aria-live="assertive">{errMsg}</p>
          </div>)
      }
    </div>
  )
}

export default PurchaseHistory