import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import './Header.css';

function Header() {
  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/dashboard" className="text-white">
          BUKSU Guidance
        </Navbar.Brand>
      </Container>  
    </Navbar>
  );
}

export default Header;
