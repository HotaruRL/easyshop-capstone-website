import './App.css';
import {Routes, Route} from 'react-router-dom';
import NavbarComponent from './pages/navbar/Navbar.js';

import ProtectedRoute from './components/ProtectedRoute.js';
import AdminRoute from './components/AdminRoute.js';

import NoMatch from './pages/noMatch/NoMatch.js';
import Home from './pages/home/Home.js';
import Login from './pages/login/Login.js';
import Profile from './pages/profile/Profile.js';
import AddProduct from './pages/product/AddProduct.js';


function App() {
  return (
    <>
      <NavbarComponent />
      
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />

        {/* Protected Routes for NORMAL logged-in users*/}
        <Route path='/profile' element={<ProtectedRoute><Profile/></ProtectedRoute>} />

        {/* Protected Routes for ADMIN user ONLY */}
        <Route path='/products' element={<AdminRoute><AddProduct/></AdminRoute>} />

        {/* unspecified routes */}
        <Route path='*' element={<NoMatch/>} />
      </Routes>
    </>
  );
}

export default App;
