import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const collegeCourses = {
  COT: [
    "Bachelor of Science in Information Technology",
    "Bachelor of Science in Entertainment and Multimedia Computing major in Digital Animation Technology Game Development",
    "Bachelor of Science in Automotive Technology",
    "Bachelor of Science in Electronics Technology",
    "Bachelor of Science in Food Technology"
  ],
  CAS: [
    "Bachelor of Science in Biology Major in Biotechnology",
    "Bachelor of Arts in English Language",
    "Bachelor of Arts in Economics",
    "Bachelor of Arts in Sociology",
    "Bachelor of Arts in Philosophy",
    "Bachelor of Arts in Social Science",
    "Bachelor of Science in Mathematics",
    "Bachelor of Science in Community Development",
    "Bachelor of Science in Development Communication"
  ],
  CPAG: ["Bachelor of Public Administration Major in Local Governance"],
  CON: ["Bachelor of Science in Nursing"],
  COE: [
    "Bachelor of Elementary Education",
    "Bachelor of Secondary Education Major in Mathematics",
    "Bachelor of Secondary Education Major in Filipino",
    "Bachelor of Secondary Education Major in English",
    "Bachelor of Secondary Education Major in Social Studies",
    "Bachelor of Secondary Education, Major in Science",
    "Bachelor of Early Childhood Education",
    "Bachelor of Physical Education"
  ],
  COB: [
    "Bachelor of Science in Accountancy",
    "Bachelor of Science in Business Administration Major in Financial Management",
    "Bachelor of Science in Hospitality Management"
  ],
  COL: ["Bachelor of Law (Juris Doctor)"]
};

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    birthday: '',
    age: '',
    college: '',
    course: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableCourses, setAvailableCourses] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update available courses when college changes
    if (name === 'college') {
      setAvailableCourses(collegeCourses[value] || []);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        ...formData,
        username: formData.firstName.toLowerCase() + '.' + formData.lastName.toLowerCase(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email.toLowerCase(),
        password: formData.password,
        birthday: formData.birthday,
        age: parseInt(formData.age),
        college: formData.college,
        course: formData.course
      });

      console.log('Registration successful:', response.data);
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="col-md-6 col-xl-4">
        <div className="card shadow">
          <div className="card-body">
            <h2 className="card-title text-center mb-4 text-dark-blue">Sign Up</h2>
            
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* First Name */}
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label text-dark-blue">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Last Name */}
              <div className="mb-3">
                <label htmlFor="lastName" className="form-label text-dark-blue">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label text-dark-blue">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label text-dark-blue">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                />
              </div>

              {/* Birthday */}
              <div className="mb-3 d">
                <label htmlFor="birthday" className="form-label text-dark-blue">Birthday</label>
                <input
                  type="date"
                  className="form-control"
                  id="birthday"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Age */}
              <div className="mb-3">
                <label htmlFor="age" className="form-label text-dark-blue">Age</label>
                <input
                  type="number"
                  className="form-control"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="18"
                  max="100"
                />
              </div>

              {/* College */}
              <div className="mb-3">
                <label htmlFor="college" className="form-label text-dark-blue">College</label>
                <select
                  className="form-select"
                  id="college"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select College</option>
                  <option value="COT">College of Technology</option>
                  <option value="CAS">College of Arts and Sciences</option>
                  <option value="CPAG">College of Public Administration and Governance</option>
                  <option value="CON">College of Nursing</option>
                  <option value="COE">College of Education</option>
                  <option value="COB">College of Business</option>
                  <option value="COL">College of Law</option>
                </select>
              </div>

              {/* Course */}
              <div className="mb-3">
                <label htmlFor="course" className="form-label text-dark-blue">Course</label>
                <select
                  className="form-select"
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                  disabled={!formData.college}
                >
                  <option value="">Select Course</option>
                  {availableCourses.map((course, index) => (
                    <option key={index} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>

              <div className="d-grid gap-2">
                <button 
                  type="submit" 
                  className="btn btn-primary rounded-0" 
                  disabled={loading}
                >
                  {loading ? 'Creating account...' : 'Sign Up'}
                </button>
                <span>Already have an account? <a href="/login" className='text-primary text-decoration-none'>Login</a></span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
