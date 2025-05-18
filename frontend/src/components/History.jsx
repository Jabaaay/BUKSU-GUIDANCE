import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Table,
  Row,
  Col,
  Button
} from 'react-bootstrap';
import Sidebar from './Sidebar';
import Swal from 'sweetalert2';
// Mock data for appointments
const mockAppointments = [
  {
    id: 1,
    studentId: '2023-0001',
    studentName: 'John Doe',
    course: 'BSIT',
    yearLevel: '3rd Year',
    concern: 'Academic Issues',
    date: '2025-05-18',
    time: '10:00 AM',
    status: 'Pending'
  },
  {
    id: 2,
    studentId: '2023-0002',
    studentName: 'Jane Smith',
    course: 'BSCS',
    yearLevel: '4th Year',
    concern: 'Career Guidance',
    date: '2025-05-19',
    time: '2:00 PM',
    status: 'Scheduled'
  }
];

function History() {
  const navigate = useNavigate();

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      text: 'You won\'t be able to revert this!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        );
      }
    });
    

  };


  return (
    <div className="container-fluid">
      <Row>
        {/* Sidebar Column */}
        <Col md={2} className="bg-primary text-white">
          <Sidebar />
        </Col>

        {/* Main Content Column */}
        <Col md={10} className="p-4">
          {/* Appointments Stats Card */}
          <Card className="mb-4">
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                <h5>Appointments ({mockAppointments.length})</h5>
            
              </Card.Title>

              {/* Appointments Table */}
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Concern</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>{appointment.concern}</td>
                      <td>{appointment.date}</td>
                      <td>{appointment.time}</td>
                      <td>
                        <span className={`badge bg-${appointment.status === 'Pending' ? 'warning' : 'success'}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className='d-flex gap-2'>
                       <Button variant="outline-info" size="sm">
                          View
                        </Button>
                        <Button onClick={() => handleDelete(appointment.id)} variant="outline-danger" size="sm">
                          Delete
                        </Button>
                      </td>
                        </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          
        </Col>
      </Row>
    </div>
  );
}

export default History;