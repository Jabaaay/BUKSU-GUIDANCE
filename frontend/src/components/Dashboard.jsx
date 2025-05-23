import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Table,
  Container,
  Row,
  Col,
  Pagination,
  Modal,
  Form
} from 'react-bootstrap';
import Sidebar from './Sidebar';
import AddAppointmentModal from './AddAppointmentModal';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';

// Add Edit Appointment Modal
function EditAppointmentModal({ show, handleClose, handleEditSubmit, editForm, setEditForm }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Appointment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleEditSubmit}>
          <Form.Group className="mb-3" controlId="type">
            <Form.Label>Type</Form.Label>
            <Form.Select
              value={editForm.type}
              onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
            >
              <option value="">Select Type</option>
              <option value="individual">Individual</option>
              <option value="group">Group</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="purpose">
            <Form.Label>Purpose</Form.Label>
            <Form.Select
              value={editForm.purpose}
              onChange={(e) => setEditForm({ ...editForm, purpose: e.target.value })}
            >
              <option value="">Select Purpose</option>
              <option value="Academic Counseling">Academic Counseling</option>
              <option value="Emotional Support">Emotional Support</option>
              <option value="Career Guidance">Career Guidance</option>
              <option value="Behavioral Concerns">Behavioral Concerns</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="date">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              value={editForm.date}
              onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="time">
            <Form.Label>Time</Form.Label>
            <Form.Control
              type="time"
              value={editForm.time}
              onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Update Appointment
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 5;

  // Calculate total pages
  const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

  // Get current appointments
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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

  // filter only pending
  const filteredAppointments = appointments.filter(appointment => 
    appointment.status === 'pending'
  );

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editForm, setEditForm] = useState({
    type: '',
    purpose: '',
    date: '',
    time: ''
  });

  const handleEdit = (appointment) => {
    console.log('Editing appointment:', appointment); // Add logging
    if (!appointment || !appointment._id) {
      console.error('Invalid appointment data:', appointment);
      return;
    }

    setSelectedAppointment(appointment);
    setEditForm({
      type: appointment.type,
      purpose: appointment.purpose,
      date: new Date(appointment.date).toISOString().split('T')[0],
      time: appointment.time
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    console.log('Selected appointment:', selectedAppointment); // Add logging
    console.log('Edit form data:', editForm); // Add logging

    if (!selectedAppointment || !selectedAppointment._id) {
      console.error('No selected appointment');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No appointment selected'
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/appointments/${selectedAppointment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: editForm.type,
          purpose: editForm.purpose,
          date: editForm.date,
          time: editForm.time
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update appointment');
      }

      const updatedAppointment = await response.json();
      console.log('Updated appointment:', updatedAppointment); // Add logging

      // Update the appointments list
      setAppointments(prev => prev.map(app => 
        app._id === selectedAppointment._id ? updatedAppointment : app
      ));

      // Close modal and reset form
      setShowEditModal(false);
      setSelectedAppointment(null);
      setEditForm({
        type: '',
        purpose: '',
        date: '',
        time: ''
      });

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Appointment updated successfully'
      });
    } catch (error) {
      console.error('Error updating appointment:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message
      });
    }
  };

  const handleDelete = async (appointment) => {
    console.log('Full appointment object:', appointment); // Log the entire appointment object
    const id = appointment._id || appointment.id; // Try both possible ID fields
    console.log('Attempting to delete with ID:', id);
    
    if (!id) {
      console.error('No ID found in appointment object');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Invalid appointment data'
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:5000/api/appointments/${id}`, {  
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete appointment');
          }

          // Remove deleted appointment from the list
          setAppointments(prev => prev.filter(app => app._id === id));

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Appointment deleted successfully'
          });
        } catch (error) {
          console.error('Error deleting appointment:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message
          });
        }
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
        <Row>
            <Col md={4} className="mb-4">
            <Card>
                <Card.Body className='border border-primary'>
                    <Card.Title>Appointments</Card.Title>
                    <Card.Text className="text-center">
                        <h1 className="text-center" style={{ fontSize: '50px' }}>{filteredAppointments.length}</h1>
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
              <div className="table-responsive">  
              <Table className="table-sm">
                <thead>
                  <tr>
                  <th>Type</th>
                    <th>Purpose</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  
                  {filteredAppointments.map((appointment) => (
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
                      <td className="d-flex gap-2">
                        <Button variant="outline-primary" className="btn-sm" onClick={() => handleEdit(appointment)}>
                          <i className='bi bi-pencil'></i>
                        </Button>
                        <Button variant="outline-danger" className="btn-sm" onClick={() => handleDelete(appointment)}>
                          <i className='
                          bi bi-trash'></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              </div>
              {appointments.length > 5 && ( // Only show pagination if there are more than 5 items
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

          {/* Add Appointment Modal */}
          <AddAppointmentModal show={showModal} handleClose={handleCloseModal} />
          {/* Edit Appointment Modal */}
          <EditAppointmentModal 
            show={showEditModal} 
            handleClose={() => setShowEditModal(false)} 
            handleEditSubmit={handleEditSubmit} 
            editForm={editForm} 
            setEditForm={setEditForm} 
          />
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;