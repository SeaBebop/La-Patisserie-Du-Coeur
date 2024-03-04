import React, { useRef, useEffect, useState } from "react";
import useAuth from "../Hooks/useAuth";
import axios from "../api/axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useLocalStorage from "../Hooks/useLocalStorage";
import useCartChecker from "../Hooks/useCartChecker";
import MessageExampleMessage from "../components/Prompt";

const Login = () => {
  const LOGIN_URL = '/api/v1/dj-rest-auth/login/'


  //Storage condition

  //Context
  const { setAuth, persist, setPersist } = useAuth();
  //Ref
  const userRef = useRef();
  const errRef = useRef();
  const pwdRef = useRef();
  const { cartTrigger, setcartTrigger } = useCartChecker();
  //Backend
  const [resp, changeResponse] = useState(null);
  const [errMsg, setErrMsg] = useState('');
  const [username, changeUsername] = useLocalStorage('user', '');
  const [verify, setVerify] = useState(false);

  //Redirect
  const Navigate = useNavigate();
  //Redirect that sends them to where they wanted to goto
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  function PwdNavigate() {
    Navigate('/password_reset');
  }
  //Focus content if first time??
  useEffect(() => {
    userRef.current.focus();
    setcartTrigger(1);
  }, [])
  //This one is more understandable, refreshes message when user is adjusting the list paras
  useEffect(() => {
    setErrMsg('');
    setVerify(false);
  }, [username, pwdRef])

  const onSubmit = async (e) => {
    e.preventDefault();
    //This allows for the user to pick between logging in with an email or username without pressing a button
    let user_or_email;

    { username.includes('@') ? user_or_email = JSON.stringify({ 'email': username, 'password': e.target[1].value }) : user_or_email = JSON.stringify({ username, 'password': e.target[1].value }) }

    try {
      const response = await axios.post(LOGIN_URL, user_or_email, {
        headers:
        {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }


      );
      //Dont need to check error here since axios checks anyways

      const accessToken = response?.data.access_token;
      const refreshToken = response?.data.refresh_token;
      const roles = response?.data.user.roles;
      const userID = response?.data.user.pk;

      setAuth({ accessToken, refreshToken, roles, userID });


      changeResponse(response.data);
      changeUsername('');

      Navigate(from, { replace: true });


    } catch (err) {
      //This is error checking
      if (!err.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {

        //The backend library provides strong conditional error messages that is customizable using serializers
        let message = JSON.stringify(err.response.data.non_field_errors);
        //This is to add a JSX link to the appropriate message
        if (message.includes('verified')) {
          setVerify(true);
        } else {
          //const slicedMessage = message.slice(2, -3);Unused since it is way to long even with the slice
          setErrMsg('Incorrect Username/email or Password');

        }

      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('')
      }
    }


  }

  const togglePersist = () => {
    setPersist(prev => !prev);
  }
  useEffect(() => {
    localStorage.setItem('persist', persist)
  }
    , [persist])

  return (

    <div className=" w-[100vw] lg:h-[60vw] min-h-[807px] h-[100vh] flex justify-center items-center overflow-y-hidden ">

      <div className=" lg:h-[32vw] h-[100vw] md:h-[75vw] overflow-y-hidden flex flex-col justify-center mt-[4vw] lg:mt-[1vw] w-[65vw] lg:w-[28vw] bg-[#ee5042e5] rounded-md shadow-lg">
        <div className=" h-[40%] ">
          <div className=" font-body  text-[2vw]">
            <h1 className="font-Fancy text-[8.5vw] md:text-[7vw] lg:text-[3.5vw] text-orange-200">L</h1>
          </div>
          <div className={"lg:mt-[-.4vw] mt-[2vw] mb-[-4vw] lg:mb-[2vw] text-[3.75vw] md:text-[3vw] lg:text-[.9vw] text-white"}>
            <i>Savor the deliciousness with us</i>
            <div className="flex justify-center items-center">

              {/*This is how you would make an error message for situations of your choice*/}
              <p ref={errRef} className={errMsg ? " text-black flex" : "hidden"} aria-live="assertive">{errMsg}</p>
              {/*Test later*/}
              <div className="absolute z-50">{verify ? <MessageExampleMessage className={"absolute w-[50%] z-50"} message={<Link className="font-semibold" to='/email_verification'>Verify Your Email</Link>} error={false} title={"To login you need to Verify!"} /> : ''}</div>
            </div>
          </div>

        </div>



        <div>
          <form onSubmit={onSubmit}>
            <div className="flex items-center flex-col">
              <div className=" mt-[-1.71vw] delay-100  transition-all">
                <p className={"opacity-100 ease-in text-[3.6vw] md:text-[3vw] lg:text-[1.2vw]  delay-100 transition-all"}>UserID/Email</p>
              </div>
              <input
                className="rounded-md pl-[1vw] py-[.2vw] w-[80%] h-[6vw] md:h-[4vw] lg:h-[2vw] text-[3.4vw] md:text-[3vw] lg:text-[1.3vw]  mb-[.4vw] bg-slate-100"
                onChange={(e) => changeUsername(e.target.value)}
                value={username}
                placeholder={"UserID/Email"}
                ref={userRef}
                type={'input'}
                name={'username'} />
            </div>

            <div className="flex items-center flex-col mt-[1.3vw]">

              <p className={"opacity-100 ease-in text-[3.6vw] md:text-[3vw] lg:text-[1.2vw]  delay-100 transition-all"}>Password</p>

              <input
                ref={pwdRef}
                onChange={()=> setErrMsg('')}
                className="rounded-md pl-[1vw] py-[.2vw] w-[80%] h-[6vw] md:h-[4vw] lg:h-[2vw] text-[3vw] lg:text-[1.3vw]  mb-[.4vw] bg-slate-100"
                type={'password'}
                name={'password'} />

            </div>

            <div className='persistCheck my-[2vw]'>
              <input type="checkbox" name="" id='persist' onChange={togglePersist} checked={persist} value="" />
              <label htmlFor="persist" className="text-[3vw] lg:text-[1.2vw] text-white"> Stay Logged in?</label>
            </div>
            <button className="h-[14%] w-[40%] mt-[2vw] md:mt-[1vw] rounded text-[3vw] lg:text-[1.2vw] bg-white" type={'submit'}>Log In</button>
          </form>
          <button className="text-black  text-[3vw] md:mt-[1vw] mt-[3vw] lg:text-[1.2vw] underline" onClick={PwdNavigate}>Forgot your password?</button>
        </div>

      </div>

    </div>
  );
}


export default Login;