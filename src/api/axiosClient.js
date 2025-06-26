import axios from 'axios';

/*
A helper - interceptor - to grab token from storage and
automatically attach it to Authorization Header for every request
*/

// create custom instance of axios
const axiosClient = axios.create({
    // set base URL for ALL requests
    baseURL: 'http://localhost:8080/',
});

// create the interceptor
axiosClient.interceptors.request.use((config) => {
    // grab the token from storage
    const token = localStorage.getItem('token');

    // if there is a token, attach it to Authorization Header
    if (token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosClient;