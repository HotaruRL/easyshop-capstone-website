# 🛍️ Easy Shop Frontend

Welcome to the Easy Shop Frontend! This is a dynamic and modern e-commerce web application built with React. It provides a complete user experience, from browsing and filtering products to a secure checkout process. Whether you're a customer looking to shop or an admin managing the store, this application has you covered.

This repository contains the complete frontend code. It's designed to be clean, modular, and easy to understand, making it a great starting point for your own e-commerce projects or for learning advanced React concepts like global state management and protected routing.

## 🔗 Companion API

This frontend application is designed to work with a specific backend API that handles all the business logic, data storage, and user authentication. To run this project locally, you'll first need to set up and run its companion API.

You can find the backend project and its setup instructions here:

👉 **Easy Shop E-commerce API:** [https://github.com/HotaruRL/easyshop-ecommerce-api-capstone](https://github.com/HotaruRL/easyshop-ecommerce-api-capstone)

Make sure the API server is running before you start the frontend application.

## 📝 Project Requirements

Before you begin, ensure you have the following set up on your local machine:

-   **Node.js** (v16 or later is recommended) and **npm**.
-   A running instance of the corresponding backend API. This frontend is designed to communicate with a backend service. By default, it expects the API to be available at `http://localhost:8080`.

## 📦 Dependencies

This project leans on several powerful libraries to deliver its features. Here are some of the key players:

-   **`react-router-dom`**: For handling all client-side routing and navigation.
-   **`axios`**: To make promise-based HTTP requests to the backend API.
-   **`jwt-decode`**: A small library to decode JWTs and extract user information from the token payload.
-   **`react-select`**: For a user-friendly and customizable select dropdown component, used in product filtering.
-   **`react-bootstrap`**: Provides pre-built form components for a consistent UI, used on the 'Add Product' page.

## 🚀 Getting Started

First, you need to install all the necessary project dependencies. Navigate to the project's root directory in your terminal and run the following command:

```bash
npm install
```

This command will download all the required libraries from `package.json` and set up your `node_modules` folder, getting you ready for the next step.

## ▶️ How to run the application

To start the application in development mode, simply run the command below from the project's root directory:

```bash
npm start
```

This will launch the app and automatically open it in your default web browser, typically at `http://localhost:3000`.

Hot-reloading is enabled, so any changes you make to the source code will be reflected in the browser instantly! Just remember, for the application to work fully (including login, fetching products, and placing orders), the backend server **must be running on `http://localhost:8080`**.

## ✨ Relevant Code Examples

This project showcases several modern React development patterns. Here are a few highlights to help you understand the architecture.

### Protected Routes for Secure Navigation

We use a component-based approach to protect routes, ensuring only authorized users can access certain pages. The `ProtectedRoute` component acts as a gatekeeper for standard logged-in users.

```javascript
// src/components/ProtectedRoute.js
const ProtectedRoute = ({children}) => {
    const {token} = useAuth();

    // If there is no token, redirect to the login page
    if (!token){
        return <Navigate to="/login" />;
    }
    // Otherwise, render the requested component
    return children;
};
```

For routes that require administrator privileges, the `AdminRoute` adds an extra layer of validation by checking the user's role, which is decoded from the JWT.

```javascript
// src/components/AdminRoute.js
const AdminRoute = ({children}) => {
    const {user, token} = useAuth();

    if(!token){
        return <Navigate to="/login" />;
    }

    // Also check if the user has the 'ROLE_ADMIN' role
    if(user && user.role !== 'ROLE_ADMIN'){
        return <Navigate to="/" />;
    }

    return children;
};
```

Implementing these is clean and declarative within our main router setup in `App.js`. This keeps our routing logic easy to read and maintain.

```javascript
// src/App.js

// A route available to any logged-in user
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>

// A route available ONLY to admin users
<Route
  path="/products"
  element={
    <AdminRoute>
      <AddProduct />
    </AdminRoute>
  }
/>
```

### Centralized State with Context API

To manage application-wide state like user authentication, shopping cart items, and order status, we use React's Context API. The `AuthContext` provides a global "announcement system" that components can subscribe to for user data and login/logout functions.

```javascript
// src/context/AuthContext.js

export const AuthProvider = ({children}) =>{
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('token'));

    const login = (newToken) => {
        const decodedUser = jwtDecode(newToken);
        localStorage.setItem('token', newToken);
        setUser(decodedUser);
        setToken(newToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    // ...
};

// Custom hook for easy consumption
export const useAuth = () => {
    return useContext(AuthContext);
};
```

This pattern allows any component, like our `Navbar`, to easily access the user's authentication status without the complexity of passing props down through many levels.

### Effortless API Requests with Axios Interceptors

Manually adding the authentication token to every API request would be repetitive and error-prone. We solve this elegantly with an Axios interceptor. This helper automatically attaches the JWT to the `Authorization` header of every outgoing request.

```javascript
// src/api/axiosClient.js
const axiosClient = axios.create({
    baseURL: 'http://localhost:8080/',
});

// The interceptor function runs before each request is sent
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    // If a token exists, add it to the request headers
    if (token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosClient;
```

Now, whenever we need to make an authenticated API call, we just use our custom `axiosClient` instance, and the token is handled for us behind the scenes!

## 👋 Conclusion

The Easy Shop Frontend is a comprehensive example of building a real-world React application. It demonstrates key patterns for routing, state management, and API communication that are essential for modern web development.

Feel free to explore the code, fork the repository, and adapt it for your own needs. We hope you find it educational and useful.