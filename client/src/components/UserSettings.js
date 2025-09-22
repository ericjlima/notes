import React, {useEffect, useState, useContext} from 'react';
import axios from 'axios';
import {AuthenticatedContext} from '../App';

const UserSettings = props => {
  const [notes, setNotes] = useState([]);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(0);
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [theme, setTheme] = useState('light');
  const {Authenticated} = useContext(AuthenticatedContext);

  console.log('props', props);
  console.log('creds', props.userCreds);

  useEffect(() => {
    if (Authenticated) {
      fetch(`${props.baseURL}/api/notes`)
        .then(res => res.json())
        .then(resnotes => {
          setNotes(resnotes);
        });
    } else {
      fetch(`${props.baseURL}/api/notes/publicNotes`)
        .then(res => res.json())
        .then(resnotes => {
          setNotes(resnotes);
        });
    }
  }, [Authenticated]);

  useEffect(() => {
    if (props.userCreds && props.userCreds.username) {
      setUsername(props.userCreds.username);
    }
    if (props.userCreds && props.userCreds.id) {
      setUserId(props.userCreds.id);
    }
    if (props.userCreds && props.userCreds.email) {
      setEmail(props.userCreds.email);
    }
  }, [props.userCreds]);

  const handleSubmit = async e => {
    e.preventDefault();

    // Validate new password and confirmation
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match.');
      return;
    }

    try {
      const response = await axios.post(
        `${props.baseURL}/api/password`,
        {
          oldPassword,
          newPassword,
          userId,
        },
      );

      console.log('response', response);

      if (response.status === 200) {
        alert('Password changed successfully!');
        // Optionally reset the password fields
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        alert('Error changing password: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('An error occurred while changing the password.');
    }

    console.log({
      username,
      email,
      emailNotifications,
      theme,
    });
  };

  return (
    <div style={{padding: '20px'}}>
      <h1>User Settings</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Old Password:
            <input
              type="password"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            New Password:
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Confirm New Password:
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Email Notifications:
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={e => setEmailNotifications(e.target.checked)}
            />
          </label>
        </div>
        <div>
          <label>
            Theme:
            <select value={theme} onChange={e => setTheme(e.target.value)}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </div>
        <button type="submit">Save Settings</button>
      </form>
    </div>
  );
};

export default UserSettings;
