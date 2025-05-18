import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../App.css'

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      // Store token and user data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Get user role from response
      const userRole = response.data.user.role;
      
      // Redirect based on user role
      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
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
                <h2 className="text-center mb-4 text-dark-blue">Login</h2>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <form onSubmit={handleLogin}>
                  <div className="mb-4">
                    <label htmlFor="username" className="form-label text-dark-blue">Username or Email</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="username" 
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label text-dark-blue">Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      id="password" 
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className='text-end mt-2 mb-4'>
                    <a href="/forgot-password" className='text-primary text-decoration-none'>Forgot Password?</a>
                  </div>
                  <div className="d-grid gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-primary rounded-0"
                      disabled={loading}
                      
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <button type="button" className="btn btn-danger rounded-0"><i className="bi bi-google me-2"></i> Sign in with Google</button>
                  
                  <div>
                    Don't have an account? <a href="/signup" className='text-primary text-decoration-none'>Sign Up</a>
                  </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
