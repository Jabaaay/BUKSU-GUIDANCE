import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../App.css'
import Swal from 'sweetalert2';

function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', {
        email
      });

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: response.data.message,
        showConfirmButton: false,
        timer: 3000
      }).then(() => {
        navigate('/login');
      });
    } catch (error) {
      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'An error occurred',
        showConfirmButton: false,
        timer: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card shadow-lg">
              <div className="card-body p-5">
                <h2 className="text-center mb-4 text-dark-blue">Forgot Password</h2>
                <div className='mb-2'>
                  <span>Enter your email address and we'll send you a new password.</span>
                </div>
                <form onSubmit={handleReset}>
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label text-dark-blue">Email Address</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      id="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="d-grid gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-primary rounded-0"
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : 'Send New Password'}
                    </button>
                  </div>
                </form>
                <div className='text-center mt-2'>
                  <a href="/login" className='text-primary text-decoration-none'>Back to Login</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
