import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Layout from './components/Layout';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Calendar from './components/Calendar';
import Profile from './components/Profile';
import AdminDashboard from './components/AdminDashboard';
import Appointments from './admin/Appointments';
import AddStaff from './admin/AddStaff';
import AdminProfile from './admin/AdminProfile';
import AdminReports from './admin/AdminReports';
import Announcements from './admin/Announcements';
import StaffAppointments from './staff/StaffAppointments';
import StaffProfile from './staff/StaffProfile';
import StaffReports from './staff/StaffReports';
import StaffAnnouncements from './staff/StaffAnnouncements';
import StaffDashboard from './staff/StaffDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css'

function App() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-vh-100">
      <Routes>
        <Route path="/" element={
          <Layout>
            <>
              {/* Navbar */}
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

              {/* First Section - Welcome */}
              <section className="hero-section vh-100 bg-primary d-flex align-items-center justify-content-center text-center" id="home">
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <h1 className="display-4 fw-bold mb-3 text-white">Welcome to BUKSU Guidance</h1>
                      <p className="lead text-white">Your trusted partner in student guidance and counseling</p>
                      <button 
                        className="btn btn-light btn-lg px-4 mt-3" 
                        onClick={handleLoginClick}
                      >
                        Login
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Second Section - About Us */}
              <section className="about-section vh-100 bg-light-blue d-flex align-items-center justify-content-center" id="about">
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <h2 className="text-center mb-3 text-dark-blue">About Us</h2>
                      <div className="col-md-8 offset-md-2">
                        <p className="text-center text-dark-blue">
                          We are dedicated to providing comprehensive guidance services to BUKSU students. 
                          Our team of professional counselors is here to support you in your academic journey 
                          and personal growth.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Third Section - Announcements */}
              <section className="announcements-section vh-100 bg-primary d-flex align-items-center justify-content-center" id="announcements">
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <h2 className="text-center mb-3 text-white">Announcements</h2>
                      <div className="col-md-8 offset-md-2">
                        <div className="card mb-3 bg-light-blue">
                          <div className="card-body">
                            <h5 className="card-title text-dark-blue">Guidance Services Schedule</h5>
                            <p className="card-text text-dark-blue">Walk-in counseling sessions are available Monday to Friday, 8:00 AM - 5:00 PM.</p>
                          </div>
                        </div>
                        <div className="card bg-light-blue">
                          <div className="card-body">
                            <h5 className="card-title text-dark-blue">Upcoming Workshops</h5>
                            <p className="card-text text-dark-blue">Join our stress management workshop on May 25, 2025.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Fourth Section - Contact Us */}
              <section className="contact-section vh-100 bg-light-blue d-flex align-items-center justify-content-center" id="contact">
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <h2 className="text-center mb-3 text-dark-blue">Contact Us</h2>
                      <div className="col-md-8 offset-md-2">
                        <div className="mb-3">
                          <i className="bi bi-geo-alt-fill me-2 text-dark-blue"></i>
                          <span className="text-dark-blue">BUKSU Guidance Office, Bulacan State University</span>
                        </div>
                        <div className="mb-3">
                          <i className="bi bi-telephone-fill me-2 text-dark-blue"></i>
                          <span className="text-dark-blue">(044) 536-0000 loc 234</span>
                        </div>
                        <div>
                          <i className="bi bi-envelope-fill me-2 text-dark-blue"></i>
                          <span className="text-dark-blue">guidance@bulsu.edu.ph</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Footer */}
              <footer className="bg-dark text-white py-3 mt-auto">
                <div className="container">
                  <div className="row">
                    <div className="col-12 text-center">
                      <p>&copy; 2025 BUKSU Guidance. All rights reserved.</p>
                    </div>
                  </div>
                </div>
              </footer>
            </>
          </Layout>
        }/>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path='/admin/appointments' element={<Appointments />} />
        <Route path='/admin/staff' element={<AddStaff />} />
        <Route path='/admin/profile' element={<AdminProfile />} />
        <Route path='/admin/reports' element={<AdminReports />} />
        <Route path='/admin/announcements' element={<Announcements />} />
        <Route path='/staff/appointments' element={<StaffAppointments />} />
        <Route path='/staff/dashboard' element={<StaffDashboard />} />
        <Route path='/staff/profile' element={<StaffProfile />} />
        <Route path='/staff/reports' element={<StaffReports />} />
        <Route path='/staff/announcements' element={<StaffAnnouncements />} />
      </Routes>
    </div>
  )
}

export default App
