import { Outlet } from 'react-router-dom';
import {useState, useEffect} from 'react';
import useRefreshToken from '../Hooks/useRefreshToken';
import useAuth from '../Hooks/useAuth';
import SVG_Food from './SVG_Food';

//For every page under Pesist login in the app.js page
//This function will trigger and check if the user has a 
//Token to stay logged in, if not then "user" continue the website
//As if it they are anonymous 

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    
    const { auth,persist } = useAuth();
    console.log('This is the refresh token xD' + JSON.stringify(auth.refreshToken));
    
    useEffect(() =>{
        //Added delay so the loading pulse doesn't look jarring 
        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
        
        let isMounted = true;
        
        const verifyRefreshToken = async () => {
            await sleep(50)
            try {
                await refresh();
             
            }
            catch(err){
                console.error(err);
            }
            finally{
                isMounted && setIsLoading(false);
            }
        }
       
        !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);

        return () => isMounted = false;
    },[])

    useEffect(() =>{
        console.log(`isLoading: ${isLoading}`)
        console.log(`aT: ${JSON.stringify(auth?.accessToken)}`)
    }, [isLoading])
    return(
        <>
        {!persist
        ? <Outlet/> 
            :
                isLoading
                ? 
                <span class="absolute shadow-sm mt-[20vw] mr-[10.1vw] gap-[.2vw] flex-col">
                <i className=" mt-[.1vw] animate-pulse mr-[2.1vw]"><SVG_Food /></i> 
                <div className='animate-pulse'><p className='mt-[-3vw] text-[3vw]'>. . .</p> </div>
                </span>

                : <Outlet/>
        }
        </>
    )
}

export default PersistLogin