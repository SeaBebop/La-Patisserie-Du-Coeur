import { useEffect, useRef, useState } from "react"
import SVG_Story from "../components/SVG_Story";
import SVG_Location from "../components/SVG_Location";
import SVG_Star from "../components/SVG_Star";
import SVG_Food from "../components/SVG_Food";
import axios from "../api/axios";
import useAuth from "../Hooks/useAuth";

const PurchaseHistory = () => {
  const {auth} = useAuth()
  const PURCHASE_HISTORY_URL =  'http://127.0.0.1:8000/api/v1/customer/purchase-history/'
  const access_token = auth.accessToken === undefined ? undefined  : auth.accessToken;
  const header_context = access_token === undefined ?   {'Content-Type': 'application/json',}:  
  {'Authorization' : `JWT ${access_token}`,
      'Content-Type': 'application/json', }

  const [getPurchase,setPurchase] = useState('')
  useEffect(()=>{

    const getPurchaseHistory = async () =>{
      
      try{
        const response = await axios.get(PURCHASE_HISTORY_URL,{
          
            headers: header_context, withCredentials: true
        
        })
        if (response.data != '') {
          setPurchase(response.data)
        }
        console.log(response)
      }
      
      catch(err){

      }
      

    }
    getPurchaseHistory();
  },[])
  return(
    <div>
      {getPurchase ? 
  
      getPurchase.map(datas=>{
          <div key={datas.key}>
            {datas}
          </div>
      })
    : <div>
      no
    </div>  
    }
    </div>
  )
}

export default PurchaseHistory