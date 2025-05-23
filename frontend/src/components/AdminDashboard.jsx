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
import AdminSidebar from './AdminSidebar';
import AddAppointmentModal from './AddAppointmentModal';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import Swal from 'sweetalert2';

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

function AdminDashboard() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    users: 0,
    collegeStats: {
      'CIT': 0,
      'CAS': 0,
      'CEA': 0,
      'CBA': 0,
      'COE': 0,
      'COT': 0,
      'COA': 0
    }
  });

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  // Fetch appointments and calculate statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/appointments/admin', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }

        const data = await response.json();
        setAppointments(data);
        
        // Calculate statistics
        const newStats = {
          total: data.length,
          approved: data.filter(app => app.status === 'confirmed').length,
          rejected: data.filter(app => app.status === 'rejected').length,
          users: new Set(data.map(app => app.user)).size,
          collegeStats: {}
        };

        // Calculate college-wise statistics
        data.forEach(app => {
          if (app.college) {
            const college = app.college.toUpperCase();
            newStats.collegeStats[college] = (newStats.collegeStats[college] || 0) + 1;
          }
        });

        setStats(newStats);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch appointments'
        });
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Update chart data based on statistics
  const collegeData = {
    labels: Object.keys(stats.collegeStats),
    datasets: [
      {
        label: 'Appointments by College',
        data: Object.values(stats.collegeStats),
        backgroundColor: [
          '#4e73df',
          '#858796',
          '#e74a3b',
          '#1cc88a',
          '#36b9cc',
          '#f6c23e',
          '#5a5c69'
        ],
        borderWidth: 1
      }
    ]
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
          <Row>
            {/* Stats Cards */}
            <Col md={3} className="mb-4">
              <Card>
                <Card.Body className='border border-primary'>
                  <Card.Title>Appointments</Card.Title>
                  <Card.Text className="text-center d-flex align-items-center justify-content-between">
                    <h1 className="text-center" style={{ fontSize: '50px' }}>{stats.total}</h1>
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
                    <h1 className="text-center" style={{ fontSize: '50px' }}>{stats.approved}</h1>
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
                    <h1 className="text-center" style={{ fontSize: '50px' }}>{stats.rejected}</h1>
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
                    <h1 className="text-center" style={{ fontSize: '50px' }}>{stats.users}</h1>
                    <i className="bi bi-people me-2 text-warning" style={{ fontSize: '50px' }}></i>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mt-4 mb-4">
            {/* College Distribution Chart */}
            <Col md={7}>
            <Card style={{ height: '500px' }}>
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

            {/* Monthly Appointments Chart */}
            <Col md={5}>
              <Card style={{ height: '500px' }}>
                <Card.Body>
                  <Card.Title>College Distribution</Card.Title>
                  <div style={{ height: '500px', width: '100%', position: 'center' }}>
                    <Pie 
                      data={collegeData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                            labels: {
                              boxWidth: 10,
                              padding: 10
                            }
                          },
                          title: {
                            display: true,
                            text: 'Appointments by College',
                            font: {
                              size: 14
                            }
                          },
                        },
                        layout: {
                          padding: 20
                        },
                        maintainAspectRatio: true
                      }}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent Appointments Table */}
          <Card className="mb-4">
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                <h5>Recent Appointments</h5>
              </Card.Title>

              <div className="table-responsive">
              <Table className="table-sm">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>College</th>
                    <th>Purpose</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments
                    .filter(app => app.status === 'pending')
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 1)
                    .map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{appointment.name}</td>
                      <td>{appointment.college}</td>
                      <td>
                        {appointment.purpose === 'academic' ? (
                          <span>Academic</span>
                        ) : (
                          <span>Behavioral</span>
                        )}
                      </td>
                      <td>{new Date(appointment.createdAt).toLocaleDateString()}</td>
                      <td>{appointment.time}</td>
                      <td>
                        <span className={`badge bg-warning`}>
                          Pending
                        </span>
                      </td>
                    </tr>
                    
                  ))}

                  
                </tbody>
              </Table>
              </div>
            </Card.Body>
          </Card>

          {/* Add Appointment Modal */}
          <AddAppointmentModal show={showModal} handleClose={handleCloseModal} />
        </Col>
      </Row>
    </div>
  );
}

export default AdminDashboard;