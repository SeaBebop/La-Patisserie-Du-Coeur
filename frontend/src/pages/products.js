import { useEffect, useRef, useState } from 'react';
import axios from '../api/axios';
import { json } from 'react-router-dom';
import useAuth from '../Hooks/useAuth';
import jwt_decode from 'jwt-decode'
import useCartChecker from '../Hooks/useCartChecker';



const PRODUCT_DATA_URL = 'http://127.0.0.1:8000/api/v1/shop';
const ORDER_URL = 'http://127.0.0.1:8000/api/v1/order/';


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
  const { cartTrigger, setcartTrigger } = useCartChecker();
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



      }

      catch (err) {
        if (err.response) {
          //If not in the 200 response range


        }
        else {

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

    const targetValueQuantity = e.target[0].value != "" ? e.target[0].value : 0;

    const targetID = e.target[0].id;

    const stringifiedData = userName ? JSON.stringify({ 'quantity': targetValueQuantity, 'user': userName, 'item': classNameInt })
      : JSON.stringify({ 'quantity': targetValueQuantity, 'item': classNameInt })


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

      try {

      }
      catch (err) {

      }
    }
  }
  useEffect(() => {

    window.scrollTo(0, 0);


  }, [])

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

          <div className='flex flex-col lg:flex-row  gap-[1vw]'>
            {data ?
              data.filter(datas => datas.category === productType).slice(start, end).map(datas =>
                /*Key is portional to the backend name*/
                <div key={datas.id} className="flex lg:h-[25vw] h-[50vw] flex-col  justify-center  lg:text-[1.4vw] shadow-lg bg-slate-100 outline outline-[.1vw] outline-slate-300 px-[1.3vw] py-[.8vw] rounded-[.5vw] mx-[1vw] my-[1vw] items-center">

                  <img className='lg:h-[9.5vw] h-[22vw] shadow-xl rounded-sm unrevealed ' ref={containerRef} src={datas.image} alt="" />  <p className=' font-Body md:text-[2vw] lg:text-[1.15vw] uppercase'>{datas.name}</p> <p className='font-body text-[3.5vw] lg:text-[1.34vw]'>${datas.price}</p> <p className='font-body md:text-[1.8vw] lg:text-[1.2vw]'>{datas.quantity} LEFT</p>
                  <form onSubmit={onOrderSubmit} className={datas.id} >
                    <div className='flex lg:flex-col flex-row'>
                      <input className='outline-[.1vw] lg:text-[1.2vw] text-[4vw] h-[6.6vw] lg:h-[2vw] rounded-md shadow-md outline outline-slate-300 pl-[2vw] lg:pl-[.6vw] text-black w-[80%] lg:w-[90%]'
                        type={'number'}
                        name="quantity"
                        min={1}
                        max={datas.quantity}

                        id={'input ' + datas.id}
                        placeholder={' Insert Quantity'} />

                      <button

                        className='bg-green-400 shadow-md hover:bg-green-200 ml-[11vw] flex items-center justify-center font-medium lg:mt-[1vw] mt-[-5vw] outline outline-slate-200 outline-[.05vw] rounded-sm  px-[.3vw] py-[.2vw] text-[3vw] lg:text-[1.1vw] '

                        type="submit">
                        <div className='text-black '>ADD TO CART</div>
                      </button>
                    </div>

                  </form>
                </div>) : <div className='w-[30vw]'> Refresh</div>
            }
          </div>
          <div className='flex justify-center mb-[1vw] lg:mt-[0vw] mt-[3vw] gap-[3vw] lg:gap-[1vw]'>
            {
              pageAmount &&

              pageAmount.map(index =>
                <button
                  className='  focus:bg-slate-400 outline p-[.5vw] font-body text-[4vw]  px-[3vw] lg:text-[1vw]  lg:px-[1vw] outline-[.1vw] outline-slate-500 rounded-full'
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






        :
        //For the filter ALL
        <div className='lg:h-[33vw]'>
          <div className='flex flex-col lg:flex-row  gap-[1vw]'>
            {data ?
              data.slice(start, end).map(datas =>
                /*Key is portional to the backend name*/
                <div key={datas.id} className="flex lg:h-[26vw] h-[50vw] flex-col  justify-center  lg:text-[1.4vw] shadow-lg bg-slate-100 outline outline-[.1vw] outline-slate-300 px-[1.3vw] py-[.8vw] rounded-[.5vw] mx-[1vw] my-[1vw] items-center">

                  <img className='lg:h-[9.5vw] h-[22vw] shadow-xl rounded-sm unrevealed ' ref={containerRef} src={datas.image} alt="" />  <p className='md:text-[2vw] lg:text-[1.15vw] font-Body uppercase'>{datas.name}</p> <p className='font-body text-[3.5vw] lg:text-[1.2vw]'>${datas.price}</p> <p className='font-body md:text-[1.8vw] lg:text-[1.2vw]'>{datas.quantity} LEFT</p>
                  <form onSubmit={onOrderSubmit} className={datas.id} >
                    <div className='flex lg:flex-col flex-row'>
                      <input className='outline-[.1vw] lg:text-[1.2vw] text-[4vw] h-[6.6vw] lg:h-[2vw] rounded-md shadow-md outline outline-slate-300 pl-[2vw] lg:pl-[.6vw] text-black w-[80%] lg:w-[90%]'
                        type={'number'}
                        name="quantity"
                        min={1}
                        max={datas.quantity}

                        id={'input ' + datas.id}
                        placeholder={' Insert Quantity'} />

                      <button
                        className='bg-green-400 shadow-md hover:bg-green-200 ml-[11vw] flex items-center justify-center font-medium lg:mt-[1vw] mt-[-5vw] outline outline-slate-200 outline-[.05vw] rounded-sm  px-[.3vw] py-[.2vw] text-[3vw] lg:text-[1.1vw] '

                        type="submit">
                        <div className='text-black '>ADD TO CART</div>
                      </button>
                    </div>

                  </form>
                </div>) : <div className='w-[30vw]'> Refresh</div>
            }
          </div>
          <div className='flex justify-center mb-[1vw]  gap-[3vw] lg:gap-[1vw]'>
            {
              pageAmount &&

              pageAmount.map(index =>
                <button
                  className='  focus:bg-slate-400 outline p-[.5vw] font-body text-[4vw]  px-[3vw] lg:text-[1vw]  lg:px-[1vw] outline-[.1vw] outline-slate-500 rounded-full'
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
    <div className='lg:h-[82vw] h-auto min-h-[800px]'>
      <div className='flex justify-center  overflow-hidden'>
        <img className=' absolute min-w-[100vw] max-h-[75vw] mt-[-29vw] z-[3]  ' loading='lazy' src="http://localhost:8000/static/just-food-sharpen.png" alt="" />
        <div className='  text-black rounded-[.1vw] bg-white  lg:mt-[43vw] mt-[40vw]   flex  items-center flex-col '>

          <div className=' pt-[.7vw]  lg:text-[2.5vw] text-[6vw] flex flex-col font-body  z-[200]' >Menu
          </div>
          <div className='absolute lg:px-[3.3vw] lg:py-[3.3vw] px-[6.6vw] py-[6.6vw] rounded-full border border-b-0 border-l-0 border-r-0 z-10 bg-white'>

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
                    className=' lg:px-[.6vw] px-[.7vw] lg:text-[1.5vw] text-[4.4vw] font-body rounded-full  bg-white border-red-400 transition-all delay-150 ease-in '
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
                  <div>

                    <div id='desktop' className='w-[90vw]  lg:h-[30vw] h-[40vw] hidden lg:flex flex-col item-center  animate-pulse'>
                      <div className=' flex flex-row w-[100%] h-[100%]'>
                        <div className='mt-[4vw] h-[75%] ml-[5vw] w-[25%] flex rounded-md bg-slate-200'></div>
                        <div className='mt-[4vw] h-[75%] ml-[5vw] w-[25%] flex rounded-md bg-slate-200'></div>
                        <div className='mt-[4vw] h-[75%] ml-[5vw] w-[25%] flex rounded-md bg-slate-200 mr-[4vw]'></div>

                      </div>

                      <div className='mt-[-1.5vw] h-[10%] ml-[34vw] w-[25%] flex  rounded-md bg-slate-200'>

                      </div>




                    </div>


                    <div id='mobile' className='w-[90vw]  min-h-[600px] max-h-[600px] h-[30vw]  lg:hidden flex-col item-center  animate-pulse'>
                      <div className=' flex flex-col justify-center items-center w-[100%] h-[100%]'>
                        <div className='mt-[4vw] h-[25%]  w-[85%] flex rounded-md bg-slate-200'></div>
                        <div className='mt-[4vw] h-[25%]  w-[85%] flex rounded-md bg-slate-200'></div>
                        <div className='mt-[4vw] h-[25%]  w-[85%] flex rounded-md bg-slate-200 '></div>

                        <div className='mt-[4.5vw] h-[8%]  w-[55%] flex  rounded-md bg-slate-200'>
                        </div>



                      </div>




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