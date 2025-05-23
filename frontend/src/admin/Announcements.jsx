import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Image
} from 'react-bootstrap';
import AdminSidebar from '../components/AdminSidebar';
import AddAnnouncementModal from './AddAnnouncementModal';
import EditAnnouncementModal from './EditAnnouncementModal';
import Swal from 'sweetalert2';
import axios from 'axios';

function Announcements() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/announcements',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch announcements',
        confirmButtonColor: '#4e73df'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      
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
        await axios.delete(
          `http://localhost:5000/api/announcements/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Announcement has been deleted.',
          confirmButtonColor: '#4e73df'
        });

        fetchAnnouncements();
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to delete announcement',
        confirmButtonColor: '#4e73df'
      });
    }
  };

  const handleEdit = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
        <div className="spinner-border text-primary" role="status" style={{ width: '5rem', height: '5rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  

  return (
    <div className="container-fluid">
      <Row>
      <Col md={2} className="bg-primary text-white">
                <AdminSidebar />
              </Col>
      <Col>
        <Container className="py-4">
          <Row className="mb-4">
            <Col>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Announcements</h2>
                <Button variant="primary" onClick={() => setShowAddModal(true)}>
                  Post
                </Button>
              </div>

              <Row className="g-4">
                {announcements.filter(announcement => announcement.author.role === 'admin').map((announcement) => (
                  <Col xs={12} sm={6} md={4} lg={3} key={announcement._id}>
                    <Card className="h-100">
                      <Card.Body>
                        {announcement.image && (
                          <Image
                            src={`http://localhost:5000${announcement.image}`}
                            alt={announcement.title}
                            fluid
                            rounded
                            className="mb-3"
                            style={{ maxHeight: '', objectFit: 'cover' }}
                          />
                        )}
                        <Card.Title className="mb-2">{announcement.title}</Card.Title>
                        <Card.Text className="mb-3">{announcement.content}</Card.Text>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            {new Date(announcement.createdAt).toLocaleDateString()}
                          </small>
                          <div>
                            <Button
                              variant="warning"
                              size="sm"
                              onClick={() => handleEdit(announcement)}
                              className="me-2"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(announcement._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>

          <AddAnnouncementModal
            show={showAddModal}
            handleClose={() => setShowAddModal(false)}
            onAnnouncementCreated={fetchAnnouncements}
          />

          <EditAnnouncementModal
            show={showEditModal}
            handleClose={() => {
              setShowEditModal(false);
              setSelectedAnnouncement(null);
            }}
            announcement={selectedAnnouncement}
            onAnnouncementUpdated={fetchAnnouncements}
          />
        </Container>
      </Col>
      </Row>
    </div>
  );
}

export default Announcements;