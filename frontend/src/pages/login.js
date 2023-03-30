import React, {useRef,useEffect,useState} from "react";
import useAuth from "../Hooks/useAuth";
import axios from "../api/axios";
import { Link,useLocation, useNavigate } from "react-router-dom";
import useLocalStorage from "../Hooks/useLocalStorage";

const Login = () => {
  const LOGIN_URL = 'http://localhost:8000/api/v1/dj-rest-auth/login/'


  //Storage condition
  
  //Context
  const {setAuth, persist,setPersist } = useAuth();
  //Ref
  const userRef = useRef();
  const errRef = useRef();
  //Backend
  const [ resp, changeResponse ] = useState(null);
  const [ errMsg ,setErrMsg] = useState('');
  const [ username, changeUsername ] =  useLocalStorage('user','');
  const [ password, changePassword ] =  useState('');
  const [verify , setVerify] = useState(false);

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
  }, [])
  //This one is more understandable, refreshes message when user is adjusting the list paras
  useEffect(() => {
      setErrMsg('');
      setVerify(false);
  },[username,password])

  const onSubmit = async (e) => {
     e.preventDefault();
     //This allows for the user to pick between logging in with an email or username without pressing a button
     let user_or_email;
     {username.includes('@') ? user_or_email = JSON.stringify({'email':username,password}) : user_or_email = JSON.stringify({username,password})}

     try {
        const response = await axios.post(LOGIN_URL,user_or_email,{
          headers :
          {
            'Content-Type': 'application/json'
          },
         withCredentials:true
        }
          
        
        );
        //Dont need to check error here since axios checks anyways
   
        const accessToken = response?.data.access_token;
        const refreshToken = response?.data.refresh_token;
        const roles = response?.data.user.roles;
        
        console.log(response);
        setAuth({username,password,accessToken,refreshToken,roles});
        
        
        changeResponse(response.data);
        changeUsername('');
        changePassword('');

        Navigate(from, {replace: true});


     } catch(err){
        //This is error checking
        if(!err.response){
          setErrMsg('No Server Response');
        } else if (err.response?.status === 400){

          //The backend library provides strong conditional error messages that is customizable using serializers
          let message = JSON.stringify(err.response.data.non_field_errors);
          //This is to add a JSX link to the appropriate message
          if (message.includes('verified')){ 
             setVerify(true);
          }
          const slicedMessage = message.slice(2,-3);
          setErrMsg(slicedMessage);
        } else if (err.response?.status === 401){
          setErrMsg('Unauthorized');
        } else {
          setErrMsg('')
        }
     }




  }

  const togglePersist = () =>{
    setPersist(prev => !prev);
  }
  useEffect(() =>{
    localStorage.setItem('persist', persist)}
    ,[persist])

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Login
        </h1>
        <div className={'help-text'}>
          Inspect the network requests in your browser to view headers returned by dj-rest-auth.
        </div>
        <div>

          {/*This is how you would make an error message for situations of your choice*/}
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
          {/**/}
          <div ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{verify ? <Link to='/email_verification'>Verify Your Email</Link> : ''}</div>
        </div>
        <div>
        <form onSubmit={onSubmit}>
          <div>
            <input
              onChange={(e) => changeUsername(e.target.value)}
              value={username}
              ref={userRef}
              type={'input'}
              name={'username'}/>
          </div>
          <div>
            <input
              onChange={(e) => changePassword(e.target.value)}

              value={password}
              type={'password'}
              name={'password'}/>
          </div>
          <div className='persistCheck'>
            <input type="checkbox" name="" id='persist' onChange={togglePersist} checked={persist} value=""/>
            <label htmlFor="persist">Stay Logged in?</label>
          </div>
          <button type={'submit'}>Submit</button>
        </form>
        <button onClick={PwdNavigate}>Forgot your password?</button>
        </div>
      </header>
    </div>
  );
}

  
export default Login;