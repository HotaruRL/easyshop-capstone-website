import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";

/*
Global "announcement system" allows the whole app to know when a user already successfully logged in
npm install jwt-decode to decode token
*/
const AuthContext = createContext(null);

export const AuthProvider = ({children}) =>{
    // store the whole user object to know user's role as well as token
    const [user, setUser] = useState(null);
    // load token initially
    const [token, setToken] = useState(() => localStorage.getItem('token'));

    // hook to run code when app starts
    useEffect(() => {
        // look in browser's storage for saved token
        const storedToken = localStorage.getItem('token');

        // decode token to get userinfo including role
        if (storedToken){
            try{
                const decodedUser = jwtDecode(storedToken);
                setUser(decodedUser);
                setToken(storedToken);
            } catch (error) {
                // if token is invalid, clear everything
                setUser(null);
                setToken(null);
                localStorage.removeItem('token');
            }
        }
    }, []); // empty array means "only run this once" when app starts

    // handle logging in and out
    const login = (newToken) => {
        try{
            const decodedUser = jwtDecode(newToken);
            localStorage.setItem('token', newToken);
            setUser(decodedUser);
            setToken(newToken);
        } catch (error) {
            console.error("Invalid token:", error);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    const contextValue = {token, user, login, logout};

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};