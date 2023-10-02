import React, { useEffect, useState } from 'react';
import { useParams,Link } from 'react-router-dom';
import axios from '../api/axios';
import useAuth from '../Hooks/useAuth';




const Item = () => {
  const {productID} = useParams();
  const AUTHOR_DATA_URL = 'https://lacoeurbakery-com.onrender.com/api/v1/' + productID;

  const {auth} = useAuth();
  const [data,setData] = useState('');
  const token = auth.accessToken;

  useEffect(() =>{
    const fetchGet = async () => {
      try {
        const response = await axios.get(AUTHOR_DATA_URL,
          {
          headers:{
            'Content-Type' : 'application/json',
            'Authorization' : 'JWT ' + token
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
          console.log('JWT ' + token);
          }
          else{
            console.log('Error:Failed to connect');
          }
 
      }
    }
   fetchGet();
},[token])
 
  return (
    <div>
  <div>
      <h2>Products</h2>
    <p>{data.name}</p>
    </div>
    </div>
  );
};
  
export default Item;