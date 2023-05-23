import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom";
import axios from "../api/axios"
import useAuth from "../Hooks/useAuth"
import SVG_facebook from "../components/SVG_Facebook"
import SVG_instagram from "../components/SVG_Instagram"
import SVG_twitter from "../components/SVG_Twitter"

const CART_URL = 'http://127.0.0.1:8000/api/v1/cart/'
const ORDER_ID_URL = 'http://127.0.0.1:8000/api/v1/order/'

const Cart = () => {
    const containerRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState('');
    const [trigger, setTrigger] = useState(false);
    const [isEmpty,setIsEmpty] = useState(false);

    const {auth} = useAuth()
    const access_token = auth.accessToken;
    //Added this conditional context for both cases:Logged in or anonymousUser
    const header_context = access_token === undefined ?   {'Content-Type': 'application/json',}:  
    {'Authorization' : `JWT ${access_token}`,
        'Content-Type': 'application/json', }
    //Deletes both the Cart and Order that is selected
    //Auto updates the cart right after 
    const deleteSubmit = async (e) =>{
        e.preventDefault();

        
        const cart_ID = e.target[0].value;
        const order_ID = e.target[1].value;
        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
        try{
            const response = await axios.delete(CART_URL + cart_ID,{
                headers: header_context, withCredentials: true,
                
  
            })
        }
        catch(err){
            if(err.response){
                console.log(err.response.status)
            }
        }
        //Delay the response just in case
        await sleep(100);

        try{
            const response = await axios.delete(ORDER_ID_URL + order_ID,{
                headers: header_context, withCredentials: true
                
            })
        }
        catch(err){
            if(err.response){
                console.log(err.response.status)
            }
        }
        //Triggers the fetch cart function
        setTrigger(true);
    }

    const orderEditSubmit = async (e) => {
        e.preventDefault();

        const quantityEdit = e.target.value
        //Setting up for updating order
        const cartLabel = e.target[1].value
        const orderedBool = e.target[2].value
        const sessionLabel = e.target[3].value == '' ? null : e.target[3].value
        const userLabel = e.target[4].value == '' ? null : e.target[4].value;

        const productLabel = e.target[5].value

        const stringifiedData = JSON.stringify({
            "id": cartLabel,
            "quantity": quantityEdit,
            "ordered": orderedBool,
            "session_key": sessionLabel,
            "user": userLabel,
            "item": productLabel
        })
        const targetOrder = e.target.id + '/'

        try {
            const response = await axios.put(ORDER_ID_URL + targetOrder, stringifiedData, {
                headers:header_context, withCredentials: true
            })

        }
        catch (err) {
            if (err.response) {
                console.log(err.response.status);
            }
            else {

            }
        }
        setTrigger(true);
    }
    useEffect(() => {
        const fetchCart = async () => {

            try {
                const response = await axios.get(CART_URL, {
                    headers: header_context, withCredentials: true
                })
                //Added this condition once I realized that the website bricks
                //If the cart is empty
                console.log('fetched',response.data);
                if(response.data == '')
                {
                    setIsEmpty(true);
                }else{
                    
                    setIsEmpty(false);
                    setData(response.data);
                }
                
                


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
    }
        , [])
useEffect(()=>{

        window.scrollTo(0, 0);
      
},[])
        function HandlePages(){
            let pageCalc = 0;
            let counter = 0;
            let pageAmount = []; 



            pageCalc = Math.ceil(data.map(datas => datas.id).length / 3)
            
            while (counter < pageCalc) {
                counter++
                pageAmount.push(counter)
              }
            let start;
            if (currentPage !== 1) {
        
              start = 3 * (currentPage - 1)
            } else {
              start = 0
            }
            let end = 3 * currentPage;
            
           
            return(<div>
                {data ?
                
                data.slice(start,end).map(datas =>
    
        <div>
    
        <div key={datas.id} className=" flex uppercase text-white bg-[#1f5cacd0] flex-row   justify-around h-[10vw] w-[60vw] pt-[.4vw] before:border-t before:absolute before:w-[55%] before:mt-[-.3vw]">
                        <div className=" flex gap-5 ">

                            <img src={datas.product_image} loading="lazy" ref={containerRef} className="h-[7.5vw]  rounded-sm shadow-md" alt="" />
                            <div className="flex gap-[4vw] flex-col">
                                <div>
                                    {datas.product_name}
                                </div>
                                <div className=" text-[1vw] font-medium cursor-pointer  hover:text-[#41db419c] text-[#42ee42]">
                                    <form className="" onSubmit={deleteSubmit}>
                                    <input className="absolute" type="submit" name="" hidden value={datas.id}/>
                                    <input className="absolute" type="submit" name="" hidden value={datas.orders.id}/>
                                    <input type="submit" name="" value="DELETE"/>
                                    </form>
                                
                                </div>

                            </div>

                        </div>


                        <div className=" flex flex-col mr-[1vw]">

                        </div>
                        <div className=" flex flex-col">
                            <span> Quantity</span>
                            <form id={datas.orders.id} >
                                <select id={datas.orders.id} className="rounded-md pl-[.5vw] font-body text-black shadow-md"  onChange={orderEditSubmit}>
                                    {/*This is to grab the data that is needed to update the orders*/}
                                    <option className=" hidden" value={datas.orders.quantity} hidden>{datas.orders.quantity}</option>

                                    <option className=" hidden" value={datas.orders.id} hidden>{datas.orders.id}</option>
                                    <option className=" hidden" value={datas.orders.ordered} hidden></option>
                                    <option className=" hidden" value={datas.orders.session_key} hidden></option>
                                    <option className=" hidden" value={datas.orders.user} hidden></option>
                                    <option className=" hidden" value={datas.orders.item} hidden></option>

                                    {
                                        //This seems to be the only way to loop in jsx, array + map

                                        Array(datas.product_quantity).fill(undefined).map((step, index) => (
                                            <option className="font-body" value={index + 1} >{index + 1}</option>
                                        ))}
                                </select>
                            </form>

                        </div>
                        <div className=" flex flex-col">
                            <div>
                                Price
                            </div>
                            <div>
                                ${datas.order_price}
                            </div>


                        </div>

       



                    </div>
 
</div>
                    ) :  isEmpty === true
                    ? <div className=" flex uppercase  text-white bg-[#1f5cacd0] flex-row justify-around h-[10vw] w-[60vw] pt-[.4vw] before:border-t before:absolute before:w-[55%] before:mt-[-.3vw]">
                       <p className="mt-[2vw]"> As empty as Patrick Star's head can be</p>
                    </div>
                    :
                    <div className="h-[30vw] mt-[.5vw] flex flex-col w-[60vw] shadow-2xl bg-[#1f5cacd0] rounded-sm animate-pulse">
                        <div className="h-[25%] w-[97%] ml-[.6vw] mt-[1.5vw] shadow-lg rounded-sm bg-slate-300"></div>
                        <div className="h-[25%] w-[97%] ml-[.6vw] mt-[1.5vw] shadow-lg rounded-sm bg-slate-300"></div>
                        <div className="h-[25%] w-[97%] ml-[.6vw] mt-[1.5vw] shadow-lg rounded-sm bg-slate-300"></div>
                    </div>
            }
            <div className='flex justify-center h-[3vw] bg-[#1f5cacd0]  '>
            <div className=''>
              {
                pageAmount &&

                pageAmount.map(index =>
                  <button
                    className='  focus:bg-slate-400 bg-slate-100 outline h-[2.2vw]  font-body ml-[.3vw] w-[2.2vw] text-[1.1vw] outline-[.1vw] outline-slate-500 rounded-[1vw]'
                    id={'Page ' + index}
                    key={index}
                    value={index}
                    onClick={() => { setCurrentPage(index); }}
                    type="">
                    {index}
                  </button>)

              }


            </div>
          </div>
                
            </div>)
        }
    //Set to trigger anytime the user updates the quantity of their order
    useEffect(() => {
        if (trigger === true) {
            const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
            const fetchCart = async () => {
                //Not sure if this is recommended but I decided to add an await
                //This will ensure that this cart fetch doesnt trigger too quickly 
                //Without this, sometimes the function would price the previous data 

                await sleep(200)
                try {
                    const response = await axios.get(CART_URL, {
                        headers: header_context, withCredentials: true
                    })
                    //Added because its bricks on deletion 
                    //If there is no carts left

                    if(response.data == '')
                    {
                        setIsEmpty(true);
                        setData('');
                    }else{
                        
                        setIsEmpty(false);
                        setData(response.data);
                    }



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
            setTrigger(false);
        }
    }
        , [trigger])

    const observer = new IntersectionObserver((entries)=>{
      entries.forEach((entry)=>{
        if(entry.isIntersecting)
        {
            entry.target.classList.add('revealed');
        }
        else{
            entry.target.classList.remove('revealed');
        }
      })  
    })
    useEffect(()=>{
        const hiddenElements = document.querySelectorAll('.unrevealed');
        hiddenElements.forEach((el)=>{observer.observe(el)})
    },[containerRef,data])
    return (
<div className="h-screen ">
    

        <div className="h-[40vw] mt-[7vw] flex absolute justify-center font-body flex-col gap-3 ml-[4vw] pt-[2vw] w-screen overflow-hidden">
            <div className="w-[60vw]  shadow-2xl">


                <div className="flex justify-center w-[60vw] bg-[#1f5cacd0] shadow-lg ">

                    <h2 className="z-[10] text-3xl pb-[.5vw]  text-white rounded-sm">MY CART</h2>
                </div>
               {data
               ?

                <HandlePages/>:  isEmpty === true
                ? <div className=" flex uppercase  text-white bg-[#1f5cacd0] flex-row justify-around h-[10vw] w-[60vw] pt-[.4vw] before:border-t before:absolute before:w-[55%] before:mt-[-.3vw]">
                   <p className="mt-[2vw]"> As empty as Patrick Star's head can be</p>
                </div>
                :
                <div className="h-[30vw] mt-[.5vw] flex flex-col shadow-2xl bg-[#1f5cacd0] rounded-sm animate-pulse">
                    <div className="h-[25%] w-[97%] ml-[.6vw] mt-[1.5vw] shadow-lg rounded-sm bg-slate-300"></div>
                    <div className="h-[25%] w-[97%] ml-[.6vw] mt-[1.5vw] shadow-lg rounded-sm bg-slate-300"></div>
                    <div className="h-[25%] w-[97%] ml-[.6vw] mt-[1.5vw] shadow-lg rounded-sm bg-slate-300"></div>
                </div>
               } 
                
                
            </div>
            {data ?
                <div className=" absolute uppercase flex justify-center  bg-[#1f5cacd0] text-white w-[20vw] p-[5vw] shadow-lg rounded-sm ml-[70vw] ">
                    <p className="">Total amount </p>
                    <p> ${data[0].total_price}</p>
                </div> : 
                isEmpty === true ? 
                
            <div className="absolute uppercase flex justify-center  bg-[#1f5cacd0] text-white w-[20vw] p-[5vw] shadow-lg rounded-sm ml-[70vw]">
                <p className="text-white">TOTAL AMOUNT N/A</p>
            </div> : 
            <div className="absolute right-0 shadow-lg bg-[#1f5cacd0] p-[5vw] rounded-sm mr-[10vw] mt-[-20vw]">
                    <p className="text-white">TOTAL AMOUNT </p>
                </div> }
               
        
        </div>
        </div>
    )
}
export default Cart