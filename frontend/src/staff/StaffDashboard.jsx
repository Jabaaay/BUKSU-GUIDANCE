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
import { Bar, Pie } from 'react-chartjs-2';

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
  }
];

// Mock data for charts
const appointmentData = {
  labels: ['Academic', 'Behavioral', 'Both'],
  datasets: [
    {
      label: 'Appointments by Purpose',
      data: [45, 30, 25],
      backgroundColor: ['#4e73df', '#858796', '#e74a3b'],
      borderColor: ['#4e73df', '#858796', '#e74a3b'],
      borderWidth: 1,
    },
  ],
};

const monthlyData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Total Appointments',
      data: [12, 19, 3, 5, 2, 3, 15, 10, 20, 30, 25, 40],
      backgroundColor: '#4e73df',
      borderRadius: 5,
      borderColor: '#4e73df',
      borderWidth: 1,
      
    },
  ],
};

function StaffDashboard() {
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
        <Row>
            <Col md={3} className="mb-4">
            <Card>
                <Card.Body className='border border-primary'>
                    <Card.Title>Appointments</Card.Title>
                    <Card.Text className="text-center d-flex align-items-center justify-content-between">
                        <h1 className="text-center" style={{ fontSize: '50px' }}>{mockAppointments.length}</h1>
                        <i className="bi bi-calendar3 me-2 text-primary" style={{ fontSize: '50px' }}></i>
                    </Card.Text>
                </Card.Body>
            </Card>
            
            </Col>

            <Col md={3} className="mb-4">
            <Card>
                <Card.Body className='border border-success'>
                    <Card.Title>Approved</Card.Title>
                    <Card.Text className="text-center d-flex align-items-center justify-content-between">
                        <h1 className="text-center" style={{ fontSize: '50px' }}>{mockAppointments.length}</h1>
                        <i className="bi bi-check2-circle me-2 text-success" style={{ fontSize: '50px' }}></i>
                    </Card.Text>
                </Card.Body>
            </Card>
            
            </Col>

            <Col md={3} className="mb-4">
            <Card>
                <Card.Body className='border border-danger'>
                    <Card.Title>Rejected</Card.Title>
                    <Card.Text className="text-center d-flex align-items-center justify-content-between">
                        <h1 className="text-center" style={{ fontSize: '50px' }}>{mockAppointments.length}</h1>
                        <i className="bi bi-x-circle me-2 text-danger" style={{ fontSize: '50px' }}></i>
                    </Card.Text>
                </Card.Body>
            </Card>
            
            </Col>

            <Col md={3} className="mb-4">
            <Card>
                <Card.Body className='border border-warning'>
                    <Card.Title>Users</Card.Title>
                    <Card.Text className="text-center d-flex align-items-center justify-content-between">
                        <h1 className="text-center" style={{ fontSize: '50px' }}>{mockAppointments.length}</h1>
                        <i className="bi bi-people me-2 text-warning" style={{ fontSize: '50px' }}></i>
                    </Card.Text>
                </Card.Body>
            </Card>
            
            </Col>
        </Row>

        <Row className="mt-4 mb-4">
          {/* Bar Chart */}
          <Col md={8}>
            <Card>
              <Card.Body>
                <Card.Title>Monthly Appointments</Card.Title>
                <Bar
                  data={monthlyData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: true,
                        text: 'Appointments by Month',
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </Card.Body>
            </Card>
          </Col>

          {/* Pie Chart */}
          <Col md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>Appointment Purposes</Card.Title>
                <Pie
                  data={appointmentData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: true,
                        text: 'Appointments by Purpose',
                      },
                    },
                  }}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>


          {/* Appointments Stats Card */}
          <Card className="mb-4">
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                <h5>Recent Appointments</h5>
             
              </Card.Title>

              {/* Appointments Table */}
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Concern</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
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

export default StaffDashboard;