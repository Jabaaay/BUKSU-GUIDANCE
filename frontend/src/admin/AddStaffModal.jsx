import React, { useState } from 'react';
import {
  Modal,
  Form,
  Button,
} from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

function AddStaffModal({ show, handleClose, onStaffAdded }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/staff/add', {
        name,
        email,
        position: "staff"
      });

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.data.message,
        
      });
      
      // Call parent callback to refresh staff list
      if (onStaffAdded) {
        onStaffAdded();
      }
      handleClose();
      // Reset form
      setName('');
      setEmail('');
      setPosition('');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error adding staff',
        timer: 2000,
        showConfirmButton: false
        
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Staff</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="email" className="mt-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="position" className="mt-3">
            <Form.Label>Position</Form.Label>
            <Form.Control
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
              readOnly
              placeholder="Staff"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Close
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Adding...' : 'Add Staff'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddStaffModal;
