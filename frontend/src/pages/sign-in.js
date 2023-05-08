import { useRef, useState, useEffect,Link} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';


const USER_REGREX = /^[a-zA-Z][a-zA-Z0-9_]{3,24}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%)]).{7,24}$/;
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const SIGNIN_URL = 'http://localhost:8000/api/v1/dj-rest-auth/registration/';




const SignUp = () => {
    const navigate = useNavigate();

    const redirctToVerify = async () => {
        navigate('/email_verification');
    }
    const userRef = useRef();
    const errRef = useRef();

    const [username,setUser ] = useState('');
    const [validName,setValidName] = useState(false);
    const [userFocus,setUserFocus] = useState(false);

    const [email,setEmail] = useState('');
    const [validEmail,setValidEmail] = useState(false);
    const [emailFocus,setEmailFocus] = useState(false);

    const [password1,setPWD ] = useState('');
    const [validPWD,setValidPWD] = useState(false);
    const [pwdFocus,setPWDFocus] = useState(false);

    const [password2,setMatchPWD ] = useState('');
    const [validMatch,setValidMatch] = useState(false);
    const [matchFocus,setMatchFocus] = useState(false);

    const [errMsg,setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    //Focus when components loads
    useEffect(() => {
        userRef.current.focus();
    }, [])

    //validation checker for username
    useEffect(() =>{
        const result = USER_REGREX.test(username);
        console.log(result);
        console.log(username);
        setValidName(result);
    }, [username])
    //validation checker for email
    useEffect(() =>{
        const result = EMAIL_REGEX.test(email);
        console.log(result);
        console.log(email);
        setValidEmail(result);
    }, [email])
    //Validation checker for the pwd + matching the password
    useEffect(() =>{
     const result = PWD_REGEX.test(password1);
     console.log(result);
     console.log(password1);
     setValidPWD(result);
     const match = password1 === password2;
     setValidMatch(match);
    },[password1,password2])

    //Clears errMsg when the username reads and interacts with the form
    useEffect(() =>{
     setErrMsg('');   
    },[username,password1,email,password2])

    const handleSubmit = async (e) =>{
        e.preventDefault();
        // If button enabled with JS hack
        const v1 = USER_REGREX.test(username);
        const v2 = PWD_REGEX.test(password1);      
        if(!v1 || !v2)
        {
            setErrMsg('Invalid Entry');
            return;
        }
        try {
            const response = await axios.post(SIGNIN_URL,JSON.stringify({username,email,password1,password2}),{
            headers :
            {
              'Content-Type': 'application/json',
             
            },
            'Accept': 'application/json',
          }
          
            );
            console.log(response.data);
            console.log(JSON.stringify(response));
            setSuccess(true);
            //clear input fields

        } catch (err) {
            if(!err.response){
                setErrMsg('No server response');
            } else if (err.response?.status === 409){
                setErrMsg('Username taken');
            } else {
                let message = JSON.stringify(err.response.data.email);
                const slicedMessage = message.slice(2,-3);
                setErrMsg(slicedMessage);
            }
            errRef.current.focus();
        }

    }

    /*
    under the label for username, this gives an interactive visual response to 
    if the username was correct or not
   
    <label htmlFor='username'>
        Username:
        <span className{validName ? 'valid' : 'hide'}>
            <FontAwesomeIcon icon={faCheck}/>
        </span>
        <span className{validName || !username ? 'hide' : 'invalid'}>
            <FontAwesomeIcon icon={faTimes}/>
        </span>
    </label>
    */
    return (
        <> 
        {success ? 
        (
            <div>
                <h1>Email Verification Sent!</h1>
                <p>{/*Email confirmation*/}
                The server has sent an email with a verification code.  In order to login to this website you must copy the email's verification and verify the code the link down below.
                </p>
                <button onClick={redirctToVerify}>Verify Email</button>
            </div>
        ) : ( 
    <div className='mt-[12vw] h-[32vw]  flex flex-row justify-center ml-[37vw] w-[28vw] bg-[#1a58ab] rounded-md shadow-lg'>
        <div>
            
        
        <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live='assertive'>{errMsg}</p>

        <h1 className='mt-[3vw] font-body  text-[2vw] text-white'>REGISTER</h1>
        <form className='mt-[3vw]' onSubmit={handleSubmit}>
        <label  className='text-white' htmlFor='email'>
                Email:
        
            </label>
            <input 
            className='rounded-sm mt-[.6vw]'
            type="email" 
            id='email'
            autoComplete='off'
            onChange={(e)=> setEmail(e.target.value)}
            required
            aria-invalid={validEmail ? 'false' : 'true'}
            aria-describedby='eidnote'
            onFocus={()=> setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)}
            />
        <p id='uidnote' className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
        Must have a @ symbol<br/>
        Every special character that is not @ can't be used<br/>
        </p><br/>
            <label className='text-white'  htmlFor='username'>
                Username:
        
            </label>
            <input 
            className='rounded-sm mt-[.6vw]'
            type="text"
            id='username'
            autoComplete='off'
            ref={userRef}
            onChange={(e)=> setUser(e.target.value)}
            required
            aria-invalid={validName ? "false" : "true"}
            aria-describedby='uidnote'
            onFocus={() => setUserFocus(true)}
            onBlur={() => setUserFocus(false)}
            />
        <p id='uidnote' className={userFocus && username && !validName ? "instructions" : "offscreen"}>
        4 to 25 characters <br/>
        Must begin with a letter<br/>
        Leters,numbers,underscores,hypens allowed.
        </p>
        <br/>
        <label className='text-white' htmlFor='password'>
                Password:
        
            </label>
            <input 
            type="password"
            id='password1'
className='rounded-sm mt-[.6vw]'
            onChange={(e)=> setPWD(e.target.value)}
            required
            aria-invalid={validPWD ? 'false' : 'true'}
            aria-describedby='PWDnote'
            onFocus={() => setPWDFocus(true)}
            onBlur={() => setPWDFocus(false)}/>

        <p id='PWDnote' className={pwdFocus && password1 && !validPWD ? "instructions" : "offscreen"}>
        7 to 25 characters <br/>
        Must contain one lowercase and uppercase letter, a number, and a special character<br/>
       
        </p>
        <br/>
        <label className='text-white' htmlFor='password2'>
                Confirm Password:
        
            </label>
            <input 
            type="password"
            id='password2'
className='rounded-sm mt-[.6vw]'
            onChange={(e)=> setMatchPWD(e.target.value)}
            required
            aria-invalid={validMatch ? 'false' : 'true'}
            aria-describedby='matchnote'
            onFocus={() => setMatchFocus(true)}
            onBlur={() => setMatchFocus(false)}/>

        <p id='matchnote' className={matchFocus && password2 && !validMatch ? "instructions" : "offscreen"}>

        Must match the first <br/>
       
        </p>
        <br/>
        <button className="px-[3vw] py-[.35vw] mt-[1vw] rounded bg-white"  disabled={!validMatch || !validName || !validPWD ? true : false }>Sign Up</button>
        </form>

        <p>{/*put a router link for log in*/}</p>

    </div>
    </div>
        )}
        </>
    )
    


}

export default SignUp