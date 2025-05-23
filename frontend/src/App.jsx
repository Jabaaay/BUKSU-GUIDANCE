import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Card, Button, Container, Row, Col, Image, Modal, Pagination } from 'react-bootstrap';
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
import './styles/announcements.css'
import axios from 'axios';
import ProtectedRoute from './components/ProtectedRoute';
import Swal from 'sweetalert2';

function App() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);


  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const announcementsPerPage = 8;
  const totalPages = Math.ceil(announcements.length / announcementsPerPage);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/announcements');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    setLoading(false);
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastAnnouncement = currentPage * announcementsPerPage;
  const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage;
  const currentAnnouncements = announcements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);

  const handleShowModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
        <div className="spinner-border text-primary" role="status" style={{ width: '5rem', height: '5rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <h4 className="mt-3 text-primary">Loading...</h4>
      </div>
    );
  }

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
              <section className="announcements-section bg-light py-5" id="announcements">
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <h2 className="text-center mb-4 text-dark-blue">Announcements</h2>
                      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                        {currentAnnouncements.map((announcement) => (
                          <div key={announcement._id} className="col">
                            <Card className="bg-light border-1 shadow-sm h-100 announcement-card">
                              <Card.Body className="d-flex flex-column">
                                {announcement.image && (
                                  <div className="mb-3">
                                    <Image
                                      src={`http://localhost:5000${announcement.image}`}
                                      alt={announcement.title}
                                      fluid
                                      rounded
                                      className="announcement-image"
                                      style={{ 
                                        maxHeight: '200px', 
                                        width: '100%',
                                        backgroundSize: 'cover',  
                                        objectFit: 'cover', 
                                        borderRadius: '8px' 
                                      }}
                                    />
                                  </div>
                                )}
                                <Card.Title className="text-dark-blue mb-2 flex-grow-1">
                                  {announcement.title}
                                </Card.Title>
                                <Card.Text className="text-dark-blue mb-3 flex-grow-1">
                                {announcement.content.split(' ').slice(0, 30).join(' ') + '...'}
                                </Card.Text>
                                <div className="mt-auto">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <small className="text-muted">
                                      <i className="bi bi-calendar3 me-1"></i>
                                      {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                      })}
                                    </small>
                                    <Button 
                                      variant="btn btn-outline-primary" 
                                      size="sm" 
                                      onClick={() => handleShowModal(announcement)}
                                    >
                                      Read More
                                    </Button>
                                  </div>
                                </div>
                              </Card.Body>
                            </Card>
                          </div>
                        ))}
                      </div>
                      
                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-4">
                          <Pagination>
                            <Pagination.First 
                              onClick={() => handlePageChange(1)} 
                              disabled={currentPage === 1}
                            />
                            <Pagination.Prev 
                              onClick={() => handlePageChange(currentPage - 1)} 
                              disabled={currentPage === 1}
                            />
                            {Array.from({ length: totalPages }, (_, index) => (
                              <Pagination.Item
                                key={index + 1}
                                active={currentPage === index + 1}
                                onClick={() => handlePageChange(index + 1)}
                              >
                                {index + 1}
                              </Pagination.Item>
                            ))}
                            <Pagination.Next 
                              onClick={() => handlePageChange(currentPage + 1)} 
                              disabled={currentPage === totalPages}
                            />
                            <Pagination.Last 
                              onClick={() => handlePageChange(totalPages)} 
                              disabled={currentPage === totalPages}
                            />
                          </Pagination>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Announcement Modal */}
              <Modal show={showModal} onHide={handleCloseModal} size="xl" >
                <Modal.Body>
                  <div className="text-center mb-4">
                    {selectedAnnouncement?.image && (
                      <Image
                        src={`http://localhost:5000${selectedAnnouncement.image}`}
                        fluid
                        rounded
                      />
                    )}
                  </div>
                  <Modal.Title>{selectedAnnouncement?.title}</Modal.Title>
                  <br />
                  <p className="text-dark-blue mb-4">{selectedAnnouncement?.content}</p>
                  <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    <i className="bi bi-calendar3 me-1"></i>
                    {new Date(selectedAnnouncement?.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </small>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                  </Button>
                  </div>
                </Modal.Body>
              </Modal>

              {/* Fourth Section - Contact Us */}
              <section className="contact-section vh-100 bg-light-blue d-flex align-items-center justify-content-center" id="contact">
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <h2 className="text-center mb-3 text-dark-blue">Contact Us</h2>
                      <div className="col-md-8 offset-md-2">
                        <div className="mb-3">
                          <i className="bi bi-geo-alt-fill me-2 text-dark-blue"></i>
                          <span className="text-dark-blue">BUKSU Guidance Office, Bukidnon State University</span>
                        </div>
                        <div>
                          <i className="bi bi-envelope-fill me-2 text-dark-blue"></i>
                          <span className="text-dark-blue">guidance@buksu.edu.ph</span>
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
        
        {/* Student routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['student']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute allowedRoles={['student']}>
            <History />
          </ProtectedRoute>
        } />
        <Route path="/calendar" element={
          <ProtectedRoute allowedRoles={['student']}>
            <Calendar />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['student']}>
            <Profile />
          </ProtectedRoute>
        } />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path='/admin/appointments' element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Appointments />
          </ProtectedRoute>
        } />
        <Route path='/admin/staff' element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AddStaff />
          </ProtectedRoute>
        } />
        <Route path='/admin/profile' element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminProfile />
          </ProtectedRoute>
        } />
        <Route path='/admin/reports' element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminReports />
          </ProtectedRoute>
        } />
        <Route path='/admin/announcements' element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Announcements />
          </ProtectedRoute>
        } />

        {/* Staff routes */}
        <Route path='/staff/appointments' element={
          <ProtectedRoute allowedRoles={['staff']}>
            <StaffAppointments />
          </ProtectedRoute>
        } />
        <Route path='/staff/dashboard' element={
          <ProtectedRoute allowedRoles={['staff']}>
            <StaffDashboard />
          </ProtectedRoute>
        } />
        <Route path='/staff/profile' element={
          <ProtectedRoute allowedRoles={['staff']}>
            <StaffProfile />
          </ProtectedRoute>
        } />
        <Route path='/staff/reports' element={
          <ProtectedRoute allowedRoles={['staff']}>
            <StaffReports />
          </ProtectedRoute>
        } />
        <Route path='/staff/announcements' element={
          <ProtectedRoute allowedRoles={['staff']}>
            <StaffAnnouncements />
          </ProtectedRoute>
        } />

        {/* Unauthorized route */}
        <Route path="/unauthorized" element={
          <div className="container mt-5">
            <div className="alert alert-danger">
              <h4>Unauthorized Access</h4>
              <p>You do not have permission to enter the life of my idol</p>
              <p></p> 
              <button className="btn btn-primary" onClick={() => navigate(-1)}>
               <i className="bi bi-arrow-left"></i> Back
              </button>
            </div>
          </div>
        } />
      </Routes>
    </div>
  )
}

export default App
