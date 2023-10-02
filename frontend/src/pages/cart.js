import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom";
import axios from "../api/axios"
import useAuth from "../Hooks/useAuth"
import SVG_facebook from "../components/SVG_Facebook"
import SVG_instagram from "../components/SVG_Instagram"
import SVG_twitter from "../components/SVG_Twitter"
import jwt_decode from 'jwt-decode'
import useCartChecker from "../Hooks/useCartChecker";

const CART_URL = 'https://lacoeurbakery-com.onrender.com/api/v1/cart/'
const ORDER_ID_URL = 'https://lacoeurbakery-com.onrender.com/api/v1/order/'
const CREATE_CHECKOUT_URL = 'https://lacoeurbakery-com.onrender.com/api/v1/checkout/create-checkout-session/'

const Cart = () => {
    const containerRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState('');
    const {cartTrigger,setcartTrigger} = useCartChecker();
    const [trigger, setTrigger] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const { auth } = useAuth();
    const access_token = auth.accessToken === undefined ? undefined : auth.accessToken;
    
    //Added this conditional context for both cases:Logged in or anonymousUser
    const header_context = access_token === undefined ? { 'Content-Type': 'application/json', } :
        {
            'Authorization': `JWT ${access_token}`,
            'Content-Type': 'application/json',
        }
    //Deletes both the Cart and Order that is selected
    //Auto updates the cart right after 

    const deleteSubmit = async (e) => {
        e.preventDefault();


        const cart_ID = e.target[0].value;
        const order_ID = e.target[1].value;
        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
        try {
            const response = await axios.delete(CART_URL + cart_ID, {
                headers: header_context, withCredentials: true,


            })
        }
        catch (err) {
            if (err.response) {
                console.log(err.response.status)
            }
        }
        setcartTrigger(0);
        //Delay the response just in case
        await sleep(100);

        try {
            const response = await axios.delete(ORDER_ID_URL + order_ID, {
                headers: header_context, withCredentials: true

            })
        }
        catch (err) {
            if (err.response) {
                console.log(err.response.status)
            }
        }
        //Triggers the fetch cart function
        setTrigger(true);
        document.getElementById("Page 1").click();
        
    }
    /*
    const cartCheckoutPost = async (e) =>{
        e.preventDefault();

        try{
            const response = await axios.post(CREATE_CHECKOUT_URL,JSON.stringify({'':''}), {
                headers:header_context,
                withCredentials: true
            }

            );
            window.open(response.data);
        }
        catch (err){
           
        }
    } */
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
                headers: header_context, withCredentials: true
            })
            setcartTrigger(0);
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
        //Gets cart list when called 
        const fetchCart = async () => {
            const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
            await sleep(400)
            try {
                const response = await axios.get(CART_URL, {
                    headers: header_context, withCredentials: true
                })
                //Added this condition once I realized that the website bricks
                //If the cart is empty
                console.log('fetched', response.data);
                if (response.data == '') {
                    setIsEmpty(true);
                } else {

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
    useEffect(() => {
        setcartTrigger(0);
        window.scrollTo(0, 0);

    }, [])
    function HandlePages() {
        //Add pagination to cart list
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


        return (<div>
            {data ?

                data.slice(start, end).map(datas =>

                    <div className="">

                        <div key={datas.id} className=" flex uppercase text-[3.5vw] lg:text-[1.25vw] text-[#4d3526] bg-[#ff6e61a9] flex-row  pt-[1vw] 
                         justify-around h-auto lg:h-[10vw] w-[] lg:w-[60vw] lg:pt-[.4vw] before:border-t before:absolute lg:before:w-[55%] before:w-[65%] before:mt-[-.6vw]">
                            <div className=" flex  gap-[3vw] pt-[.5vw] ">

                                <img src={datas.product_image} loading="lazy" ref={containerRef} className="lg:h-[7.5vw] h-[14vw]  rounded-sm shadow-md" alt="" />
                                <div className="flex gap-[4vw] flex-col">
                                    <div>
                                        {datas.product_name}
                                    </div>
                                    <div className="  font-semibold cursor-pointer   hover:text-red-500 text-red-800">
                                        <form className="" onSubmit={deleteSubmit}>
                                            <input className="absolute" type="submit" name="" hidden value={datas.id} />
                                            <input className="absolute" type="submit" name="" hidden value={datas.orders.id} />
                                            <input className="cursor-pointer lg:text-[1.2vw] text-[3.2vw]"  type="submit" name="" value="REMOVE FROM CART" />
                                        </form>

                                    </div>

                                </div>

                            </div>


                            <div className=" flex flex-col mr-[1vw]">

                            </div>
                            <div className=" flex flex-col">
                                <span> Quantity</span>
                                <form id={datas.orders.id} >
                                    <select id={datas.orders.id} className="rounded-md pl-[.5vw] cursor-pointer font-body hover:bg-slate-300 transition-all delay-75 text-black shadow-md" onChange={orderEditSubmit}>
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
                                                <option className="font-body " value={index + 1} >{index + 1}</option>
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
                ) : isEmpty === true
                    ? <div className=" flex uppercase  text-[#4d3526] shadow-2xl bg-[#ff6e61a9] flex-row justify-around h-[15vw] w-[90vw] 
                    lg:w-[60vw] pt-[.4vw] before:border-t before:absolute before:w-[55%] before:mt-[-.3vw]">
                        <p className="mt-[2vw]"> As empty as Patrick Star's head can be</p>
                    </div>
                    :
                    <div className="lg:h-[30vw] h-[45vw] mt-[.5vw] flex flex-col w-[60vw] shadow-2xl bg-[#ff6e61a9] rounded-sm animate-pulse">
                        <div className="h-[25%] w-[97%] ml-[.6vw] mt-[1.5vw] shadow-lg rounded-sm bg-slate-300"></div>
                        <div className="h-[25%] w-[97%] ml-[.6vw] mt-[1.5vw] shadow-lg rounded-sm bg-slate-300"></div>
                        <div className="h-[25%] w-[97%] ml-[.6vw] mt-[1.5vw] shadow-lg rounded-sm bg-slate-300"></div>
                    </div>
            }
            <div className='flex justify-center lg:items-start items-center lg:h-[6vw] h-[15vw]  bg-[#ff6e61a9]  '>
                <div className='flex gap-[1.5vw]'>
                    {
                        pageAmount &&

                        pageAmount.map(index =>
                            <button
                                className='  focus:bg-slate-400 bg-slate-100 outline h-[5vw] lg:h-[2.2vw] mt-[.8vw] font-body ml-[.3vw] w-[5vw] rounded-full 
                                lg:w-[2.2vw] text-[4vw] lg:text-[1.1vw] outline-[.1vw] outline-slate-500 '
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

                    if (response.data == '') {
                        setIsEmpty(true);
                        setData('');
                    } else {

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

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
            else {
                entry.target.classList.remove('revealed');
            }
        })
    })
    useEffect(() => {
        const hiddenElements = document.querySelectorAll('.unrevealed');
        hiddenElements.forEach((el) => { observer.observe(el) })
    }, [containerRef, data])
    return (
        <div id='cart' className="lg:h-[110vw] min-h-[850px]">


            <div className="lg:h-auto h-[130vw] short: min-h-[757px] justify-center lg:flex-row  flex flex-col  items-center font-body gap-[4vw] lg:gap-3  pt-[2vw] w-screen overflow-hidden">
                <div className="lg:w-[60vw] w-[95vw] overflow-x-hidden  mr-[0vw] lg:mr-[3.6vw] flex  flex-col ">


                    <div className="flex justify-center items-center md:mt-[10vw]  mt-[20vw] lg:h-[6vw] h-[10vh] w-[95vw] lg:w-[60vw] bg-[#ff6e61a9] shadow-lg ">

                        <h2 className="z-[10]  pb-[.5vw] mt-[.1vw] lg:text-[2.3vw] text-[5vw]  text-[#4d3526] rounded-sm">MY CART</h2>
                    </div>
                    {data
                        ?

                        <HandlePages /> : isEmpty === true
                            ? <div className=" flex uppercase   text-[#4d3526] shadow-lg bg-[#ff6e61a9] flex-row justify-around  h-[15vw] 
                            w-[95vw] lg:w-[60vw] pt-[.4vw] before:border-t before:absolute before:w-[55%] before:mt-[-.3vw]">
                                <p className="mt-[2vw] text-[3.5vw] lg:text-[1.3vw]"> As empty as Patrick Star's head can be</p>
                            </div>
                            :
                            <div className="lg:h-[30vw] h-[45vw] mt-[.5vw] flex flex-col shadow-2xl bg-[#ff6e61a9] rounded-sm animate-pulse">
                                <div className="h-[25%] w-[97%] ml-[.6vw] mt-[1.5vw] shadow-lg rounded-sm bg-slate-300"></div>
                                <div className="h-[25%] w-[97%] ml-[.6vw] mt-[1.5vw] shadow-lg rounded-sm bg-slate-300"></div>
                                <div className="h-[25%] w-[97%] ml-[.6vw] mt-[1.5vw] shadow-lg rounded-sm bg-slate-300"></div>
                            </div>
                    }


                </div>
                {data ?
                    <div className="  uppercase flex justify-center flex-col h-[23vw] text-[4vw] lg:text-[1.4vw]  bg-[#FF6F61] text-[#4d3526] w-[55vw] lg:w-[20vw] p-[5vw] shadow-lg rounded-sm ">
                        <p className="">Total amount </p>
                        <p> ${data[0].total_price}</p>

                        <div>
                            {/* 
                Tried to do <form onSubmit={cartCheckoutPost}>

                However whenever you do an ajax or a httpRequest, by default redirects are prevented after a post
                this is because an ajax post expects a response and a redirect isn't a valid one
                a regular POSt from a form however it works
                This creates further problems that requires a work around on the backend in the checkout view.py
                >Can't verify the user's access token without an ajax/request header
                Solution:
                Retriving the hidden access token value as request data, decoding the token on the backend for safety,
                checking if the user is authenticated with that value(can't use is_authenticated without a request header)
                
                I could have used the standard solution with window.href or whatever its called for redirecting on the frontend 
                after getting the checkout url as a response
                however
                That is wack: it counts as a popup which can be blocked by the user which creates confusion
                */}
                            <form action={CREATE_CHECKOUT_URL} method="POST">
                                <input name="sessionKey" id="say" hidden value={data[0]?.session_key} />
                                <input name="userID" id="say" hidden value={access_token} />
                                <input type="submit" name="" className=" cursor-pointer text-[3vw] lg:text-[1.2vw]  h-[7vw] lg:h-[2.5vw] w-[18vw] lg:w-[8vw] hover:bg-[#1f5cacd0] hover:translate-y-[.1vw] transition-all delay-75 border rounded-md bg-blue-500 p-[.5vw] mt-[.3vw] text-black" value="CHECK OUT" />
                            </form>


                        </div>
                    </div>
                    :
                    isEmpty === true ?
                    
                    <div className="  uppercase flex justify-center flex-col h-[19vw] text-[4vw] lg:text-[1.4vw]  bg-[#FF6F61] text-[#4d3526] w-[55vw] lg:w-[20vw] p-[5vw] shadow-lg rounded-sm ">
                            <p className="text-[#4d3526]">TOTAL AMOUNT <br/> N/A</p>
                        </div> :
                      <div className="  uppercase flex justify-center flex-col h-[23vw] text-[4vw] lg:text-[1.4vw]  bg-[#FF6F61] text-[#4d3526] w-[55vw] lg:w-[20vw] p-[5vw] shadow-lg rounded-sm ">
                            <p className="text-[#4d3526]">TOTAL AMOUNT </p>
                        </div>}


            </div>
        </div>
    )
}
export default Cart