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
import StaffSidebar from './StaffSidebar';
import axios from 'axios';
import Swal from 'sweetalert2';



function StaffReports() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    setLoading(false);
  }, []);

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
                <h5>Reports</h5>
                <button className="btn btn-primary"> <i className="bi bi-file-text"></i> Generate Report</button>
             
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
                  </tr>
                </thead>
                <tbody>

            
                  {appointments
                    .filter((appointment) => appointment.status === 'confirmed')
                    .map((appointment, index) => (
                      <tr key={appointment.id}>
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
                          <span className="badge bg-success">Approved</span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
              </div>
            </Card.Body>
          </Card>

          
        </Col>
      </Row>
    </div>
  );
}

export default StaffReports;  