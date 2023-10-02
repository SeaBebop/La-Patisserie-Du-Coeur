import React, { useRef, useEffect, useState } from 'react';
import axios from '../api/axios';
import useAuth from '../Hooks/useAuth';

const KEY_URL = 'https://lacoeurbakery-com.onrender.com/api/v1/dj-rest-auth/password/reset/confirm/';
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%)]).{7,24}$/;

const PasswordResetConfirm = () => {
  const { auth } = useAuth();
  //Form Hooks
  const [newPWD1, setPWD1] = useState('');
  const [pwd1Focus, setPWD1Focus] = useState(false);
  const [pwd1Valid, setPWD1Valid] = useState('');

  const [newPWD2, setPWD2] = useState('');
  const [pwd2Focus, setPWD2Focus] = useState('');
  const [pwd2Match, setPWD2Match] = useState(false);

  const [tokenPWD, setTokenPWD] = useState('');
  const [tokenPWDFocus, setTokenPWDFocus] = useState(false);

  const [uid, setUid] = useState('');
  //Conditional Hooks
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  //Set Up
  const mainRef = useRef();
  const errRef = useRef();
  const token = auth.accessToken;

  //Apply focus to input the keyRef to grab user attention
  useEffect(() => {
    mainRef.current.focus();
  }, [])

  //Testing Validity
  useEffect(() => {
    const result = PWD_REGEX.test(newPWD1);
    setPWD1Valid(result);
    //Testing if PWD1 and 2 matches
    const match = newPWD1 === newPWD2;
    setPWD2Match(match);
  }, [newPWD1, newPWD2])

  //Remove error msg if any change to the key
  useEffect(() => {
    setErrMsg('');
  }, [newPWD1, newPWD2, tokenPWD])

  useEffect(() => { }, [])
  const onSubmit = async (e) => {
    setUid('u');
    e.preventDefault();
    try {
      const response = await axios.post(KEY_URL, JSON.stringify({ 'new_password1': newPWD1, 'new_password2': newPWD2, 'uid': uid, 'token': tokenPWD }),
        {
          headers: {
            'Content-Type': 'application/json',
          }, withCredentials: true

        }

      );
      console.log(response);
      setSuccess(true);
    }

    catch (err) {
      if (!err.response) {
        //If not in the 200 response range
        setErrMsg('No Server Response');
 
      }
      else {
        setErrMsg('Check if all inputs are correct and try again')
      }

    }

  }



  return (
    <div className='lg:h-[50vw] h-[80vw] min-h-[750px]  flex justify-center items-center '>
      

    <>
      {success ? (
        <div>
          <h1>Password Reset Completed!</h1>
        </div>)
        :
        (
          <div className=" h-[65vw]  lg:h-[25vw]  flex flex-col gap-[vw] justify-center w-[75vw] lg:w-[32vw] bg-[#ee5042e5] rounded-md shadow-lg">
            <p ref={errRef} className={errMsg ? "errmsg text-[3vw] lg:text-[1.5vw] mb-[2vw] text-white" : "offscreen"} aria-live="assertive">*{errMsg}</p>

            <form className='h-auto' onSubmit={onSubmit}>
              <div>
                <div className="absolute ml-[5.9vw] mt-[-3vw] lg:mt-[-.7vw] delay-100  transition-all">
                  <p className={newPWD1 != '' ? "opacity-100 ease-in text-[3.4vw] lg:text-[1.2vw] delay-100 transition-all" : "hidden ml-[3.7vw]  ease-out delay-100 transition-all"}>New Password</p>
                </div>
                <input
                  onChange={(e) => setPWD1(e.target.value)}
                  value={newPWD1}
                  ref={mainRef}
                  type={'password'}
                  name={'PWD1'}
                  placeholder='New Password'
                  className="rounded-md lg:text-[1.2vw] text-[2.3vw] h-[4.2vw]  lg:h-[2vw] mt-[1vw]  w-[80%]  lg:w-[20vw] pl-[1vw] py-[.2vw] mb-[6vw] lg:mb-[.4vw] bg-slate-100"
                  aria-describedby='pwd1Note'
                  aria-invalid={pwd1Valid ? 'true' : 'false'}
                  onBlur={() => setPWD1Focus(false)}
                  onFocus={() => setPWD1Focus(true)}
                />
                <p id='pwd1Note' className={!pwd1Valid && newPWD1 ? "instructions absolute ml-[2vw] lg:ml-[2vw] mt-[-6vw] lg:mt-[-.1vw] text-white text-[2.5vw] lg:text-[.9vw]" : "offscreen hidden abolute "}>*7+char with one lower and uppercase letter, number, and symbol</p>
              </div>
              <div>
              <div className="absolute ml-[5.9vw] mt-[-1.5vw] lg:mt-[2.5vw] delay-100  transition-all">
                  <p className={newPWD2 != '' ? "opacity-100 ease-in text-[3.4vw] mt-[-1.8vw] lg:text-[1.2vw] delay-100 transition-all" : "hidden ml-[3.7vw]  ease-out delay-100 transition-all"}>Confirm New Password</p>
                </div>
                <input
                  onChange={(e) => setPWD2(e.target.value)}
                  value={newPWD2}
                  className="rounded-md lg:text-[1.2vw] text-[2.3vw] h-[4.2vw] lg:h-[2vw] mt-[0vw] lg:mt-[2.5vw] w-[80%] lg:w-[20vw] pl-[1vw] py-[.2vw]  mb-[.4vw] bg-slate-100"
                  aria-describedby='matchNote'
                  placeholder='Confirm Password'
                  aria-invalid={pwd2Match ? 'true' : 'false'}
                  onBlur={() => setPWD2Focus(false)}
                  onFocus={() => setPWD2Focus(true)}
                  type={'password'}
                  name={'PWD2'} />
              </div>
              <p id='pwd2Note' className={!pwd2Match && newPWD2 ? "instructions absolute ml-[5.5vw]  lg:mt-[-.1vw] text-white mt-[-1vw] text-[2.5vw]  lg:text-[.9vw]" : "offscreen hidden abolute "}>*Make sure the passwords match</p>
              <div>

                <input
                  hidden
                  onChange={(e) => setUid('u')}
                  value={'u'}
                  type={'input'}
                  name={'UID'} />

              </div>
              <div>
              <div className="absolute ml-[5.9vw] mt-[2vw] lg:mt-[.8vw] delay-100  transition-all">
                  <p className={tokenPWD != '' ? "opacity-100 ease-in text-[2.7vw] lg:text-[1.2vw] delay-100 transition-all" : "opacity-0 ml-[3.7vw]  ease-out delay-100 transition-all"}>Email Sent Token</p>
                </div>
                <input
                   className="rounded-md lg:text-[1.2vw] text-[2.3vw] h-[4.5vw]  lg:h-[2vw] mt-[6vw] lg:mt-[2.5vw] w-[80%] lg:w-[20vw] pl-[1vw] py-[.2vw]  mb-[.4vw] bg-slate-100"
                  onChange={(e) => setTokenPWD(e.target.value)}
                  value={tokenPWD}
                  placeholder='Email Sent Token'
                  onBlur={() => setTokenPWDFocus(false)}
                  onFocus={() => setTokenPWDFocus(true)}
                  type={'input'}
                  name={'Token'} />
              </div>
              <button className={"rounded-md  py-[.2vw] px-[1vw] lg:h-[3vw] h-[6vw] w-[12vw] lg:text-[1.2vw]  lg:w-[5.4vw] text-[2.8vw] mb-[2vw] hover:bg-slate-300 bg-slate-100"} disabled={!pwd2Match || !pwd1Valid || !tokenPWD} type={'submit'}>Submit</button>

            </form>
          </div>
        )}
   
    </>
    </div>
  )
}


export default PasswordResetConfirm;