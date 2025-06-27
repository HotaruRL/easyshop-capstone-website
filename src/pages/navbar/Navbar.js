import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../../context/AuthContext";

const NavbarComponent = () => {
  const { user, logout } = useAuth();

    return (
    <header className="main-header">
      <NavLink to="/" className="logo">Easy Shop</NavLink>
      
      <nav>
        <ul className="nav-links">
          <li><NavLink to="/">Home</NavLink></li>
          
          {user ? (
            <>
              <li><NavLink to="/profile">Profile</NavLink></li>
              {user.role === "ROLE_ADMIN" && (
                <li><NavLink to="/add-product">Add Product</NavLink></li>
              )}
              <li><button onClick={logout} className="logout-button">Logout</button></li>
            </>
          ) : (
            <li><NavLink to="/login">Login</NavLink></li>
          )}
        </ul>
      </nav>

      <button className="visit-btn">My Cart</button>
    </header>
  );
};

export default NavbarComponent;
