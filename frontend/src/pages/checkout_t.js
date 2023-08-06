import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useRefreshToken from '../Hooks/useRefreshToken';
import useAuth from '../Hooks/useAuth';
import SVG_Food from '../components/SVG_Food';

const CheckoutTrue = () => {
    const refresh = useRefreshToken()
    const [isLoading, setIsLoading] = useState(true);
    const { auth, persist } = useAuth();


    return (

             
          
        <div className='h-screen w-screen flex  items-center justify-center'>
                <div className="flex absolute    text-[#4d3526] font-body uppercase text-[1.5vw] bg-[#ff6e61a9]  justify-around h-auto w-[60vw] py-[3vw] before:border-t before:absolute before:w-[65%] before:mt-[-.3vw]">
                    <p> <div className='text-black'>
                    Purchase success!
                    </div> Check your email for details of your purchase<br/>Any purchase is documented on the purchase history page</p>
               
                </div>
            </div>
        

    )
};
export default CheckoutTrue;