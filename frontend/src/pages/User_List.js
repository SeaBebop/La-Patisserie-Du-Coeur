import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../Hooks/useAxiosPrivate';
import useRefreshToken from '../Hooks/useRefreshToken.js'
import {useNavigate,useLocation} from 'react-router-dom';
import useAuth from '../Hooks/useAuth';


const User_List = () => {
  const USER_URL = '/api/v1/users/';
  const TOKEN_URL = '/api/v1/dj-rest-auth/token/verify/';

  const [users, setUsers] = useState();
  const refresh = useRefreshToken();  
  const axiosPrivate = useAxiosPrivate();
  const [success, setSuccess] = useState(true);
  const {auth} = useAuth();
  const token = auth.accessToken;
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    let isMounted = true;
    

    const controller = new AbortController();
    const getTokenVerification = async () => {
      try {
        const tokenResponse = await axiosPrivate.post(TOKEN_URL,JSON.stringify({'token':token}),{

          headers :
          {
            'Content-Type': 'application/json',
           
          },          withCredentials: true   

        })
      }
      catch(err){
        setSuccess(false);
      }
    } 
    const getUsers = async () =>{
      try {
        const response = await axiosPrivate.get(USER_URL,
          {
            signal: controller.signal
          });
          token !== undefined && isMounted && setUsers(response.data);
      } catch(err)
      {

          navigate('/login', { state: { from: location }, replace: true });
      }


    }

    getTokenVerification();
    getUsers();

    return() =>{
      isMounted = false;
       controller.abort();
    }},[])
  return ( 
      <div>
        <h2>Users List</h2>
        {users?.length && success === true
        
   ? (
    <ul>
      
      {users.map(
        (user,id) => <li key={id}>{user?.username}</li>
        )}
    </ul>
  ) : <p>Refresh the Page</p>
        }
     <button onClick={() => refresh()}>Refresh</button>
      </div>
  );
};
  
export default User_List;