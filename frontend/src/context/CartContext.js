import { createContext,useState } from "react";

const CartContext = createContext({});


export const CartProvider = ({children}) => {

    const [cartTrigger, setcartTrigger ] = useState(0);


    return(
        <CartContext.Provider value={{cartTrigger,setcartTrigger}}>
            {children}
        </CartContext.Provider>
    )
}

export default CartContext;
