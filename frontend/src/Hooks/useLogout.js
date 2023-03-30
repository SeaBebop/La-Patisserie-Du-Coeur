import axios from '../api/axios';
import useAuth from './useAuth';

const useLogout = () => {
    
    const {auth,setAuth} = useAuth();
    const LOGOUT_URL = 'http://localhost:8000/api/v1/dj-rest-auth/logout/';
    const logout = async () => {
        
        try{
        
            const response = await axios.post(LOGOUT_URL,JSON.stringify({'refresh':auth.refreshToken}),
            {
                headers :
                {
                  'Content-Type': 'application/json',
                 
                },          withCredentials: true              
     
              }
            )
            setAuth({});
        }
        catch(err){
            console.log(err);
        }
    
    }
    return logout;
}
export default useLogout