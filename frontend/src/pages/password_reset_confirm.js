import React, { useRef,useEffect, useState } from 'react';
import axios from '../api/axios';
import useAuth from '../Hooks/useAuth';

const KEY_URL = 'http://localhost:8000/api/v1/dj-rest-auth/password/reset/confirm/';
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%)]).{7,24}$/;

const PasswordResetConfirm = () => {
  const {auth} = useAuth();
  //Form Hooks
  const [newPWD1,setPWD1] = useState('');
  const [pwd1Focus,setPWD1Focus] = useState(false);
  const [pwd1Valid,setPWD1Valid] = useState('');

  const [newPWD2,setPWD2] = useState('');
  const [pwd2Focus,setPWD2Focus] = useState('');
  const [pwd2Match,setPWD2Match] = useState(false);

  const [tokenPWD,setTokenPWD] = useState('');
  const [tokenPWDFocus,setTokenPWDFocus] = useState(false);

  const [uid,setUid] = useState('');
  //Conditional Hooks
  const [errMsg,setErrMsg] = useState('');
  const [success,setSuccess] = useState(false);
  //Set Up
  const mainRef = useRef();
  const errRef = useRef();
  const token = auth.accessToken;

  //Apply focus to input the keyRef to grab user attention
  useEffect(() => {
    mainRef.current.focus();
  }, [])

  //Testing Validity
  useEffect(()=>{
  const result = PWD_REGEX.test(newPWD1);
  setPWD1Valid(result);
  //Testing if PWD1 and 2 matches
  const match = newPWD1 === newPWD2;
  setPWD2Match(match);
  },[newPWD1,newPWD2])

  //Remove error msg if any change to the key
  useEffect(() => {
    setErrMsg('');
  }, [newPWD1,newPWD2,tokenPWD])

  useEffect(()=>{},[])
    const onSubmit = async (e) => {
      setUid('u');
      e.preventDefault();
      try {
        const response = await axios.post(KEY_URL, JSON.stringify({'new_password1' : newPWD1,'new_password2' :newPWD2 ,'uid' : uid,'token' : tokenPWD}),
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
          if(!err.response){ 
          //If not in the 200 response range
          setErrMsg('No Server Response');
          }
          else{
            setErrMsg('Check if password 1, password 2 and the Token are all correct, if it is then request a password reset again')
          }
 
      }
      
    }


 
  return (
    <>
    {success ? (
    <div>
          <h1>Password Reset Completed!</h1>
    </div>)
    :
    (
      <div className="mt-[12vw] h-[20vw]  flex flex-col justify-center ml-[37vw] w-[32vw] bg-[#1a58ab] rounded-md shadow-lg">
      <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
  
        <form onSubmit={onSubmit}>
        <div>
          <label className='text-white  mr-[1vw]' for="html">New Password</label>
          <input
            onChange={(e) => setPWD1(e.target.value)}
            value={newPWD1}
            ref={mainRef}
            type={'password'}
            name={'PWD1'}
            className="rounded-md pl-[1vw] py-[.2vw]  mb-[.4vw] bg-slate-100"
            aria-describedby='pwd1Note'
            aria-invalid={pwd1Valid ? 'true' : 'false'}
            onBlur = {() => setPWD1Focus(false)}
            onFocus = {() => setPWD1Focus(true)}
            />
<p id='pwd1Note' className={!pwd1Valid && pwd1Focus && newPWD1  ? 'instructions' : 'offscreen'}>Password must be at least 7 characters and contain a special and a number</p>
        </div>
        <div>
          <label className='text-white  mr-[1vw]'  for="html">Confirm Password</label>
          <input
            onChange={(e) => setPWD2(e.target.value)}
            value={newPWD2}
            className="rounded-md pl-[1vw] py-[.2vw]  mb-[.4vw] bg-slate-100"
            aria-describedby='matchNote'
            aria-invalid={pwd2Match? 'true':'false'}
            onBlur = {() => setPWD2Focus(false)}
            onFocus = {() => setPWD2Focus(true)}
            type={'password'}
            name={'PWD2'}/>
        </div>
        <p id='pwd2Note' className={!pwd2Match && pwd2Focus && newPWD2 ? 'instructions' : 'offscreen'}>Make sure that password 2 matches with password 1</p>
        <div>
          
          <input
            hidden
            onChange={(e) => setUid('u')}
            value={'u'}
            type={'input'}
            name={'UID'}/>
            
        </div>
        <div>
          <label className='text-white  mr-[1vw]'  for="html">Token</label>
          <input
         className="rounded-md pl-[1vw] py-[.2vw]  mb-[.4vw] bg-slate-100"
            onChange={(e) => setTokenPWD(e.target.value)}
            value={tokenPWD}

            onBlur = {() => setTokenPWDFocus(false)}
            onFocus = {() => setTokenPWDFocus(true)}
            type={'input'}
            name={'Token'}/>
        </div>
        <button  className={"rounded-md  py-[.2vw] px-[1vw]  mb-[2vw] hover:bg-slate-300 bg-slate-100"}  disabled={!pwd2Match || !pwd1Valid || !tokenPWD} type={'submit'}>Submit</button>
        
        </form>    
      </div>
    )}
   
    </>
  )
}

  
export default PasswordResetConfirm;