import React, { useRef,useEffect, useState } from 'react';
import axios from '../api/axios';
import useAuth from '../Hooks/useAuth';

const KEY_URL = 'https://lacoeurbakery-com.onrender.com/api/v1/dj-rest-auth/registration/resend-email/';

const Resend = () => {
  const {auth} = useAuth();
  
  const [email,setEmail] = useState('');
  const [errMsg,setErrMsg] = useState('');

  const emailRef = useRef();
  const errRef = useRef();
  const token = auth.accessToken;

  //Apply focus to input the keyRef to grab user attention
  useEffect(() => {
    emailRef.current.focus();
  }, [])

  //Remove error msg if any change to the key
  useEffect(() => {
    setErrMsg('');
  }, [email])

  useEffect(()=>{},[])
    const onSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post(KEY_URL, JSON.stringify({'email' : email}),
          {
          headers:{
            'Content-Type': 'application/json',
          } , withCredentials:true
          
        }

        );
        console.log(response);
        setErrMsg("*Resent Verification")
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


 
  return (
    <div className='h-[85vw] lg:h-[55vw] flex min-h-[750px]  justify-center items-center w-screen'>
    <div className=" lg:h-[16vw] h-[32vw] mt-[6vw] lg:mt-[0vw] flex flex-col justify-center w-[60vw]  lg:w-[28vw] bg-[#ee5042e5]  rounded-md shadow-lg">
    <p ref={errRef} className={errMsg ? "errmsg text-[3vw] lg:text-[1.6vw]" : "offscreen"} aria-live="assertive">{errMsg}</p>
    <label className='text-white text-[4vw] lg:text-[2vw] ' for="html">Resend Verification</label>
      <form onSubmit={onSubmit}>
      <div>
        
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          ref={emailRef}
          type={'input'}
          className='rounded-sm w-[70%] text-[3vw] lg:text-[1.25vw] pl-[1vw] h-[4vw] lg:h-[2.4vw]  mt-[3.1vw]'
          placeholder='Email'
          name={'email'}/>
      </div>
      <button className={"h-[5vw] lg:h-[3vw] lg:text-[1.25vw] text-[3vw] w-[30%]  lg:w-[5vw] mt-[1.6vw] rounded bg-white"}  type={'submit'}>Submit</button>
      </form>    
    </div>    
    </div>
  
  
  );
};
  
export default Resend;