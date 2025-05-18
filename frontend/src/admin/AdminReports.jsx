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
import axios from 'axios';
import Swal from 'sweetalert2';



function AdminReports() {
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
          <AdminSidebar />
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
              <Table>
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
                  {appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>{appointment._id}</td>
                      <td>{appointment.user.firstName} {appointment.user.lastName}</td>
                      <td>{appointment.user.college}</td>
                      <td>{appointment.user.course}</td>
                      <td>{appointment.purpose === 'academic' ? 'Academic' : 'Behavioral'}</td>
                      <td>{appointment.date}</td>
                      <td>{appointment.time}</td>
                      <td>
                        {appointment.status === 'confirmed' ? (
                          <span className="badge bg-success">Confirmed</span>
                        ) : (
                          <span className="badge bg-danger">Declined</span>
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

export default AdminReports;  