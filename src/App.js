import './App.css';
import {Routes, Route} from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard.js';
import Header from './pages/header/Header.js';
import NoMatch from './pages/noMatch/NoMatch.js';
import AddProduct from './pages/product/AddProduct.js';


function App() {
  return (
    <>
    <Header />
    <Routes>
      <Route path='/' element={<Dashboard/>} />
      <Route path='/products' element={<AddProduct/>} />
      <Route path='*' element={<NoMatch/>} />
    </Routes>
    </>
  );
}

export default App;
