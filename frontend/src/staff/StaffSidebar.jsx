import React, { useState } from 'react';
import {
  Navbar,
  Nav,
  Container,
} from 'react-bootstrap';
import './StaffSidebar.css';
import Header from '../components/Header';

function StaffSidebar() {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>

      {/* Sidebar Container */}
      <div className={`sidebar-container ${showSidebar ? 'show' : ''}`}>
        <Header />
        <Navbar bg="primary" variant="dark" expand="lg" className="h-100">
          <Container>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <div className="sidebar-content">
                <Nav className="flex-column w-100">
                  <Nav.Link href="/staff/dashboard" className="text-white">
                    <i className="bi bi-house-door me-2"></i> Dashboard
                  </Nav.Link>
                  <hr />
                  <Nav.Link href="/staff/appointments" className="text-white">
                    <i className="bi bi-calendar3 me-2"></i> Appointments
                  </Nav.Link>
                  <hr />
                  <Nav.Link href="/staff/announcements" className="text-white">
                    <i className="bi bi-megaphone me-2"></i> Announcements
                  </Nav.Link>
                  <hr />
                  <Nav.Link href="/staff/reports" className="text-white">
                    <i className="bi bi-bar-chart-line-fill me-2"></i> Reports
                  </Nav.Link>
                  <hr />
                
                  
                  <Nav.Link href="/staff/profile" className="text-white">
                    <i className="bi bi-person me-2"></i> Profile
                  </Nav.Link>
                  <hr />
                  <Nav.Link href="/login" className="text-white">
                    <i className="bi bi-box-arrow-right me-2"></i> Logout
                  </Nav.Link>
                </Nav>
              </div>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>

      {/* Sidebar Overlay for Mobile */}
      <div className="sidebar-overlay" onClick={() => setShowSidebar(false)}></div>
    </>
  );
}

export default StaffSidebar;
