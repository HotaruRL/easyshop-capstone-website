import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"

/*
a wrapper to automatically check token for each page that user supposed to log in first
no need for if/else logic in App.js
for ADMIN users ONLY
*/
const AdminRoute = ({children}) => {
    // get full user object from context
    const {user, token} = useAuth();

    // check #1: is anyone logged in?
    // if not, send to login page
    if(!token){
        return <Navigate to="/login" />;
    }

    // check #2: is logged-in user an admin?
    // NOTE: role value 'ROLE_ADMIN' must match what API puts in the JWT
    // if normal user, send to home page
    if(user && user.role !== 'ROLE_ADMIN'){
        return <Navigate to="/" />;
    }
    // if is admin, show the authorization-required page
    return children;
};

export default AdminRoute;