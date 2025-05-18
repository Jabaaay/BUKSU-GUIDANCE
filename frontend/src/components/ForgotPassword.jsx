import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../App.css'

function ForgotPassword() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Add your login logic here
    console.log('Login attempted');
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
                  <span>Enter your email address and we'll send you a link to reset your password.</span>
                </div>
                <form onSubmit={handleLogin}>
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label text-dark-blue">Email Address</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      id="email" 
                    />
                  </div>
                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary rounded-0">Submit</button>
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
