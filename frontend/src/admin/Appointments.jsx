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
import AddAppointmentModal from '../components/AddAppointmentModal';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
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

function Appointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  // Fetch appointments from backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/appointments/admin', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAppointments(response.data);
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

    fetchAppointments();
  }, []);

  // Handle appointment accept
  const handleAccept = async (appointmentId) => {
    Swal.fire({
      title: 'Accept Appointment',
      text: 'Are you sure you want to accept this appointment?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Accept',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          await axios.put(`http://localhost:5000/api/appointments/${appointmentId}/accept`, {}, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          // Update appointments list
          setAppointments(prev => prev.map(appointment => 
            appointment._id === appointmentId ? { ...appointment, status: 'confirmed' } : appointment
          ));
          
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Appointment accepted successfully'
          });
        } catch (error) {
          console.error('Error accepting appointment:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Failed to accept appointment'
          });
        }
      }
    });
  };

  // Handle appointment reject
  const handleReject = async (appointmentId) => {
    Swal.fire({
      title: 'Reject Appointment',
      text: 'Are you sure you want to reject this appointment?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Reject',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.put(`http://localhost:5000/api/appointments/${appointmentId}/reject`, {}, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          // Update appointments list
          setAppointments(prev => prev.map(appointment => 
            appointment._id === appointmentId ? { ...appointment, status: 'declined' } : appointment
          ));
          
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Appointment rejected successfully'
          });
        } catch (error) {
          console.error('Error rejecting appointment:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Failed to reject appointment'
          });
        }
      }
    });
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
          {/* Appointments Stats Card */}
          <Card className="mb-4">
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                <h5>Appointments</h5>

              </Card.Title>

              {/* Appointments Table */}
              <Table>
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>College</th>
                    <th>Course</th>
                    <th>Concern</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* fetch only the pending appointments */}
                  {appointments.filter(appointment => appointment.status === 'pending').map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{appointment._id}
                        
                      </td>
                      <td>{appointment.user.firstName} {appointment.user.lastName}</td>
                      <td>{appointment.user.college}</td>
                      <td>{appointment.user.course}</td>
                      <td>
                        {appointment.purpose === 'academic' ? (
                          <span>Academic</span>
                        ) : (
                          <span>Behavioral</span>
                        )}
                      </td>
                      <td>{new Date(appointment.date).toLocaleDateString()}</td>
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
                      <td className="d-flex gap-2">
                        {appointment.status === 'pending' && (
                          <>
                            <Button 
                              variant="outline-success" 
                              className="btn btn-sm" 
                              onClick={() => handleAccept(appointment._id)}
                            >
                              <i className="bi bi-check-circle"></i>
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              className="btn btn-sm" 
                              onClick={() => handleReject(appointment._id)}
                            >
                              <i className="bi bi-x-circle"></i>
                            </Button>
                          </>
                        )}
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

export default Appointments;