
import { Outlet,useLocation, Navigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";

const PrivateRoute = ({ allowedRoles }) => {
    const location = useLocation();
    const {auth} = useAuth();
    let role_list = [];
    /* the auth role wasnt an array which caused issues */
    role_list.push(auth.roles);

    return (
       role_list.find(role => allowedRoles?.includes(role)) 
       ? <Outlet/>      
       : auth?.accessToken
       ? <Navigate to='/unauthorized' state={{from: location}} replace />
        : <Navigate to ="/login" state={{from: location}} replace /> 
    );
}
export default PrivateRoute;