import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useRefreshToken from '../Hooks/useRefreshToken';
import useAuth from '../Hooks/useAuth';
import SVG_Food from '../components/SVG_Food';

const CheckoutTrue = () => {
    const refresh = useRefreshToken()
    const [isLoading, setIsLoading] = useState(true);
    const { auth, persist } = useAuth();


    useEffect(() => {

        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
        const verifyRefreshToken = async () => {
            let isMounted = true;
            await sleep(50)
            try {
                await refresh();

            }
            catch (err) {
                console.error(err);
            }
            finally {
                isMounted && setIsLoading(false);
            }
        }

        !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false)

    }, [])

    return (
        <div className=' absolute'>
             
        {!persist
        ? <div>
            
        </div>
            :
                isLoading
                ? 
                <span class="absolute shadow-sm mt-[20vw] mr-[10.1vw] gap-[.2vw] flex-col">
                <i className=" mt-[.1vw] animate-pulse mr-[2.1vw]"><SVG_Food /></i> 
                <div className='animate-pulse'><p className='mt-[-3vw] text-[3vw]'>. . .</p> </div>
                </span>

                : <div>
                    
                </div>
        }
        </div>
    )
};
export default CheckoutTrue;