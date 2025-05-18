import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

function AddStaffModal({ show, handleClose }) {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    position: '',
    department: '',
    contactNumber: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.position) {
      return Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill in all required fields',
        confirmButtonColor: '#4e73df'
      });
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Authentication required',
          confirmButtonColor: '#4e73df'
        });
      }

      const response = await fetch('http://localhost:5000/api/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to add staff');
      }

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Staff member added successfully',
        confirmButtonColor: '#4e73df'
      });

      // Reset form
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        position: '',
        department: '',
        contactNumber: ''
      });

      handleClose();
    } catch (error) {
      console.error('Error adding staff:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
        confirmButtonColor: '#4e73df'
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Staff Member</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="email">
            <Form.Label>Email *</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email address"
            />
          </Form.Group>

          <Form.Group controlId="firstName" className="mt-3">
            <Form.Label>First Name *</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              placeholder="Enter first name"
            />
          </Form.Group>

          <Form.Group controlId="lastName" className="mt-3">
            <Form.Label>Last Name *</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              placeholder="Enter last name"
            />
          </Form.Group>

          <Form.Group controlId="position" className="mt-3">
            <Form.Label>Position *</Form.Label>
            <Form.Control
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              placeholder="Enter position"
            />
          </Form.Group>

          <Form.Group controlId="department" className="mt-3">
            <Form.Label>Department</Form.Label>
            <Form.Control
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Enter department"
            />
          </Form.Group>

          <Form.Group controlId="contactNumber" className="mt-3">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Enter contact number"
            />
          </Form.Group>

          <div className="d-flex justify-content-end mt-3">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Staff
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddStaffModal;
