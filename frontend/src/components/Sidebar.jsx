import React from 'react';
import {
  Navbar,
  Nav,
  Container,
} from 'react-bootstrap';
import './Sidebar.css';
import Header from './Header';

function Sidebar() {

  return (
    <>      

      {/* Sidebar Container */}
      <div className='sidebar-container'>
        <Header />
        <Navbar bg="primary" variant="dark" expand="lg" className="h-100">
          <Container>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <div className="sidebar-content">
                <Nav className="flex-column w-100">
                  <Nav.Link href="/dashboard" className="text-white">
                    <i className="bi bi-house-door me-2"></i> Dashboard
                  </Nav.Link>
                  <hr />
                  <Nav.Link href="/history" className="text-white">
                    <i className="bi bi-clock-history me-2"></i> History
                  </Nav.Link>
                  <hr />
                  <Nav.Link href="/calendar" className="text-white">
                    <i className="bi bi-calendar3 me-2"></i> Calendar
                  </Nav.Link>
                  <hr />
                  <Nav.Link href="/profile" className="text-white">
                    <i className="bi bi-person me-2"></i> Profile
                  </Nav.Link>
                  <hr />
                  <Nav.Link href="/login" className="text-white">
                    <i className="bi bi-box-arrow-right me-2"></i> Logout
                  </Nav.Link>
                  <hr />
                </Nav>
              </div>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    </>
  );
}

export default Sidebar;
