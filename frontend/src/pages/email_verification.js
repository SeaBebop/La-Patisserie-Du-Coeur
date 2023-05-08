import React, { useRef,useEffect, useState } from 'react';
import { useParams,Link } from 'react-router-dom';
import axios from '../api/axios';
import useAuth from '../Hooks/useAuth';

const KEY_URL = 'http://127.0.0.1:8000/api/v1/dj-rest-auth/registration/verify-email/';

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
    <div className="mt-[12vw] h-[16vw]  flex flex-col justify-center ml-[37vw] w-[28vw] bg-[#1a58ab] rounded-md shadow-lg">
    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
    <label className='text-white text-[2vw] ' for="html">Confirm Verification</label>
      <form onSubmit={onSubmit}>
      <div>
       
        <input
          hidden
          onChange={() => setKey(verifyID)}
          value={verifyID}
          ref={keyRef}
          type={'input'}
          name={'key'}/>
      </div>
      <button className={"rounded-md  py-[.2vw] px-[1vw]  mb-[2vw] hover:bg-slate-300 bg-slate-100"} type={'submit'}>Verify</button>
      </form>    
      {<Link className="text-blue-300 underline"  to='/email_resend'>Resend Verification Email</Link>}
    </div>
  
  );
};
  
export default Verify;