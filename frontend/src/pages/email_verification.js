import React, { useRef,useEffect, useState } from 'react';
import { useParams,Link } from 'react-router-dom';
import axios from '../api/axios';
import useAuth from '../Hooks/useAuth';

const KEY_URL = 'https://lacoeurbakery-com.onrender.com/api/v1/dj-rest-auth/registration/verify-email/';

const Verify = () => {
  const {verifyID} = useParams();
  const {auth} = useAuth();
  
  const [verificationKey,setKey] = useState('');
  const [errMsg,setErrMsg] = useState('');

  const keyRef = useRef();
  const errRef = useRef();
  const token = auth.accessToken;

  //Apply focus to input the keyRef to grab user attention
  useEffect(() => {
    keyRef.current.focus();
  }, [])

  //Remove error msg if any change to the key
  useEffect(() => {
    setErrMsg('');
  }, [verificationKey])

  useEffect(()=>{},[])
    const onSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post(KEY_URL, JSON.stringify({'key' : verifyID}),
          {
          headers:{
            'Content-Type': 'application/json',
          } , withCredentials:true
          
        }

        );
        console.log(response);
        setErrMsg("*Verification Success!");
      }
     
       catch (err) {
          if(err.response){ 
          //If not in the 200 response range

          setErrMsg('*Verification Expired,Resend Email')
          }
          else{
            console.log('Error:Failed to connect');
          }
 
      }
      
    }


 
  return (
    <div className='lg:h-[60vw] min-h-[750px]  h-[80vw] flex justify-center items-center'>
    <div className="mt-[1vw] absolute lg:h-[16vw] h-[30vw] w-[70vw] flex flex-col justify-center  lg:w-[28vw] bg-[#ee5042e5] rounded-md shadow-lg">
    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
    <label className='text-white text-[4.4vw] lg:text-[2vw] ' for="html">Confirm Verification</label>
      <form onSubmit={onSubmit}>
      <div>
       
        <input
          hidden
          onChange={() => setKey(verifyID)}
          value={verifyID}
          ref={keyRef}
          className={" h-[3vw]  lg:text-[1.25vw] w-[5vw] mt-[1.6vw] rounded bg-white"} 
          type={'input'}
          name={'key'}/>
      </div>
      <button className={" h-[6vw] mb-[2vw] lg:h-[3vw]  lg:text-[1.25vw] text-[3vw] w-[20vw] lg:w-[5vw] mt-[.6vw] lg:mb-[.6vw] rounded bg-white"}  type={'submit'}>Verify</button>
      </form>    
      {<Link className="text-black lg:text-[1.25vw] text-[3vw] hover:text-slate-700 underline"  to='/email_resend'>Resend Verification Email</Link>}
    </div>   
    </div>
   
  
  );
};
  
export default Verify;