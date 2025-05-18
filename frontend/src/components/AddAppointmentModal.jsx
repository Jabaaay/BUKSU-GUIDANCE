import React, { useState } from 'react';
import {
  Modal,
  Form,
  Button,
  Alert
} from 'react-bootstrap';
import Swal from 'sweetalert2';

const appointmentTypes = [
  { value: 'individual', label: 'Individual' },
  { value: 'group', label: 'Group' }
];

const counselingTypes = [
  { value: 'Academic Counseling', label: 'Academic Counseling' },
  { value: 'Emotional Support', label: 'Emotional Support' },
  { value: 'Career Guidance', label: 'Career Guidance' },
  { value: 'Behavioral Concerns', label: 'Behavioral Concerns' }
];

const availableTimeSlots = [
  { value: '08:00 - 09:00', label: '8:00 - 9:00am' },
  { value: '09:00 - 10:00', label: '9:00 - 10:00am' },
  { value: '10:00 - 11:00', label: '10:00 - 11:00am' },
  { value: '13:00 - 14:00', label: '1:00 - 2:00pm' },
  { value: '14:00 - 15:00', label: '2:00 - 3:00pm' },
  { value: '15:00 - 16:00', label: '3:00 - 4:00pm' }
];

function AddAppointmentModal({ show, handleClose }) {
  const [formData, setFormData] = useState({
    type: '',
    purpose: '',
    date: '',
    time: ''
  });
  const [error, setError] = useState('');

  const isWeekend = (date) => {
    const day = new Date(date).getDay();
    return day === 0 || day === 6; // Sunday and Saturday
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(date) < today;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate date when it changes
    if (name === 'date') {
      if (isPastDate(value)) {
        setError('Cannot select past dates');
      } else if (isWeekend(value)) {
        setError('Cannot schedule appointments on weekends');
      } else {
        setError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    if (!formData.type || !formData.purpose || !formData.date || !formData.time) {
      setError('Please fill in all fields');
      return;
    }

    if (isPastDate(formData.date)) {
      setError('Cannot select past dates');
      return;
    }

    if (isWeekend(formData.date)) {
      setError('Cannot schedule appointments on weekends');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login first');
        return;
      }

      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create appointment');
      }

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Appointment scheduled successfully!',
      });

      // Close modal and reset form
      handleClose();
      setFormData({
        type: '',
        purpose: '',
        date: '',
        time: ''
      });

    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to schedule appointment'
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Appointment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select name="type" value={formData.type} onChange={handleChange} required>
              <option value="">Select type</option>
              {appointmentTypes.map((type, index) => (
                <option key={index} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Purpose</Form.Label>
            <Form.Select name="purpose" value={formData.purpose} onChange={handleChange} required>
              <option value="">Select purpose</option>
              {counselingTypes.map((type, index) => (
                <option key={index} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control 
              type="date" 
              name="date" 
              value={formData.date} 
              onChange={handleChange} 
              required
              min={new Date().toISOString().split('T')[0]} // Disable past dates
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Time</Form.Label>
            <Form.Select name="time" value={formData.time} onChange={handleChange} required>
              <option value="">Select time slot</option>
              {availableTimeSlots.map((slot, index) => (
                <option key={index} value={slot.value}>
                  {slot.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Button variant="primary" type="submit" className='w-100' disabled={error !== ''}>
            Schedule Appointment
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddAppointmentModal;
