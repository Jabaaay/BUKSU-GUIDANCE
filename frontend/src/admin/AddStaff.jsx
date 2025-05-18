import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Table,
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import AdminSidebar from '../components/AdminSidebar';
import AddStaffModal from './AddStaffModal';


// Mock data for appointments
const mockAppointments = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    position: 'Staff'

  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    position: 'Staff'

  }
];


function AddStaff() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  useEffect(() => {
    setLoading(false);
  }, []);

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
          <AdminSidebar />
        </Col>

        {/* Main Content Column */}
        <Col md={10} className="p-4">
      



          {/* Appointments Stats Card */}
          <Card className="mb-4">
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                <h5>Add Staff</h5>
                <Button variant="primary" onClick={handleShowModal}>
                  <i className="bi bi-plus-circle me-1"></i> Add Staff
                </Button>
             
              </Card.Title>

              {/* Appointments Table */}
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Position</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>{appointment.name}</td>
                      <td>{appointment.email}</td>
                      <td>{appointment.position}</td>
                      <td className="d-flex gap-2">
                  
                        <Button variant="outline-danger btn-sm" onClick={() => navigate(`/appointment/${appointment.id}`)}>
                          <i className="bi bi-trash"></i>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {/* Add Appointment Modal */}
          <AddStaffModal show={showModal} handleClose={handleCloseModal} />
        </Col>
      </Row>
    </div>
  );
}

export default AddStaff;  