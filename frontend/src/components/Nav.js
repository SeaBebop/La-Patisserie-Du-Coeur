import React, {useContext} from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext.js";
import useLogout from "../Hooks/useLogout.js";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  let {auth} = useContext(AuthContext)
  const navigate = useNavigate();
  const logout = useLogout();

  const signOut = async () =>{
    await logout();
    navigate('/');
  }

  return (
  <div className="Nav">
  <Link to="/" >Home</Link>

  <Link to="/products" >Products</Link>
  
  {auth.accessToken ? (
    <div>
    <button onClick={signOut}>Log Out</button>
    <Link to='/User_list'>Users</Link>      
    </div>
  )
  :
  <div>
  <Link to="/sign-in" >SignUp</Link>
  <Link to="/login" >Login</Link>

  </div>

  }
 
  {/* testing if context works, it works !
  {auth.accessToken && <p>hello {auth.username}</p>} */
  }
  </div>
  )
}

  
export default Navbar;