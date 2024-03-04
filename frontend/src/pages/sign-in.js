import { useRef, useState, useEffect, Link } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import useCartChecker from '../Hooks/useCartChecker';


const USER_REGREX = /^[a-zA-Z][a-zA-Z0-9_]{3,24}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%)]).{7,24}$/;
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const SIGNIN_URL = '/api/v1/dj-rest-auth/registration/';
const TRANSFER_URL = "/api/v1/customer/transfer-data/";




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
                setErrMsg('UserName is taken');
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
        <div className='lg:h-[70vw] md:h-[95vh] h-[100vh]   min-h-[800px] flex justify-center  w-screen'>


            <>
                {success ?
                    (
                        <div className='lg:mt-[15vw] '>
                            <h1>Email Verification Sent!</h1>
                            <p>{/*Email confirmation*/}
                                The server has sent an email with a verification code.  In order to login to this website you must copy the email's verification and verify the code the link down below.
                            </p>
                            <button onClick={redirctToVerify}>Verify Email</button>
                        </div>
                    ) : (
                        <div className='flex justify-center w-[85vw] overflow-x-hidden overflow-y-hidden '>


                            <div className=' lg:h-[35vw] md:h-[75vw] h-[100vw]  mt-[12vh] md:mt-[12vh] lg:mt-[12vw]  flex  justify-center w-[100%] lg:w-[28vw] bg-[#ee5042e5] rounded-md shadow-lg'>
   
                                    <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live='assertive'>{errMsg}</p>

                                    
                                    <form className='flex-col w-[70%] lg:gap-[2.7vw] mt-[2vw] gap-[10vw] flex' onSubmit={handleSubmit}>
                                    <h1 className=' font-body  lg:text-[2vw] text-[4.5vw] text-white'>REGISTER</h1>
                                        <div>


                                            <div className="absolute lg:ml-[1vw] ml-[3vw] sm:mt-[-4vw] mt-[-3.7vw] lg:mt-[-1.71vw] delay-100  transition-all">
                                                <p className={email != '' ? "opacity-100 ease-in text-[3vw] lg:text-[1.2vw] delay-100 transition-all" : "hidden ml-[3.7vw]  ease-out delay-100 transition-all"}>Email</p>
                                            </div>
                                            <input
                                                className="rounded-md pl-[1vw] py-[.2vw] w-[100%] h-[4vw] lg:h-[2vw] text-[3vw] lg:text-[1.3vw]   bg-slate-100"
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
                                            <p id='uidnote' className={email && !validEmail ? "instructions absolute ml-[-5.4vw] lg:ml-[-1vw] lg:mt-[.1vw] mt-[-.5vw] text-white text-[2.5vw] lg:text-[.9vw]" : "offscreen abolute "}>*Required @ and .com. Use no other symbols<br />
                                            </p>
                                        </div>
                                        <div>


                                            <div className="absolute ml-[2.2vw] lg:ml-[1vw] lg:mt-[-1.6vw] sm:mt-[-4vw]  mt-[-3.5vw]   delay-100  transition-all">
                                                <p className={username != '' ? "opacity-100  ease-in text-[3vw] lg:text-[1.2vw] delay-100 transition-all" : "hidden ml-[3.7vw]  ease-out delay-100 transition-all"}>Username</p>
                                            </div>
                                            <input
                                                className="rounded-md pl-[1vw] py-[.2vw] w-[100%] h-[5vw] lg:h-[2vw] text-[3vw] lg:text-[1.3vw]   bg-slate-100" type="text"
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
                                            <p id='uidnote' className={username && !validName ? "instructions absolute ml-[-3vw] lg:ml-[-1vw] lg:mt-[.1vw] mt-[-.5vw] text-[2.7vw] text-white lg:text-[.9vw]" : "offscreen abolute "}>
                                                *4-25char limit.
                                                Must begin with a letter
                                            </p>

                                        </div>
                                        <div>


                                            <div className="absolute sm:mt-[-4vw] lg:mt-[-1.7vw]  mt-[-3.7vw]  delay-100   transition-all">
                                                <p className={password1 != '' ? "opacity-100 ml-[3vw] lg:ml-[1vw]  ease-in text-[3vw] lg:text-[1.2vw] delay-100 transition-all" : "hidden ml-[3.7vw]  ease-out delay-100 transition-all"}>Password</p>
                                            </div>
                                            <input
                                                type="password"
                                                id='password1'
                                                placeholder='Password'
                                                className="rounded-md pl-[1vw] py-[.2vw] w-[100%] h-[5vw] lg:h-[2vw] text-[3vw] lg:text-[1.3vw]   bg-slate-100" onChange={(e) => setPWD(e.target.value)}
                                                required
                                                aria-invalid={validPWD ? 'false' : 'true'}
                                                aria-describedby='PWDnote'
                                                onFocus={() => setPWDFocus(true)}
                                                onBlur={() => setPWDFocus(false)} />

                                            <p id='PWDnote' className={password1 && !validPWD ? "instructions absolute ml-[-10vw] mt-[-vw] lg:ml-[-3vw] text-white text-[2.7vw] lg:text-[.9vw]" : "offscreen abolute "}>
                                                *One lower and uppercase letter, number, and symbol

                                            </p>
                                        </div>
                                        <div>


                                            <div className="absolute  delay-100 sm:mt-[-4vw]  mt-[-3.6vw] lg:mt-[-1.67vw] transition-all">
                                                <p className={password2 != '' ? "ml-[3.7vw] lg:ml-[1vw]  opacity-100 ease-in text-[3vw]  lg:text-[1.2vw]  delay-100 transition-all" : "hidden ml-[3.7vw]  ease-out delay-100 transition-all"}>Confirm Password</p>
                                            </div>
                                            <input
                                                type="password"
                                                id='password2'
                                                placeholder='Confirm Password'
                                                className="rounded-md pl-[1vw] py-[.2vw] w-[100%] h-[5vw] lg:h-[2vw] text-[3vw] lg:text-[1.3vw]  bg-slate-100" onChange={(e) => setMatchPWD(e.target.value)}
                                                required
                                                aria-invalid={validMatch ? 'false' : 'true'}
                                                aria-describedby='matchnote'
                                                onFocus={() => setMatchFocus(true)}
                                                onBlur={() => setMatchFocus(false)} />

                                            <p id='matchnote' className={password2 && !validMatch ? "instructions absolute text-[2.7vw] mt-[.2vw] text-white lg:text-[.9vw]" : "offscreen abolute "}>

                                                *Must match the first password

                                            </p>
                                        </div>
                                        <button className="h-[6vw] lg:h-[3vw] w-[40%] mt-[1vw] rounded text-[3vw] lg:text-[1.2vw] bg-white" disabled={!validMatch || !validName || !validPWD ? true : false}>Sign Up</button>
                                    </form>

                                    <p>{/*put a router link for log in*/}</p>

                               
                            </div>
                        </div>

                    )}
            </></div>
    )



}

export default SignUp