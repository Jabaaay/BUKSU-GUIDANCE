// Update Logout.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call the logout API
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await axios.post('http://localhost:5000/api/auth/logout', {}, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        } catch (apiError) {
          console.error('API logout error:', apiError);
        }
      }

      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'You have been successfully logged out',
        showConfirmButton: false,
        timer: 1500
      });

      // Redirect to login page
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      
      // Clear localStorage even if there was an error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Logout Error',
        text: 'An error occurred during logout',
        showConfirmButton: false,
        timer: 1500
      });
      
      // Redirect to login page
      navigate('/login', { replace: true });
    }
  };

  // Automatically logout when component mounts
  React.useEffect(() => {
    handleLogout();
  }, []);

  return null;
}

export default Logout;