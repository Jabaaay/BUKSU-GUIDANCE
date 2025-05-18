import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call the logout API
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post('http://localhost:5000/api/auth/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }

      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, we'll still clear the session
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  // Automatically logout when component mounts
  React.useEffect(() => {
    handleLogout();
  }, []);

  return null; // This component doesn't render anything
}

export default Logout;
