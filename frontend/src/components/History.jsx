import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Table,
  Row,
  Col,
  Button,
  Pagination
} from 'react-bootstrap';
import Sidebar from './Sidebar';
import Swal from 'sweetalert2';
import axios from 'axios';


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

  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 10;

  // Calculate total pages
  const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

  // Get current appointments
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
      // Filter only approved and rejected appointments
      const filteredAppointments = data.filter(appointment => 
        appointment.status === 'confirmed' || appointment.status === 'rejected'
      );
      setAppointments(filteredAppointments);
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
                <h5>Appointments ({appointments.length})</h5>
            
              </Card.Title>

              {/* Appointments Table */}
              <div className="table-responsive">  
              <Table className="table-sm">
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
                  {currentAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>
                      {appointment.type === 'individual' ? (
                        <span>Individual</span>
                      ) : (
                        <span>Group</span>
                      )}
                      </td>
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
                          <span>Behavioral</span>
                        )}
                      </td>
                      <td> {new Date(appointment.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}</td>
                      <td>{appointment.time}</td>
                      <td>
                        <span className={`badge bg-${appointment.status === 'pending' ? 'warning' : appointment.status === 'confirmed' ? 'success' : 'danger'}`}>
                          {appointment.status === 'pending' ? (
                          <span>Pending</span>
                        ) : appointment.status === 'confirmed' ? (
                          <span>Approved</span>
                        ) : (
                          <span>Rejected</span>
                        )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              </div>
              {appointments.length > appointmentsPerPage && (
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

export default History;