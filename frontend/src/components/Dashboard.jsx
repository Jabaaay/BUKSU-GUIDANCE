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
import Sidebar from './Sidebar';
import AddAppointmentModal from './AddAppointmentModal';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';



function Dashboard() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch('http://localhost:5000/api/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch appointments. Please try again later.'
      });
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const columns = [
    {
      name: 'Type',
      selector: (row) => row.type,
      sortable: true,
    },
    {
      name: 'Purpose',
      selector: (row) => row.purpose,
      sortable: true,
    },
    {
      name: 'Date',
      selector: (row) => row.date,
      sortable: true,
    },
    {
      name: 'Time',
      selector: (row) => row.time,
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
    },
  ];

  return (
    <div className="container-fluid">
      <Row>
        {/* Sidebar Column */}
        <Col md={2} className="bg-primary text-white">
          <Sidebar />
        </Col>

        {/* Main Content Column */}
        <Col md={10} className="p-4">
        <Row>
            <Col md={4} className="mb-4">
            <Card>
                <Card.Body className='border border-primary'>
                    <Card.Title>Appointments</Card.Title>
                    <Card.Text className="text-center">
                        <h1 className="text-center" style={{ fontSize: '50px' }}>{appointments.length}</h1>
                    </Card.Text>
                </Card.Body>
            </Card>
            
            </Col>
        </Row>
          {/* Appointments Stats Card */}
          <Card className="mb-4">
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                <h5>My Appointments</h5>
                <Button variant="primary" onClick={handleShowModal}>
                  <i className="bi bi-plus-circle me-1"></i> Add Appointment
                </Button>
              </Card.Title>

              {/* Appointments Table */}
              <Table striped hover>
                <thead>
                  <tr>
                  <th>Type</th>
                    <th>Purpose</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>
                      {appointment.type === 'individual' ? (
                        <span>Individual</span>
                      ) : (
                        <span>Group</span>
                      )}
                      </td>
                      <td>
                        {appointment.purpose === 'academic' ? (
                          <span>Academic</span>
                        ) : (
                          <span>Behavioral</span>
                        )}
                      </td>
                      <td>{appointment.date}</td>
                      <td>{appointment.time}</td>
                      <td>
                        <span className={`badge bg-${appointment.status === 'pending' ? 'warning' : appointment.status === 'confirmed' ? 'success' : 'danger'}`}>
                          {appointment.status === 'pending' ? (
                          <span>Pending</span>
                        ) : appointment.status === 'confirmed' ? (
                          <span>Confirmed</span>
                        ) : (
                          <span>Declined</span>
                        )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {/* Add Appointment Modal */}
          <AddAppointmentModal show={showModal} handleClose={handleCloseModal} />
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;