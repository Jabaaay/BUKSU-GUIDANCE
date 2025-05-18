import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Table,
  Container,
  Row,
  Col,
} from 'react-bootstrap';

import StaffSidebar from './StaffSidebar';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


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
    course: 'BSIT',
    yearLevel: '3rd Year',
    concern: 'Academic Issues',
    date: '2025-05-18',
    time: '10:00 AM',
    status: 'Pending'
  }
];


function StaffAppointments() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  return (
    <div className="container-fluid">
      <Row>
        {/* Sidebar Column */}
        <Col md={2} className="bg-primary text-white">
          <StaffSidebar />
        </Col>

        {/* Main Content Column */}
        <Col md={10} className="p-4">
      



          {/* Appointments Stats Card */}
          <Card className="mb-4">
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                <h5>Appointments</h5>
             
              </Card.Title>

              {/* Appointments Table */}
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Course</th>
                    <th>Year Level</th>
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
                      <td>{appointment.studentId}</td>
                      <td>{appointment.studentName}</td>
                      <td>{appointment.course}</td>
                      <td>{appointment.yearLevel}</td>
                      <td>{appointment.concern}</td>
                      <td>{appointment.date}</td>
                      <td>{appointment.time}</td>
                      <td>
                        <span className={`badge bg-${appointment.status === 'Pending' ? 'warning' : 'success'}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="d-flex gap-2">
                        <Button variant="outline-success" onClick={() => navigate(`/appointment/${appointment.id}`)}>
                          Accept
                        </Button>
                        <Button variant="outline-danger" onClick={() => navigate(`/appointment/${appointment.id}`)}>
                          Reject
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

export default StaffAppointments;  