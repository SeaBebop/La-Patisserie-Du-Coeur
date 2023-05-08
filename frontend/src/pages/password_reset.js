import React, { useRef,useEffect, useState } from 'react';
import axios from '../api/axios';
import useAuth from '../Hooks/useAuth';

const KEY_URL = 'http://localhost:8000/api/v1/dj-rest-auth/password/reset/';

const PasswordReset = () => {
  const {auth} = useAuth();
  
  const [email,setEmail] = useState('');
  const [errMsg,setErrMsg] = useState('');
  const [success,setSuccess] = useState(false);
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
        setSuccess(true);
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
    <>
    {success ? (
    <div>
          <h1>Password Reset Email Sent!</h1>
                <p>{/*Password Reset Email*/}
                The server has sent a password reset key. Copy the key and click the link in the email with further instructions.
                </p>

    </div>)
    :
    (
      <div className="mt-[12vw] h-[16vw]  flex flex-col justify-center ml-[37vw] w-[28vw] bg-[#1a58ab] rounded-md shadow-lg">
      <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
      <label className='text-white text-[2vw] mb-[-3vw]' for="html">Password Reset</label>
        <form onSubmit={onSubmit} className='mt-[4vw]'>
        <div>
          
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            className="rounded-md pl-[1vw] py-[.2vw]  mb-[.4vw] bg-slate-100"
            value={email}
            ref={emailRef}
            type={'input'}
            name={'email'}/>
        </div>
        <button  className={"rounded-md  py-[.2vw] px-[1vw]  mb-[2vw] hover:bg-slate-300 bg-slate-100"} type={'submit'}>Submit</button>
        </form>    
      </div>
    )}
   
    </>
  )
}

  
export default PasswordReset;