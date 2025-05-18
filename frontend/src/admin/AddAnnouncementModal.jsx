import React, { useState } from 'react';
import {
  Modal,
  Form,
  Button,
  Container,
  Row,
  Col,
  Image
} from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddAnnouncementModal({ show, handleClose }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please select an image file',
        confirmButtonColor: '#4e73df'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill in all required fields',
        confirmButtonColor: '#4e73df'
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Create form data
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (image) {
        formData.append('image', image, image.name);
      }

      console.log('Form data:', {
        title: formData.get('title'),
        content: formData.get('content'),
        image: image ? image.name : 'No image'
      });

      const response = await axios.post(
        'http://localhost:5000/api/announcements',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Server response:', response.data);

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Announcement has been posted!',
        confirmButtonColor: '#4e73df'
      });

      // Reset form
      setTitle('');
      setContent('');
      setImage(null);
      setImagePreview('');
      handleClose();
    } catch (error) {
      console.error('Error posting announcement:', error.response?.data);
      const errorMessage = error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to post announcement. Please try again.';
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonColor: '#4e73df'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Post Announcement</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter announcement title"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter announcement content"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Image (Optional)</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <Container className="mt-3">
                <Row>
                  <Col md={6}>
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fluid
                      rounded
                      style={{ maxHeight: '300px', objectFit: 'cover' }}
                    />
                  </Col>
                </Row>
              </Container>
            )}
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="ms-2"
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Post Announcement'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddAnnouncementModal;
