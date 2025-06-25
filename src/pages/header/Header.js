import { Container, Navbar, NavbarBrand, Nav } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import "./Header.css";

const Header = () => {
    return(
        <>
        <Navbar bg="primary" variant="dark">
            <Container>
            <NavbarBrand to="/"><strong>Easy Shop</strong></NavbarBrand>
        {/* ml-auto to align it to the right side */}
        <Nav className="ml-auto">
        <NavLink as={Link} to="/" className="nav-link">Home</NavLink>

        <NavLink as={Link} to="/login" className="nav-link">Login</NavLink>

        <NavLink as={Link} to="/products" className="nav-link">Add Product</NavLink>
        </Nav>
            </Container>
        </Navbar>
        </>
    )
}

export default Header;