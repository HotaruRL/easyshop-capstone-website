import { Container, Navbar, NavbarBrand, Nav, NavbarToggle, NavbarCollapse } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../../context/AuthContext";

const NavbarComponent = () => {

    const {user, logout} = useAuth();

    return(
        <>
        <Navbar bg="primary" variant="dark" expand="lg">
            <Container>
                <NavbarBrand as={NavLink} to="/"><strong>Easy Shop</strong></NavbarBrand>
                <NavbarToggle aria-controls="basic-navbar-nav" />
                <NavbarCollapse id="basic-navbar-nav">
                    {/* ml-auto to align it to the right side */}
                    <Nav className="ms-auto">

                        <NavLink as={NavLink} to="/" className="nav-link">Home</NavLink>

                        {/* ADMIN-ONLY LINK */}
                        {user && user.role === 'ROLE_ADMIN' && (
                            <NavLink as={NavLink} to="/products" className="nav-link">
                                Add Product
                            </NavLink>
                        )}

                        {/* LOGGED IN vs. LOGGED OUT LOGIC */}
                        {user ? (
                            // if user logged in, show Profile and Logout
                            <>
                                <NavLink as={NavLink} to="/profile" className="nav-link">
                                    Profile
                                </NavLink>

                                <NavLink onClick={logout} href="#" className="nav-link">
                                    Logout
                                </NavLink>
                            </>
                        ) : (
                            // if no user logged in, show Login
                            <NavLink as={NavLink} to="/login" className="nav-link">
                                Login
                            </NavLink>
                        )}
                    </Nav>
                </NavbarCollapse>
            </Container>
        </Navbar>
        </>
    )
}

export default NavbarComponent;