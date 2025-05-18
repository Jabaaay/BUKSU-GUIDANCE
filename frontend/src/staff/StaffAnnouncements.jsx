import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Table,
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import StaffSidebar from './StaffSidebar';
import StaffAddAnnouncementModal from './StaffAddAnnouncementModal';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Swal from 'sweetalert2';
// Register Chart.js components
ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


// Mock data for appointments
const mockAppointments = [
  {
    id: 1,
    title: 'Counseling Workshop Schedule',
    content: 'Join our stress management workshop on May 25, 2025. Limited slots available!',
    image: 'https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
    date: '2025-05-17',
  },
  {
    id: 2,
    title: 'Guidance Services Update',
    content: 'Walk-in counseling sessions are available Monday to Friday, 8:00 AM - 5:00 PM. ',
    image: 'https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
    date: '2025-05-15',
  },
  {
    id: 2,
    title: 'Guidance Services Update',
    content: 'Walk-in counseling sessions are available Monday to Friday, 8:00 AM - 5:00 PM.',
    image: 'https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
    date: '2025-05-15',
  },
  {
    id: 2,
    title: 'Guidance Services Update',
    content: 'Walk-in counseling sessions are available Monday to Friday, 8:00 AM - 5:00 PM.',
    image: 'https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
    date: '2025-05-15',
  }
];


function StaffAnnouncements() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        // Here you would typically call your API to delete the announcement
        Swal.fire(
          'Deleted!',
          'Your announcement has been deleted.',
          'success'
        );
      }
    });
  };

  return (
    <div className="container-fluid">
      <Row> 
        {/* Sidebar Column */}
        <Col md={2} className="bg-primary text-white">
          <StaffSidebar />
        </Col>

                
                <Col>
                <div className="p-4 bg-white rounded justify-content-between d-flex align-items-center">
                  <h2 className="mb-4">Announcements</h2>
                  <Button
                    variant="primary"
                    onClick={() => setShowModal(true)}
                    className="mb-3"
                  >
                    <i className="bi bi-plus-circle me-2"></i>Post
                  </Button>
                  </div>
        
                  <Row>
                    {mockAppointments.map((announcement) => (
                      <Col md={6} lg={4} key={announcement.id} className="mb-4">
                        <Card>
                          <Card.Img
                            variant="top"
                            src={announcement.image}
                            className="rounded-top"
                            style={{ 
                              height: '400px',
                              width: '100%',
                              objectFit: 'cover',
                              display: 'block'
                            }}
                          />
                          <Card.Body>
                            <Card.Title>{announcement.title}</Card.Title>
                            <Card.Text>{announcement.content}</Card.Text>
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">
                                {new Date(announcement.date).toLocaleDateString()}
                              </small>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete(announcement.id)}
                              >
                                <i className="bi bi-trash me-1"></i>Delete
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Col>
        
              <StaffAddAnnouncementModal
                show={showModal}
                handleClose={() => setShowModal(false)}
              />
              </Row>
    </div>
  );
}

export default StaffAnnouncements;  