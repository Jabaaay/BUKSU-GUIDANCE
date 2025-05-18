import React, { useState } from 'react';
import {
  Navbar,
  Nav,
  Container,
} from 'react-bootstrap';
import './AdminSidebar.css';
import Header from './Header';

function AdminSidebar() {
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
                  <Nav.Link href="/admin/dashboard" className="text-white">
                    <i className="bi bi-house-door me-2"></i> Dashboard
                  </Nav.Link>
                  <hr />
                  <Nav.Link href="/admin/appointments" className="text-white">
                    <i className="bi bi-calendar3 me-2"></i> Appointments
                  </Nav.Link>
                  <hr />
            
                  <Nav.Link href="/admin/staff" className="text-white">
                    <i className="bi bi-people me-2"></i> Add Staff
                  </Nav.Link>
                  <hr />
                  <Nav.Link href="/admin/announcements" className="text-white">
                    <i className="bi bi-megaphone me-2"></i> Announcements
                  </Nav.Link>
                  <hr />
                  <Nav.Link href="/admin/reports" className="text-white">
                    <i className="bi bi-bar-chart-line-fill me-2"></i> Reports
                  </Nav.Link>
                  <hr />
                
                  
                  <Nav.Link href="/admin/profile" className="text-white">
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

export default AdminSidebar;
