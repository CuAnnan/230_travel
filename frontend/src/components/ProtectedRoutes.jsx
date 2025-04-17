import { Navigate, Outlet } from 'react-router-dom'
import {client} from "../AxiosInterceptor.js";

const PrivateRoutes = () => {
    const user = client.user;
    console.log(user);
    return (
        user ? (<Outlet/>) : (<Navigate to='/login'/>)
    );
}

export default PrivateRoutes;