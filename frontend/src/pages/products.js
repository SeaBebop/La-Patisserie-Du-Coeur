import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const PRODUCT_DATA_URL = 'http://127.0.0.1:8000/api/v1/shop';

/*The filter Idea is inspired by  https://codesandbox.io/s/r5x4i?file=/src/App.js 

Rendering idea for the handleFilter is inspired by 
https://stackoverflow.com/questions/69476529/way-to-render-a-new-component-onclick-in-react-js 

Pagination idea is something I came up with, Could be flawed since it isn't test as much as a library 
*/
const productItems = ['All','Bagels','Biscuits','Breads','Cake','Pastries','Pie'];

const Products = () => {
  //This is where the data of products will be stored
  const [data,setData] = useState('');
  //This will store one of the values from the productItems list 
  const [filter,setFilter] = useState('');
  //Used to Control when the handleFilter jsx element is called
  const [hasRender, setRender] = useState(false);

  //Pagination set up:Reminds me of Linked List with Head Tail 
  const [currentPage, setCurrentPage] = useState(1);
  const [productPerPage, setProductPerPage] = useState(4);

  //Funtion Will fetch the products in the URL
  useEffect(() =>{
    const fetchProduct = async () => {
      try {
        const response = await axios.get(PRODUCT_DATA_URL,
          {
          headers:{
            'Content-Type' : 'application/json',

          } , withCredentials:true
          
        }
        // dont need to make json with this methood
        //useeffect-> async function with await as response and the method, catch and then set
        )
        setData(response.data);
      }
     
       catch (err) {
          if(err.response){ 
          //If not in the 200 response range
          console.log(err.response.data);
          console.log(err.response.status);
     
          }
          else{
            console.log('Error:Failed to connect');
          }
 
      }
    }
   fetchProduct();
},[])
//Intialize the page with All as the filter
function Clicker(){
    document.getElementsByClassName('All')[0].click();
}
//The idea is to 
function HandleFilter(){
  const productType = filter;
  //console.log(document.getElementsByClassName('buttonValue')) <-Failed idea, leaving it here to remember why
  let pageCalc = 0;
  let counter = 0;
  let pageAmount = [];

  if(filter !== 'All')
  {
      //Never in your life make this mistake again
      //let pageCalc = Math.ceil(data.filter(datas => datas.category === productType).length / 4)
      //Redefine another variable to a different address with the same name
     pageCalc = Math.ceil(data.filter(datas => datas.category === productType).length / 4)
    
  }else{
     pageCalc = Math.ceil(data.map(datas =>datas.id).length / 4)
  }
  
  while(counter < pageCalc)
  {
    counter++
    pageAmount.push(counter)
  }

  let start;
  if(currentPage !== 1 ){
     
     start = 4 * (currentPage-1)
  }else{
    start = 0
  }
  
  let end = 4 * currentPage;

  return(
    
  (productType !== 'All' ?

    <div>
      {data ?
        data.filter(datas => datas.category === productType).slice(start,end).map(datas =>
          /*Key is portional to the backend name*/
          <div key={datas.id} className="data__id">
            {datas.name} {datas.slug} 
          </div>) : <p>Refresh the page</p>
          }  
<div>

{
  pageAmount &&

    pageAmount.map(index =>  
       <button
      className={index}
      key={1}
      value={1}
      onClick={()=>setCurrentPage(index)}
      type="">
      
      </button>)

} 





</div>
    </div>
    
    :
    <div>
      {data ?
        data.slice(start,end).map(datas =>
          /*Key is portional to the backend name*/
          <div key={datas.id} className="data__id">
            {datas.name} {datas.slug}
          </div>) : <p>Refresh the page</p>
          } 
    {
  pageAmount &&

    pageAmount.map(index =>  
       <button
      className={index}
      key={index}
      value={index}
      onClick={()=>setCurrentPage(index)}
      type="">
      
      </button>)

} 
    </div>
    

  )   
  


  )
}

  return (
    <div>
    <div>
    <h2>Products</h2>
    
    {
    //All the filter buttons will be listed out
    //Each button will trigger the hasRender and filter 
    //The filters are based the category in the data base
    productItems &&
        productItems.map((type, index) => (
          
          <>
            <button 
            className={productItems[index]} 
            key={index} 
            value={productItems[index]} 
            onClick={() => {
              let value = productItems[index];  
              setRender(true);
              setFilter(value);
              //If I didn't put this then the page would 
              //goto a filter with a non existing pagination for the products
              setCurrentPage(1);}
              }>

              {productItems[index]}
              
            </button>
          </>
        ))}


      {
      //Once a filter has been clicked, this handleFilter will be triggered
      //This doesn't request anything from the server since the data is already stored
      hasRender ? <HandleFilter /> : <div>
          {
          //This is so you can see the data listed with the all filter
          //When you click on the page 
          data ?
          <Clicker/>
           : 
           <p>Refresh the page</p>
            } 
      </div>}
   
    </div>
    </div>
  );
};
  
export default Products;