import React, {useEffect, useState, useContext} from 'react';
import axios from 'axios';
import {AuthenticatedContext, SettingsContext} from '../App';

const UserSettings = props => {
  const [notes, setNotes] = useState([]);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(0);
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const {theme, setTheme} = useContext(SettingsContext);
  const {Authenticated} = useContext(AuthenticatedContext);

  useEffect(() => {
    if (Authenticated) {
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
    if (props.userCreds && props.userCreds.theme) {
      setEmail(props.userCreds.theme);
    }
  }, [props.userCreds]);

  const onSaveTheme = async newTheme => {
    setTheme(newTheme);
  };

  // if you have an input handler:
  const handleThemeSelect = async (e, userId) => {
    console.log('userCreds', props.userCreds);
    const newTheme = e.target.value;
    onSaveTheme(newTheme);
    try {
      const response = await axios.post(`${props.baseURL}/api/theme`, {
        userId,
        theme: newTheme, // Pass new theme to the API
      });

      console.log(response.data); // Log the response
    } catch (error) {
      console.error('Error updating theme:', error.message);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Validate new password and confirmation
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match.');
      return;
    }

    try {
      const response = await axios.post(`${props.baseURL}/api/password`, {
        oldPassword,
        newPassword,
        userId,
      });

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

    try {
    } catch (error) {}

    console.log({
      username,
      email,
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
        <button type="submit">Save Settings</button>
        <div>
          <label>
            Theme:
            <select value={theme} onChange={e => handleThemeSelect(e, userId)}>
              <option value="light">Light</option>
              /*<option value="dark">Dark</option>*/
              <option value="fantasy">Fantasy</option>
            </select>
          </label>
          {theme}
        </div>
      </form>
    </div>
  );
};

export default UserSettings;
