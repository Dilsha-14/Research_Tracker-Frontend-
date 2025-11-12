import React, { useContext } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function NavigationBar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const roles = user?.roles || [];

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/dashboard">Research Tracker</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/projects">Projects</Nav.Link>
          <Nav.Link as={Link} to="/milestones">Milestones</Nav.Link>
          <Nav.Link as={Link} to="/documents">Documents</Nav.Link>
          {roles.includes("ADMIN") && <Nav.Link as={Link} to="/admin">Admin</Nav.Link>}
        </Nav>
        <Nav>
          {user ? (
            <NavDropdown title={user.sub || "User"} id="user-menu">
              <NavDropdown.Item onClick={() => navigate("/dashboard")}>Dashboard</NavDropdown.Item>
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          ) : (
            <>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Nav.Link as={Link} to="/register">Register</Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}