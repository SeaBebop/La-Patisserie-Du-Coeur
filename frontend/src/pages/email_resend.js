import React, { useRef,useEffect, useState } from 'react';
import axios from '../api/axios';
import useAuth from '../Hooks/useAuth';

const KEY_URL = 'http://127.0.0.1:8000/api/v1/dj-rest-auth/registration/resend-email/';

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
    <div>
    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

      <form onSubmit={onSubmit}>
      <div>
        <label for="html">Resend Verification</label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          ref={emailRef}
          type={'input'}
          name={'email'}/>
      </div>
      <button type={'submit'}>Submit</button>
      </form>    
    </div>
  
  );
};
  
export default Resend;