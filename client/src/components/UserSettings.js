import React, {useEffect, useState, useContext} from 'react';
import axios from 'axios';
import {AuthenticatedContext} from '../App';

const UserSettings = props => {
  const [notes, setNotes] = useState([]);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [theme, setTheme] = useState('light');
  const {Authenticated} = useContext(AuthenticatedContext);

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

  const handleSubmit = e => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      username,
      displayName,
      password,
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
            Display Name:
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
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
