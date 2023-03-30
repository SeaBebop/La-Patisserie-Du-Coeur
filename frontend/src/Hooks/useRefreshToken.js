import axios from '../api/axios';
import useAuth from './useAuth';


const useRefreshToken = () =>
{
    const {auth,setAuth} = useAuth();
    const REFRESH_URL = 'http://localhost:8000/api/v1/dj-rest-auth/token/refresh/';
    const USER_URL = 'http://localhost:8000/api/v1/dj-rest-auth/user/';
    
    const refresh = async () =>
    {   //Process of refreshing the accesstoken with the refresh token
        console.log('This is a access token: ' + JSON.stringify(auth.accessToken))
        console.log('This is xD city' + JSON.stringify(auth.refreshToken))


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




           const user_response = await axios.get(USER_URL,{
            headers :
            {
              'Content-Type': 'application/json',
              'Authorization': `JWT ${response.data.access}`, 
            },
            withCredentials:true
          }
        
       );            
          
       console.log('This is the refresh token xD' + JSON.stringify(response.data.refresh))
       setAuth( prev => {
             
 
     
        console.log('This is the refresh token xD' + JSON.stringify(response.data.refresh))
        return { ...prev, accessToken: response.data.access,refreshToken:response.data.refresh,roles:user_response.data.roles}
    }); 

        
    }
    return refresh;
}

export default useRefreshToken;