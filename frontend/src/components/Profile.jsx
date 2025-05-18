import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Sidebar from './Sidebar';
import axios from 'axios';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="text-center p-5">Loading profile...</div>;
  }

  if (!user) {
    return <div className="text-center p-5">User data not found</div>;
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
                      <Button className='btn btn-info text-white btn-sm'>Edit Profile</Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Profile;
