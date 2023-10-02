import axios from '../api/axios';
import useAuth from './useAuth';
import useLogout from "../Hooks/useLogout.js";
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode'

const useRefreshToken = () =>
{
    const {auth,setAuth} = useAuth();
    const REFRESH_URL = 'https://lacoeurbakery-com.onrender.com/api/v1/dj-rest-auth/token/refresh/';
    const USER_URL = 'https://lacoeurbakery-com.onrender.com/api/v1/dj-rest-auth/user/';
    const navigate = useNavigate();
    const logout = useLogout(); 


     
    const refresh = async () =>
    {   //Process of refreshing the accesstoken with the refresh token

        try{
            const response = await axios.post(REFRESH_URL,JSON.stringify({'{}':''}), {
                headers :
                {
                  'Content-Type': 'application/json',
                
                }
                ,withCredentials:true
               
              }
           );
           //This get was created to overcome the issue of the refreshToken not giving 
           //any data for 'roles', this prevented my privateRouters from working
           /*
           
           const user_response = await axios.get(USER_URL,{
            headers :
            {
              'Content-Type': 'application/json',
              'Authorization': `JWT ${response.data.access}`, 
            },
            withCredentials:true
          }
        
       );  
           */

          //Above is replaced with the access token being decoded
           const decoded = response.data.access !== undefined ?
           jwt_decode(response.data.access).roles : undefined
 
        
         
       setAuth( prev => {
             
        return { ...prev, accessToken: response.data.access,refreshToken:response.data.refresh,roles:decoded}
    })
    
  } catch(err){
    
    //Added for the following issue:
    //When the user logs in with "Stay logged in" as false
    //When the user reloads the user log in doesnt persist which is good

    //However if the user selects true after that reload and reloads 
    //The persist user logs in w/o a password because the access + refresh token cookie still exists
    //This logout is to ensure that on reload the persistence function doesn't activate
    await logout();
  }; 

        
    }
    return refresh;
}

export default useRefreshToken;