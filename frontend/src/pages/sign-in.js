import { useRef, useState, useEffect, Link } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import useCartChecker from '../Hooks/useCartChecker';


const USER_REGREX = /^[a-zA-Z][a-zA-Z0-9_]{3,24}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%)]).{7,24}$/;
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const SIGNIN_URL = 'http://127.0.0.1:8000/api/v1/dj-rest-auth/registration/';
const TRANSFER_URL = "http://127.0.0.1:8000/api/v1/customer/transfer-data/";



const SignUp = () => {
    const navigate = useNavigate();

    const redirctToVerify = async () => {
        navigate('/email_verification');
    }

    const { cartTrigger, setcartTrigger } = useCartChecker();

    const userRef = useRef();
    const errRef = useRef();

    const [username, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [password1, setPWD] = useState('');
    const [validPWD, setValidPWD] = useState(false);
    const [pwdFocus, setPWDFocus] = useState(false);

    const [password2, setMatchPWD] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    //Focus when components loads
    useEffect(() => {
        userRef.current.focus();
        setcartTrigger(0);
    }, [])

    //validation checker for username
    useEffect(() => {
        const result = USER_REGREX.test(username);
        setValidName(result);
    }, [username])
    //validation checker for email
    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        setValidEmail(result);
    }, [email])
    //Validation checker for the pwd + matching the password
    useEffect(() => {
        const result = PWD_REGEX.test(password1);
        setValidPWD(result);
        const match = password1 === password2;
        setValidMatch(match);
    }, [password1, password2])

    //Clears errMsg when the username reads and interacts with the form
    useEffect(() => {
        setErrMsg('');
    }, [username, password1, email, password2])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // If button enabled with JS hack
        const v1 = USER_REGREX.test(username);
        const v2 = PWD_REGEX.test(password1);
        if (!v1 || !v2) {
            setErrMsg('Invalid Entry');
            return;
        }

        try {
            const response = await axios.post(SIGNIN_URL, JSON.stringify({ username, email, password1, password2 }), {
                headers:
                {
                    'Content-Type': 'application/json',

                },
                withCredentials: true
            }

            );

            //const data = JSON.parse(response.config.data);
            //const email = data['email']
            //console.log()

            //clear input fields


            setSuccess(true);
        } catch (err) {
            if (!err.response) {
                setErrMsg('No server response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username taken');
            } else {
                let message = JSON.stringify(err.response.data.email);
                const slicedMessage = message.slice(2, -3);
                setErrMsg(slicedMessage);
            }
            errRef.current.focus();
        }
        try {
            const responseTransfer = await axios.post(TRANSFER_URL, JSON.stringify({ 'user': email }), {
                headers:
                {
                    'Content-Type': 'application/json',

                },
                withCredentials: true

            });
        } catch (err) { }
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
        <div className='h-screen absolute w-screen'>


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
                        <div className='flex'>


                            <div className='mt-[12vw] h-[32vw]  flex flex-row justify-center ml-[37vw] w-[28vw] bg-[#ee5042e5] rounded-md shadow-lg'>
                                <div className='flex flex-col justify-center items-center'>

                                    <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live='assertive'>{errMsg}</p>

                                    <h1 className=' font-body  text-[2vw] mb-[3vw] text-white'>REGISTER</h1>
                                    <form className='' onSubmit={handleSubmit}>
                                    
                                            <div className="absolute ml-[3.7vw] mt-[-1.71vw] delay-100  transition-all">
                                                <p className={email != '' ? "opacity-100 ease-in text-[1.2vw] delay-100 transition-all" : "opacity-0 ml-[3.7vw]  ease-out delay-100 transition-all"}>Email</p>
                                            </div>
                                            <input
                                                className='rounded-sm text-[1.25vw] pl-[1vw] w-[20vw] h-[2.4vw] mt-[.6vw]'
                                                type="email"
                                                id='email'
                                                placeholder='Email'
                                                autoComplete='off'
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                aria-invalid={validEmail ? 'false' : 'true'}
                                                aria-describedby='eidnote'
                                                onFocus={() => setEmailFocus(true)}
                                                onBlur={() => setEmailFocus(false)}
                                            />
                                        <p id='uidnote' className={email && !validEmail ? "instructions absolute ml-[3.7vw] mt-[.2vw] text-white text-[.9vw]" : "offscreen abolute "}>*Required @ and .com. No other symbols can be used<br />
                                        </p>
                                        

                                        <div className="absolute mt-[1.2vw]  delay-100  transition-all">
                                            <p className={username != '' ? "opacity-100 ml-[3.7vw]  ease-in text-[1.2vw] delay-100 transition-all" : "opacity-0 ml-[3.7vw]  ease-out delay-100 transition-all"}>Username</p>
                                        </div>
                                        <input
                                            className='rounded-sm w-[20vw] text-[1.25vw] pl-[1vw] h-[2.4vw]  mt-[3.1vw]'
                                            type="text"
                                            id='username'
                                            placeholder='Username'
                                            autoComplete='off'
                                            ref={userRef}
                                            onChange={(e) => setUser(e.target.value)}
                                            required
                                            aria-invalid={validName ? "false" : "true"}
                                            aria-describedby='uidnote'
                                            onFocus={() => setUserFocus(true)}
                                            onBlur={() => setUserFocus(false)}
                                        />
                                        <p id='uidnote' className={username && !validName ? "instructions absolute ml-[3.7vw] mt-[.2vw] text-white text-[.9vw]" : "offscreen abolute "}>
                                            *4-25char limit.
                                            Must begin with a letter
                                        </p> 
                                        <br />

                                        <div className="absolute mt-[1.2vw]  delay-100   transition-all">
                                            <p className={password1 != '' ? "opacity-100 ml-[3.7vw]  ease-in text-[1.2vw] delay-100 transition-all" : "opacity-0 ml-[3.7vw]  ease-out delay-100 transition-all"}>Password</p>
                                        </div>
                                        <input
                                            type="password"
                                            id='password1'
                                            placeholder='Password'
                                            className='rounded-sm w-[20vw] text-[1.25vw] pl-[1vw] h-[2.4vw]  mt-[3.1vw]'
                                            onChange={(e) => setPWD(e.target.value)}
                                            required
                                            aria-invalid={validPWD ? 'false' : 'true'}
                                            aria-describedby='PWDnote'
                                            onFocus={() => setPWDFocus(true)}
                                            onBlur={() => setPWDFocus(false)} />
                                       
                                        <p id='PWDnote' className={password1 && !validPWD ?  "instructions absolute ml-[3.7vw] mt-[.2vw] text-white text-[.9vw]" : "offscreen abolute "}>
                                            *One lower and uppercase letter, a number, and a symbol

                                        </p>
                                        <br />
                                        <div className="absolute  delay-100 mt-[1.2vw] transition-all">
                                            <p className={password2 != '' ? "ml-[3.7vw]  opacity-100 ease-in text-[1.2vw]  delay-100 transition-all" : "opacity-0 ml-[3.7vw]  ease-out delay-100 transition-all"}>Confirm Password</p>
                                        </div>
                                        <input
                                            type="password"
                                            id='password2'
                                            placeholder='Confirm Password'
                                            className='rounded-sm w-[20vw] text-[1.25vw] pl-[1vw] h-[2.4vw]  mt-[3.1vw]'
                                            onChange={(e) => setMatchPWD(e.target.value)}
                                            required
                                            aria-invalid={validMatch ? 'false' : 'true'}
                                            aria-describedby='matchnote'
                                            onFocus={() => setMatchFocus(true)}
                                            onBlur={() => setMatchFocus(false)} />
                                    
                                        <p id='matchnote' className={password2 && !validMatch ?  "instructions absolute ml-[3.7vw] mt-[.2vw] text-white text-[.9vw]" : "offscreen abolute "}>

                                            *Must match the first password

                                        </p> 
                                        <br />
                                        <button className=" h-[3vw] text-[1.25vw]   w-[5vw] mt-[1.6vw] rounded bg-white" disabled={!validMatch || !validName || !validPWD ? true : false}>Sign Up</button>
                                    </form>

                                    <p>{/*put a router link for log in*/}</p>

                                </div>
                            </div>
                        </div>

                    )}
            </></div>
    )



}

export default SignUp