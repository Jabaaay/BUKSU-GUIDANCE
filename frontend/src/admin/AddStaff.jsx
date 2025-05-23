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
import AddStaffModal from './AddStaffModal';
import axios from 'axios';
import Swal from 'sweetalert2';

function AddStaff() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [staffList, setStaffList] = useState([]);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  // Fetch staff data from backend
  const fetchStaff = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/staff');
      setStaffList(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching staff:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch staff data',
        confirmButtonColor: '#4e73df'
      });
      setLoading(false);
    }
  };

  // Initial fetch and refresh on changes
  useEffect(() => {
    fetchStaff();
  }, []); // Empty dependency array means it runs once on mount

  // Refresh staff list after adding a new staff member
  const handleStaffAdded = () => {
    handleCloseModal();
    fetchStaff();
  };

  // Function to handle staff deletion
  const handleDeleteStaff = async (staffId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4e73df',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        const response = await axios.delete(`http://localhost:5000/api/staff/${staffId}`);
        
        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: response.data.message,
          timer: 2000,
          showConfirmButton: false
        });
        
        // Refresh staff list
        fetchStaff();
      }
    } catch (error) {
      console.error('Error deleting staff:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to delete staff',
        timer: 2000,
        showConfirmButton: false
      });
    }
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
                <h5>Add Staff</h5>
                <Button variant="primary" onClick={handleShowModal}>
                  <i className="bi bi-plus-circle me-1"></i> Add Staff
                </Button>
              </Card.Title>

              {/* Staff Table */}
              <div className="table-responsive">
                <Table className="table-sm">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Position</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffList.map((staff, index) => (
                      <tr key={staff._id}>
                        <td>{index + 1}</td>
                        <td>{staff.firstName}</td>
                        <td>{staff.email}</td>
                        <td>
                          {staff.position === 'admin' ? 'Admin' : 'Staff'}
                        </td>
                        <td className="d-flex gap-2">
                          <Button 
                            variant="outline-danger btn-sm" 
                            onClick={() => handleDeleteStaff(staff._id)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>

          {/* Add Staff Modal */}
          <AddStaffModal 
            show={showModal} 
            handleClose={handleCloseModal} 
            onStaffAdded={handleStaffAdded} 
          />
        </Col>
      </Row>
    </div>
  );
}

export default AddStaff;