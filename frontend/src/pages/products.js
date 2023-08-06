import { useEffect, useRef, useState } from 'react';
import axios from '../api/axios';
import { json } from 'react-router-dom';
import useAuth from '../Hooks/useAuth';
import jwt_decode from 'jwt-decode'
import useCartChecker from '../Hooks/useCartChecker';



const PRODUCT_DATA_URL = 'http://127.0.0.1:8000/api/v1/shop';
const ORDER_URL = 'http://127.0.0.1:8000/api/v1/order/';
const CUSTOMER_URL = 'http://127.0.0.1:8000/api/v1/customer/manage-customer/'

/*The filter Idea is inspired by  https://codesandbox.io/s/r5x4i?file=/src/App.js 

Rendering idea for the handleFilter is inspired by 
https://stackoverflow.com/questions/69476529/way-to-render-a-new-component-onclick-in-react-js 

Pagination idea is something I came up with, flawed since it isn't test as much as a library 

I feel like there is a way to simplify the code since there is some repeating code but its not fully the same function 
used
*/
const productItems = ['All', 'Bagels', 'Biscuits', 'Breads', 'Cake', 'Pastries', 'Pie'];

const Products = () => {
  const containerRef = useRef();
  const { auth } = useAuth();
  const access_token = auth.accessToken;

  const decoded = auth?.accessToken ?
    jwt_decode(auth.accessToken) : undefined
  const userName = decoded?.username || false
  //Added this conditional context for both cases:Logged in or anonymousUser
  const header_context = access_token === undefined ? { 'Content-Type': 'application/json', } : {
    'Authorization': `JWT ${access_token}`,
    'Content-Type': 'application/json',
  }
  //This is where the data of products will be stored
  const [data, setData] = useState('');
  //This will store one of the values from the productItems list 
  const [filter, setFilter] = useState('');
  const {cartTrigger,setcartTrigger} = useCartChecker();
  //Used to Control when the handleFilter jsx element is called
  const [hasRender, setRender] = useState(false);
  const [renderPaginationColor, SetPaginationColor] = useState(false);
  const [renderBorderColor, setBorderColor] = useState(false);
  //Pagination set up:Reminds me of Linked List with Head Tail 
  const [currentPage, setCurrentPage] = useState(1);
  const [productPerPage, setProductPerPage] = useState(4);

  //Order form variables
  const [order, setOrder] = useState('');
  const [quantity, setQuantity] = useState(1);
  const backgroundURL =
    "url('https://wallpapercave.com/wp/wp10260057.jpg')";

  //Coloring the pagination numbers for current page
  useEffect(() => {
    function colorUp() {
      console.log('nani')
      document.getElementById('Page ' + currentPage).style.backgroundColor = '#e2e8f9'
    }
    {
      renderPaginationColor == true ?
        colorUp() :
        console.log('nothing')
    }

  }, [currentPage, data, renderPaginationColor, filter])


  //Toggles the button to have a highlight which filter they clicked
  useEffect(() => {

    function borderFilter() {

      document.getElementById(filter).style.backgroundColor = '#ea284fe7'

      productItems.map((type, index) => {
        if (type != filter) {
          document.getElementById(type).style.backgroundColor = '#b3b1ad'

        }
      })
    }
    {
      renderBorderColor == true ?

        borderFilter() :
        console.log('no border')
    }

  }, [filter, renderBorderColor, data])
  //Funtion Will fetch the products in the URL
  useEffect(() => {
    const fetchProduct = async () => {

      try {
        const response = await axios.get(PRODUCT_DATA_URL,
          {
            headers: header_context, withCredentials: true

          }
          // dont need to make json with this methood
          //useeffect-> async function with await as response and the method, catch and then set
        )
        //Added this condition in case there is 0 products
        if (response.data != '') {
          setData(response.data);
          setcartTrigger(3);
        }

        
        console.log('this is name', userName);
      }

      catch (err) {
        if (err.response) {
          //If not in the 200 response range
          console.log(err.response.data);
          console.log(err.response.status);

        }
        else {
          console.log('Error:Failed to connect');
        }

      }
    }
    
    fetchProduct();
    setcartTrigger(0);
  }, [])

  //Intialized the page with All as the filter
  function Clicker() {
    document.getElementById('All').click();
    SetPaginationColor(true);
    setBorderColor(true);
  }
  //Order Submit Form
  const onOrderSubmit = async (e) => {
    e.preventDefault();
    //When doing this submit I learned that hooks work in queues
    //This became a problem because setting the order would take longer
    //than the axios post resulting a undefined response

    //The solution was learning how does (e) or in other words event works
    //I didn't know how much usable data was in each form until this

    //setOrder(classNameInt); <----- Problem
    //console.log(classNameInt); 
    //console.log(e.target[0].value) <--- Testing e, than e.target 
    //then learning e has an array of data for each individual form input
    //Hooks has some limitations I suppose

    const classNameInt = Number(e.target.className);

    const targetValueQuantity = e.target[0].value;
    const targetID = e.target[0].id;
    
    let stringifiedData;
    {
      userName ?
        stringifiedData = JSON.stringify({ 'quantity': targetValueQuantity, 'user': userName, 'item': classNameInt })
        : stringifiedData = JSON.stringify({ 'quantity': targetValueQuantity, 'item': classNameInt })
    }

    try {
      const response = await axios.post(ORDER_URL, stringifiedData, {
        headers: header_context,
        withCredentials: true,

      });
      document.getElementById(targetID).value = '';
  
      setcartTrigger(0);
    }
 
    catch (err) {
      if (err.response) {
        //If not in the 200 response range


      }
      else {
        console.log('Error:Failed to connect');
      }
      
      try{

      }
      catch(err)
      {

      }
    }
  }
  useEffect(()=>{
   
      window.scrollTo(0, 0);


  },[])
  //The idea is to 
  function HandleFilter() {
    const productType = filter;
    //console.log(document.getElementsByClassName('buttonValue')) <-Failed idea, leaving it here to remember why
    let pageCalc = 0;
    let counter = 0;
    let pageAmount = [];

    if (filter !== 'All') {
      //Never in your life make this mistake again
      //let pageCalc = Math.ceil(data.filter(datas => datas.category === productType).length / 4)
      //Redefine another variable to a different address with the same name
      pageCalc = Math.ceil(data.filter(datas => datas.category === productType).length / 4)

    } else {
      pageCalc = Math.ceil(data.map(datas => datas.id).length / 4)
    }

    while (counter < pageCalc) {
      counter++
      pageAmount.push(counter)
    }

    let start;
    if (currentPage !== 1) {

      start = 4 * (currentPage - 1)
    } else {
      start = 0
    }

    let end = 4 * currentPage;

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

      (productType !== 'All' ?
        //All the data for every filter but All
        <div>


          <div className='flex flex-row  overflow-x-hidden'>
            {data ?
              data.filter(datas => datas.category === productType).slice(start, end).map(datas =>
                /*Key is portional to the backend name*/
                <div key={datas.id} className="flex flex-col justify-center shadow-lg bg-slate-100 outline outline-[.1vw] outline-slate-300 px-[1.3vw] py-[.8vw] rounded-[.5vw] mx-[1vw] my-[1vw] items-center">


                  <img className='h-[9.5vw] shadow-xl rounded-sm unrevealed' ref={containerRef} src={datas.image} alt="" />  <p className=' font-Body uppercase text-[1.4vw]'>{datas.name}</p> <p className='font-body text-[1.2vw]'>${datas.price}</p> <p className='font-body text-[1.2vw]'>{datas.quantity} LEFT</p>
                  <form onSubmit={onOrderSubmit} className={datas.id} >

                    <input className='outline-[.1vw] rounded-md shadow-md outline  outline-slate-300 pl-[.6vw] text-black w-[60%]'
                      type={'number'}
                      name="quantity"
                      min={1}
                      max={datas.quantity}

                      id={'input '+ datas.id}
                      placeholder={' Insert Quantity'} />
                          
                    <button
                      className='bg-green-400 shadow-md hover:bg-green-200 ml-[11vw] flex items-center justify-center font-medium mt-[1vw] outline outline-slate-200 outline-[.05vw] rounded-sm px-[.3vw] py-[.2vw] text-[1.1vw] '

                      type="submit">
                      <div className='text-black'>ADD TO CART</div>
                    </button>
                  </form>
                </div>) : <p>Refresh the page</p>
            }
          </div>
          <div className='flex  justify-center  '>
            <div className='flex gap-[1vw] mb-[1vw] mt-[3vw]'>
              {
                pageAmount &&

                pageAmount.map(index =>
                  <button
                    className='  focus:bg-slate-400 outline py-[.5vw] px-[1.2vw]  font-body ml-[.3vw]  outline-[.1vw] outline-slate-500 rounded-full'
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




        </div>

        :
        //For the filter ALL
        <div>
          <div className='flex gap-[1vw]'>
            {data ?
              data.slice(start, end).map(datas =>
                /*Key is portional to the backend name*/
                <div key={datas.id} className="flex flex-col justify-center text-[1.4vw] shadow-lg bg-slate-100 outline outline-[.1vw] outline-slate-300 px-[1.3vw] py-[.8vw] rounded-[.5vw] mx-[1vw] my-[1vw] items-center">

                  <img className='h-[9.5vw] shadow-xl rounded-sm unrevealed' ref={containerRef} src={datas.image} alt="" />  <p className=' font-Body uppercase'>{datas.name}</p> <p className='font-body text-[1.2vw]'>${datas.price}</p> <p className='font-body text-[1.2vw]'>{datas.quantity} LEFT</p>
                  <form onSubmit={onOrderSubmit} className={datas.id} >

                    <input className='outline-[.1vw] text-[1.2vw] rounded-md shadow-md outline outline-slate-300 pl-[.6vw] text-black w-[70%]'
                      type={'number'}
                      name="quantity"
                      min={1}
                      max={datas.quantity}

                      id={'input '+ datas.id}
                      placeholder={' Insert Quantity'} />

                    <button
                      className='bg-green-400 shadow-md hover:bg-green-200 ml-[11vw] flex items-center justify-center font-medium mt-[1vw] outline outline-slate-200 outline-[.05vw] rounded-sm px-[.3vw] py-[.2vw] text-[1.1vw] '

                      type="submit">
                      <div className='text-black '>ADD TO CART</div>
                    </button>
                  </form>
                </div>) : <div className='w-[30vw]'> Refresh</div>
            }
          </div>
          <div className='flex justify-center mb-[1vw] mt-[3vw] gap-[1vw]'>
            {
              pageAmount &&

              pageAmount.map(index =>
                <button
                  className='  focus:bg-slate-400 outline p-[.5vw] font-body  px-[1.5vw] outline-[.1vw] outline-slate-500 rounded-full'
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




      )



    )
  }

  return (
    //***The products listed out
    <div className='h-[100vh]'>
      <div className='flex justify-center min-w-screen m-h-screen overflow-hidden'>
        <img className=' absolute min-w-[100vw] max-h-[75vw] mt-[-29vw] z-[3]  ' loading='lazy' src="http://localhost:8000/static/just-food-sharpen.png" alt="" />
        <div className='absolute  text-black rounded-[.1vw] bg-white  mt-[43vw] pb-[1vw]   flex  items-center flex-col '>

          <div className=' pt-[.7vw]  text-[2.5vw] flex flex-col font-body  z-[200]' >Menu
          </div>
          <div className='absolute px-[3.3vw] py-[3.3vw] rounded-full border border-b-0 border-l-0 border-r-0 z-10 bg-white'>

          </div>







          <div className='flex gap-3 bg-white z-[10] justify-center'>


            {
              //All the filter buttons will be listed out
              //Each button will trigger the hasRender and filter 
              //The filters are based the category in the data base
              productItems &&
              productItems.map((type, index) => (

                <>
                  <button
                    id={productItems[index]}
                    className=' px-[.6vw] text-[1.5vw] font-body rounded-full  bg-white border-red-400 transition-all delay-150 ease-in '
                    key={index}
                    value={productItems[index]}
                    onClick={() => {

                      let value = productItems[index];
                      setRender(true);
                      setFilter(value);
                      //If I didn't put this then the page would 
                      //goto a filter with a non existing pagination for the products
                      setCurrentPage(1);


                    }
                    }>

                    {productItems[index]}

                  </button>
                </>
              ))}
          </div>

          {
            //Once a filter has been clicked, this handleFilter will be triggered
            //This doesn't request anything from the server since the data is already stored
            hasRender && data != '' ? <HandleFilter /> : <div>
              {
                //This is so you can see the data listed with the all filter
                //When you click on the page 
                data ?
                  <Clicker />
                  :
                  <div className='w-[90vw] h-[30vw] flex flex-col item-center  animate-pulse'>
                    <div className=' flex flex-row w-[100%] h-[100%]'>
                      <div className='mt-[4vw] h-[70%] ml-[5vw] w-[25%] flex rounded-md bg-slate-200'></div>
                      <div className='mt-[4vw] h-[70%] ml-[5vw] w-[25%] flex rounded-md bg-slate-200'></div>
                      <div className='mt-[4vw] h-[70%] ml-[5vw] w-[25%] flex rounded-md bg-slate-200 mr-[4vw]'></div>

                    </div>

                    <div className='mt-[-1.5vw] h-[10%] ml-[34vw] w-[25%] flex  rounded-md bg-slate-200'>

                    </div>




                  </div>
              }
            </div>}

        </div>

      </div>
    </div>

  );
};

export default Products;