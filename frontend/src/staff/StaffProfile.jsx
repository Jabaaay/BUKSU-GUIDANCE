import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import StaffSidebar from './StaffSidebar';

function StaffProfile() {
  return (
    <div className="container-fluid">
      <Row>
        {/* Sidebar Column */}
        <Col md={2} className="bg-primary text-white">
          <StaffSidebar />
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
                  <h5>John Doe</h5>
                </Col>
                <Col md={8}>
                  <Card className="mb-3">
                    <Card.Body>
                      <Card.Title>Personal Information</Card.Title>
                      <div className="mb-3">
                        <strong>Institutional Email:</strong> john.doe@example.com
                      </div>

                      <div className="mb-3">
                        <strong>Student ID:</strong> 2023-0001
                      </div>

                      <div className="mb-3">
                        <strong>Age:</strong> 20
                      </div>
                      <div className="mb-3">
                        <strong>Birthdate:</strong> 2025-05-18
                      </div>

                      <div className="mb-3">
                        <strong>Gender:</strong> Male
                      </div>

                      <div className="mb-3">
                        <strong>College:</strong> College of Computer Studies
                      </div>

                      <div className="mb-3">
                        <strong>Course:</strong> Information Technology
                      </div>

                      <div className="mb-3">
                        <strong>Year Level:</strong> 3rd Year
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

export default StaffProfile;
