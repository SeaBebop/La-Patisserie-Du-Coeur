

import { useEffect, useRef, useState } from "react"
const CheckoutFalse = () => {

    return (
        <div className='h-screen w-screen flex  items-center justify-center'>
            <div className="flex absolute    text-[#4d3526] font-body uppercase text-[1.5vw] bg-[#ff6e61a9]  justify-around h-auto w-[60vw] py-[3vw] before:border-t before:absolute before:w-[65%] before:mt-[-.3vw]">
                <p><div className='text-black'>
                    Purchase failed!
                    </div>! No purchases or payment has been made.<br/>If any issues, contact our number +1 (555) 123-4567</p>
           
            </div>
        </div>

    )
};

export default CheckoutFalse;