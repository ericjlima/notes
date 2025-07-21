import React, { useState } from 'react';

const UserProfile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('User Profile Updated:', { username, email, password });
  };

  return (
    <div className="user-profile-container">
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit} className="user-profile-form">
        <div className="user-profile-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="user-profile-input"
          />
        </div>
        <div className="user-profile-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="user-profile-input"
          />
        </div>
        <div className="user-profile-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="user-profile-input"
          />
        </div>
        <button type="submit" className="user-profile-button">Update Profile</button>
      </form>
    </div>
  );
};

export default UserProfile;
