import React, { useState } from 'react';
import {
  Modal,
  Form,
  Button,
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import Swal from 'sweetalert2';

function StaffAddAnnouncementModal({ show, handleClose }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
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
      // Here you would typically send the data to your backend
      // For now, we'll just show a success message
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to post announcement. Please try again.',
        confirmButtonColor: '#4e73df'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
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
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <Container className="mt-3">
                <Row>
                  <Col md={6}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="img-fluid rounded"
                      style={{ maxHeight: '300px', objectFit: 'cover' }}
                    />
                  </Col>
                </Row>
              </Container>
            )}
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Posting...' : 'Post Announcement'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default StaffAddAnnouncementModal;
