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

const PurchaseHistory = () => {
  const { auth } = useAuth();
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
    document.getElementById('time-3m').click();
  },
    [])

  const PURCHASE_HISTORY_URL = 'http://127.0.0.1:8000/api/v1/customer/purchase-history/'
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
          setPurchase(response.data)
        }
        console.log(response)
      }

      catch (err) {
        if (err.response?.status == 503) {
          const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
          await sleep(400)
          setErrMsg(err.response.data);
          console.log('this is error', errMsg)
          setTrigger(false);
        }
      }


    }
    getPurchaseHistory();
  }, [])
  return (

    <div className="flex h-screen  flex-col w-screen items-center  absolute gap-3">
      <div className="mt-[10vw] flex gap-[2vw]">

        { }
        {/*Creating filter*/}
        <button id='time-y' className="px-[.6vw] text-[1.5vw] font-body rounded-full 
         bg-white border-red-400 transition-all delay-150 ease-in " onClick={(e) => { setLowerLimit(yesterday); setUpperLimit(today); ColorUp(e); }} >YESTERDAY</button>
        <button id='time-3m' className="px-[.6vw] text-[1.5vw] font-body rounded-full 
         bg-white border-red-400 transition-all delay-150 ease-in " onClick={(e) => { setLowerLimit(threeMonth); setUpperLimit(today); ColorUp(e); }} >3 MONTHS</button>
        <button id='time-6m' type="" className="px-[.6vw] text-[1.5vw] font-body rounded-full 
         bg-white border-red-400 transition-all delay-150 ease-in" onClick={(e) => { setLowerLimit(sixMonth); setUpperLimit(today); ColorUp(e); }}>6 MONTHS</button>
        <button id='time-1y' type="" className="px-[.6vw] text-[1.5vw] font-body rounded-full 
         bg-white border-red-400 transition-all delay-150 ease-in " onClick={(e) => { setLowerLimit(year); setUpperLimit(today); ColorUp(e); }} >1 YEAR AGO</button>
        <button id='time-A' type="" className="px-[.6vw] text-[1.5vw] font-body rounded-full 
         bg-white border-red-400 transition-all delay-150 ease-in" onClick={(e) => { setLowerLimit(reset); setUpperLimit(reset); ColorUp(e); }} >All</button>
      </div>
      {getPurchase ?
        upperLimit == 0 || lowerLimit == 0 ? getPurchase.map((Purchases, index) => {

          return (

            <div key={index} id={Purchases.date} className="flex uppercase  text-white bg-[#1f5cacd0] flex-row justify-around h-[10vw] w-[60vw] pt-[.4vw] before:border-t before:absolute before:w-[55%] before:mt-[-.3vw] ">
              <div className="flex flex-row mt-[4vw] justify-center gap-[1.8vw] ">
                {Purchases.date}
                <div className="">
                  <p>Name</p>
                  {Purchases.productsName.map((items, index) => {
                    return (

                      <p className="flex flex-col"> {items} </p>

                    )
                  })}
                </div>
                <div>
                  <p>Quantity</p>
                  {Purchases.productsQuantity.map((items, index) => {
                    return (
                      <div>
                        <p className="flex flex-col">x {items} </p>

                      </div>

                    )
                  })}


                </div>
                <div>
                  Total Price
                  <div>
                    {Purchases.amount_total}
                  </div>

                </div>
                <div className="flex items-end">
                  <div className=" bottom-0">
                    <a target="_blank" className="flex " href={Purchases.reciept}>Reciept</a>
                  </div>

                </div>

              </div>



            </div>
          )



        }) :
          getPurchase.filter(Purchases => lowerLimit <= Purchases.dateUnix && Purchases.dateUnix <= upperLimit).map((Purchases, index) => {

            return (

              <div key={index} id={Purchases.date} className="flex ">
                <div className="flex flex-row mt-[4vw] justify-center gap-[1vw]">
                  {Purchases.date}
                  <div>
                    <p>Name</p>
                    {Purchases.productsName.map((items, index) => {
                      return (

                        <p className="flex flex-col"> {items} </p>



                      )
                    })}
                  </div>
                  <div>
                    <p>Quantity</p>
                    {Purchases.productsQuantity.map((items, index) => {
                      return (
                        <div>
                          <p className="flex flex-col">x {items} </p>

                        </div>

                      )
                    })}


                  </div>
                  <div>
                    Total Price
                    <div>
                      {Purchases.amount_total}
                    </div>

                  </div>
                  <div className="flex items-end">
                    <div className=" bottom-0">
                      <a target="_blank" className="flex " href={Purchases.reciept}>Reciept</a>
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
          <div className=" flex uppercase justify-center text-white bg-[#1f5cacd0] flex-row h-[10vw] w-[60vw] pt-[1vw] before:border-t before:absolute before:w-[55%] before:mt-[-.3vw]">
            {/*Somehow error msg failed {errMsg} but this worked
          ,setting hooks are a bit finicky 
          */}
            <p className={errMsg ? "errmsg text-white mt-[3vw]" : "offscreen"} aria-live="assertive">{errMsg}</p>
          </div>)
      }
    </div>
  )
}

export default PurchaseHistory