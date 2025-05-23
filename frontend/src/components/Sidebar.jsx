import React, { useState } from 'react';
import {
  Navbar,
  Nav,
  Container,
} from 'react-bootstrap';
import './Sidebar.css';
import Header from './Header';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function Sidebar() {
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
      setShowSidebar(false);
      Swal.fire({
        title: 'Are you sure?',
        text: "You want to logout?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, logout!'
      }).then((result) => {
        if (result.isConfirmed) {
          // Clear authentication data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          console.log('User logged out successfully');
  
          Swal.fire({
            icon: 'success',
            title: 'Logged Out',
            text: 'You have been successfully logged out',
            showConfirmButton: false,
            timer: 1500
          });
          // Redirect to login page
          navigate('/login');
        }
      });
    };

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
                  <Nav.Link
                    href="/dashboard"
                    className={`text-white ${window.location.pathname === '/dashboard' ? 'active' : ''}`}
                  >
                    <i className="bi bi-house-door me-2"></i> Dashboard
                  </Nav.Link>
                  <hr />
                  <Nav.Link
                    href="/history"
                    className={`text-white ${window.location.pathname === '/history' ? 'active' : ''}`}
                  >
                    <i className="bi bi-calendar3 me-2"></i> History
                  </Nav.Link>
                  <hr />
                  <Nav.Link
                    href="/calendar"
                    className={`text-white ${window.location.pathname === '/calendar' ? 'active' : ''}`}
                  >
                    <i className="bi bi-bar-chart-line-fill me-2"></i> Calendar
                  </Nav.Link>
                  <hr />
                
                  
                  <Nav.Link
                    href="/profile"
                    className={`text-white ${window.location.pathname === '/profile' ? 'active' : ''}`}
                  >
                    <i className="bi bi-person me-2"></i> Profile
                  </Nav.Link>
                  <hr />
                  <Nav.Link
                    onClick={handleLogout}
                  >
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

export default Sidebar;
