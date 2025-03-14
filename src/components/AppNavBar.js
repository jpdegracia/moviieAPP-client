import { useContext, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link, NavLink } from 'react-router-dom';
import UserContext from '../UserContext';


export default function AppNavbar() {
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (user?.isAdmin) {
            // Check if the page has already been reloaded in this session
            const hasReloaded = sessionStorage.getItem("adminReloaded");

            if (!hasReloaded) {
                sessionStorage.setItem("adminReloaded", "true");
                window.location.reload();
            }
        }
    }, [user?.isAdmin]); 
    return (
        <Navbar bg="dark" expand="lg" className="px-4 text-warning">
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold text-warning">Zuitt Movie Hub 👻</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                    </Nav>
                    {user?.id ? (
                        user.isAdmin ? (
                            // Admin view
                            <>                          
                                <Nav.Link as={NavLink} to="/movies" className="me-3">Admin</Nav.Link>                        
                                <Nav.Link as={NavLink} to="/logout">Logout</Nav.Link>
                            </>
                        ) : (
                            // Regular user view
                            <>
                                <Nav.Link as={NavLink} to="/" className="me-3">Home</Nav.Link>
                                <Nav.Link as={NavLink} to="/movies" className="text-warning me-3">Movie</Nav.Link>
                                <Nav.Link as={NavLink} to="/logout">Logout</Nav.Link>
                            </>
                        )
                    ) : (
                        // Not logged in
                        <>
                            <Nav.Link as={NavLink} to="/" className="me-3">Home</Nav.Link>
                            <Nav.Link as={NavLink} to="/movies" className="text-warning me-3">Movies</Nav.Link>
                            <Nav.Link as={NavLink} to="/login" className="me-3">Login</Nav.Link>
                            <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
                        </>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
