import { useLocation, Navigate, Outlet} from "react-router-dom";
import useAuth from "../Hooks/useAuth";

const RequireAuth = ({ allowedRoles })=>{
    const {auth} = useAuth();
    const location = useLocation();

    return(
        auth?.roles?.find(role => allowedRoles?.include(role))
        ? <Outlet/>
        :
        auth?.accessToken 
            ?<Navigate to='/unauthorized' state={{from:location}} replace />
            : <Navigate to='/login' state={{from:location}} replace />
    )
}