import React from 'react';
import { useLocation } from 'react-router-dom';

function Layout({ children }) {
  const location = useLocation();
  
  // Show navbar only on home page
  const showNavbar = location.pathname === '/';

  return (
    <>
      {showNavbar && (
        <nav className="navbar navbar-expand-lg navbar-light bg-light-blue fixed-top">
          <div className="container">
            <a className="navbar-brand text-dark-blue fw-bold" href="#home">BUKSU Guidance</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <a className="nav-link text-white" href="#home">Home</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#about">About Us</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#announcements">Announcements</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#contact">Contact Us</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <div className="main-content mt-5">
        {children}
      </div>
    </>
  );
}

export default Layout;
