var express = require('express');
var router = express.Router();
var mysql = require('mysql2');
var bcrypt = require('bcrypt');
var config = require('../config/secret.json');

// Set up MySQL connection
var con = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
});

con.connect(function (err) {
  if (err) {
    console.error('MySQL connection error:', err);
    throw err;
  }
  console.log('Connected to MySQL');
});

// Change password route
router.post('/', async (req, res) => {
  console.log('changepassword route', req.body);
  const { oldPassword, newPassword, userId } = req.body;

  console.log('userId', userId);

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Both old and new passwords are required.' });
  }

  try {
    // Fetch the user's current password hash from the database
    const userQuery = 'SELECT password_hash FROM users WHERE id = ?';
    con.query(userQuery, [userId], async (err, results) => {
      if (err) {
        console.error('Error fetching user:', err);
        return res.status(500).json({ error: 'Server error.' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found.' });
      }

      const user = results[0];

      // Check if the old password matches the stored hash
      const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
      if (!isMatch) {
        return res.status(400).json({ error: 'Old password is incorrect.' });
      }

      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password in the database
      const updateQuery = 'UPDATE users SET password_hash = ? WHERE id = ?';
      con.query(updateQuery, [hashedNewPassword, userId], (err, updateResult) => {
        if (err) {
          console.error('Error updating password:', err);
          return res.status(500).json({ error: 'Server error.' });
        }

        return res.json({ message: 'Password changed successfully.' });
      });
    });
  } catch (err) {
    console.error('Bcrypt error:', err);
    return res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
