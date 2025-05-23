import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Table,
  Container,
  Row,
  Col,
  Form,
  Pagination
} from 'react-bootstrap';
import StaffSidebar from './StaffSidebar';
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

function StaffAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  // Filter appointments based on selected status
  const filteredAppointments = appointments.filter(appointment => {
    if (selectedStatus === 'all') return true;
    return appointment.status === selectedStatus;
  });

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

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
        setTotalPages(Math.ceil(response.data.length / 10));
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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
          <StaffSidebar />
        </Col>

        {/* Main Content Column */}
        <Col md={10} className="p-4">
          {/* Appointments Stats Card */}
          <Card className="mb-4">
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                <h5>Appointments</h5>


                <Form.Select
                  className="form-select w-25"
                  value={selectedStatus}
                  onChange={handleStatusChange}
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Approved</option>
                  <option value="rejected">Rejected</option>
                </Form.Select>

              </Card.Title>

              {/* Appointments Table */}
              <div className="table-responsive">
              <Table className="table-sm">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>College</th>
                    <th>Course</th>
                    <th>Purpose</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    {selectedStatus === 'pending' && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {/* fetch only the pending appointments */}
                  {filteredAppointments.slice((currentPage - 1) * 10, currentPage * 10).map((appointment, index) => (
                    <tr key={appointment._id}>
                      <td>{index + 1}</td>
                      <td>{appointment.name}</td>
                      <td>{appointment.college}</td>
                      <td>{appointment.course}</td>
                      <td>
                        {appointment.purpose === 'Academic Counseling' ? (
                          <span>Academic Counseling</span>
                        ) : appointment.purpose === 'Emotional Support' ? (
                          <span>Emotional Support</span>
                        ) : appointment.purpose === 'Career Guidance' ? (
                          <span>Career Guidance</span>
                        ) : appointment.purpose === 'Behavioral Concerns' ? (
                          <span>Behavioral Concerns</span>
                        ) : (
                          <span>Others</span>
                        )}
                      </td>
                      <td>
                        {new Date(appointment.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td>
                        {appointment.time}
                      </td>
                      <td>
                        <span className={`badge ${
                          appointment.status === 'pending' ? 'bg-warning' :
                          appointment.status === 'confirmed' ? 'bg-success' :
                          'bg-danger'
                        }`}>
                          {appointment.status === 'pending' ? 'Pending' :
                          appointment.status === 'confirmed' ? 'Approved' :
                          'Rejected'
                        }
                        </span>
                      </td>
                      {selectedStatus === 'pending' && <td className="d-flex gap-2">
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
                      </td>}
                      
                      
                    </tr>
                    
                  ))}
                
                  
                </tbody>
              </Table>
              </div>
              {appointments.length > 10 && ( // Only show pagination if there are more than 10 items
                <Pagination className="mt-3">
                  {[...Array(totalPages).keys()].map((pageNumber) => (
                    <Pagination.Item 
                      key={pageNumber} 
                      active={pageNumber === currentPage - 1} 
                      onClick={() => handlePageChange(pageNumber + 1)}
                    >
                      {pageNumber + 1}
                    </Pagination.Item>
                  ))}
                </Pagination>
              )}
            </Card.Body>
          </Card>

          
        </Col>
      </Row>
    </div>
  );
}

export default StaffAppointments;