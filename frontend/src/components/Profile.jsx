import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal
} from 'react-bootstrap';
import Sidebar from './Sidebar';
import axios from 'axios';
import Swal from 'sweetalert2';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    college: '',
    course: '',
    birthday: '',
    age: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      // Initialize form with user data
      setEditForm({
        firstName: parsedUser.firstName,
        lastName: parsedUser.lastName,
        email: parsedUser.email,
        college: parsedUser.college,
        course: parsedUser.course,
        birthday: parsedUser.birthday,
        age: parsedUser.age
      });
      setLoading(false);
    }
  }, []);

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/api/users/profile',
        editForm,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // Update local storage and state
        const updatedUser = { ...user, ...editForm };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        // Close modal and show success message
        setShowEditModal(false);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Profile updated successfully'
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to update profile'
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <div className="text-center p-5">Loading profile...</div>;
  }

  if (!user) {
    return <div className="text-center p-5">User data not found</div>;
  }

  return (
    <div className="container-fluid">
      <Row>
        <Col md={2} className="bg-primary text-white">
          <Sidebar />
        </Col>

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
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={editForm.firstName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={editForm.lastName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>College</Form.Label>
              <Form.Control
                type="text"
                name="college"
                value={editForm.college}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Course</Form.Label>
              <Form.Control
                type="text"
                name="course"
                value={editForm.course}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Birthday</Form.Label>
              <Form.Control
                type="date"
                name="birthday"
                value={editForm.birthday}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                name="age"
                value={editForm.age}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="ms-2">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Profile;
