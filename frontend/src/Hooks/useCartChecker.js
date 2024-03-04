import { useContext } from "react";
import CartContext from "../context/CartContext";

const useCartChecker = () =>{

    return useContext(CartContext);
}

export default useCartChecker;

