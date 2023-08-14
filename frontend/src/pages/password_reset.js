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
    <div className=' lg:h-[60vw] flex min-h-[750px]  justify-center items-center h-[62vw] w-screen'>
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
      <div className="lg:h-[16vw] min-h-[750px]  h-[35vw] lg:mt-[0vw] mt-[10vw] flex flex-col justify-center w-[60vw] lg:w-[28vw] bg-[#ee5042e5] rounded-md shadow-lg">
      <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
      <label className='text-white lg:text-[2vw] text-[4vw] lg:h-[3.5vw]  mb-[-3vw]' for="html">Password Reset</label>
        <form onSubmit={onSubmit} className='mt-[5vw] h-auto flex-col gap-[4vw]'>
        <div>
          
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            className="rounded-md lg:text-[1.2vw] text-[3vw] pl-[1vw]  lg:py-[.2vw]  h-[4vw] lg:h-[2.4vw] w-[80%] lg:w-[18vw]  mb-[.4vw] bg-slate-100"
            value={email}
            ref={emailRef}
            type={'input'}
            name={'email'}/>
        </div>
        <button  className={"rounded-md lg:text-[1.3vw] text-[2.7vw] py-[.2vw] px-[1vw]  w-[10vw] lg:w-[7vw] h-[6vw] lg:h-[2.4vw] mb-[1vw] hover:bg-slate-300 bg-slate-100"} type={'submit'}>Submit</button>
        </form>    
      </div>
    )}
   
    </>  
    </div>
    
  )
}

  
export default PasswordReset;