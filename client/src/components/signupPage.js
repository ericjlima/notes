import React, { useState } from 'react';
import axios from 'axios';

const SignupPage = props => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      setMessage('Please fill in all fields.');
      return;
    }

    try {
      const res = await axios.post(
        `${props.baseURL}/api/signup`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.status === 201) {
        setMessage('Signup successful!');
      } else {
        setMessage(res.data.error || 'Signup failed.');
      }
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.error || 'Signup failed.');
      } else {
        setMessage('Error connecting to server.');
      }
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="signup-input"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="signup-input"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="signup-input"
        />
        <button type="submit" className="signup-button">Sign Up</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SignupPage;
