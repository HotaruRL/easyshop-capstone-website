import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"

/*
a wrapper to automatically check token for each page that user supposed to log in first
no need for if/else logic in App.js
for NORMAL users, not ADMIN users
*/
const ProtectedRoute = ({children}) => {

    // check the token
    const {token} = useAuth();

    // verify token
    if (!token){
        //if no token, redirect to login page
        return <Navigate to="/login" />;
    }
    // if there is a token, let user see the page
    return children;
};

export default ProtectedRoute;