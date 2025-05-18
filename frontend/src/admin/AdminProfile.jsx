import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import Sidebar from '../components/AdminSidebar';
import axios from 'axios';

function AdminProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthday: '',
    college: '',
    course: ''
  });

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        firstName: parsedUser.firstName,
        lastName: parsedUser.lastName,
        email: parsedUser.email,
        birthday: parsedUser.birthday,
        college: parsedUser.college,
        course: parsedUser.course
      });
      setLoading(false);
    }
  }, []);

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleClose = () => {
    setShowEditModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/api/admin/profile',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Update user data in state and localStorage
      const updatedUser = { ...user, ...response.data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Close modal and show success message
      handleClose();
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
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
    <div className="container-fluid">
      <Row>
        {/* Sidebar Column */}
        <Col md={2} className="bg-primary text-white">
          <Sidebar />
        </Col>

        {/* Main Content Column */}
        <Col md={10} className="p-4">
          <Card className="mb-4">
            <Card.Body>
              <Card.Title className="mb-4">Profile</Card.Title>
              
              <Row>
                <Col md={4} className="text-center">
                  <div className="mb-3">
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/149/149071.png" 
                      alt="Profile" 
                      className="rounded-circle" 
                      style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                    />
                  </div>
                  <h5>{user.firstName} {user.lastName}</h5>
                  <span>
                    {user.role === 'student' ? (
                      <span className="text-primary">Student</span>
                    ) : (
                      <span className="text-primary">Admin</span>
                    )}
                  </span>
                </Col>
                <Col md={8}>
                  <Card className="mb-3">
                    <Card.Body>
                      <Card.Title>Personal Information</Card.Title>
                      <div className="mb-3">
                        <strong>Student ID:</strong> {user.id}
                      </div>
                      <div className="mb-3">
                        <strong>Email:</strong> {user.email}
                      </div>
                      <div className="mb-3">
                        <strong>Full Name:</strong> {user.firstName} {user.lastName}
                      </div>
                      <div className="mb-3">
                        <strong>Birthday:</strong> {new Date(user.birthday).toLocaleDateString()}
                      </div>
                      <div className="mb-3">
                        <strong>Age:</strong> {user.age}
                      </div>
                      <div className="mb-3">
                        <strong>College:</strong> {user.college}
                      </div>
                      <div className="mb-3">
                        <strong>Course:</strong> {user.course}
                      </div>
                      <Button 
                        className='btn btn-info text-white btn-sm' 
                        onClick={handleEditClick}
                      >
                        Edit Profile
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Edit Profile Modal */}
      <Modal show={showEditModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="lastName" className="mt-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="email" className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="birthday" className="mt-3">
              <Form.Label>Birthday</Form.Label>
              <Form.Control
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="college" className="mt-3">
              <Form.Label>College</Form.Label>
              <Form.Control
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="course" className="mt-3">
              <Form.Label>Course</Form.Label>
              <Form.Control
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end mt-3">
              <Button variant="secondary" onClick={handleClose} className="me-2">
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AdminProfile;
