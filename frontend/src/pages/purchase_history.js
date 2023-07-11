import { useEffect, useRef, useState } from "react"
import SVG_Story from "../components/SVG_Story";
import SVG_Location from "../components/SVG_Location";
import SVG_Star from "../components/SVG_Star";
import SVG_Food from "../components/SVG_Food";
import axios from "../api/axios";
import useAuth from "../Hooks/useAuth";

const PurchaseHistory = () => {
  const { auth } = useAuth()
  const [lowerLimit, setLowerLimit] = useState(0)
  const [upperLimit, setUpperLimit] = useState(0)
  const PURCHASE_HISTORY_URL = 'http://127.0.0.1:8000/api/v1/customer/purchase-history/'
  const access_token = auth.accessToken === undefined ? undefined : auth.accessToken;
  const header_context = access_token === undefined ? { 'Content-Type': 'application/json', } :
    {
      'Authorization': `JWT ${access_token}`,
      'Content-Type': 'application/json',
    }
    const timeStampCalc = async (lower,upper) =>{
      setLowerLimit(lower);
      setUpperLimit(upper);
      console.log(lowerLimit,upperLimit);
    }

  const [getPurchase, setPurchase] = useState('')
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

      }


    }
    getPurchaseHistory();
  }, [])
  return (

    <div className="flex h-screen  flex-col w-screen items-center  absolute gap-3">
      <div className="mt-[10vw]">
        {/*Creating filter*/}
        <label for="startDate">Start: </label>
        <input type="date" id="startDate" className="mr-[1.5vw]" name="filter-start" max={new Date().toISOString().split('T')[0]} onChange={(e) => { setLowerLimit(new Date(e.target.value).getTime() / 1000); console.log(upperLimit,lowerLimit) }} />
        <label for="endDate">End: </label>
        <input type="date" id="endDate" className="mr-[1.5vw]" name="filter-end" max={new Date().toISOString().split('T')[0]} onChange={(e) => { setUpperLimit(new Date(e.target.value).getTime() / 1000) }} />
        <button  onClick={()=>{document.getElementById("endDate").value = "";document.getElementById("startDate").value = ""; setLowerLimit(0); setUpperLimit(0)}}>Clear Filter</button>
      </div>
      {getPurchase ?
        upperLimit == 0 || lowerLimit == 0 ? getPurchase.map((Purchases, index) => {

          return (

            <div key={index} id={Purchases.date} className="flex ">
              <div className="flex flex-row mt-[4vw] justify-center gap-[1.8vw]">
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
        : <div>
          no
        </div>
      }
    </div>
  )
}

export default PurchaseHistory