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

// Main signup route
router.post('/', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user already exists
    const checkQuery = 'SELECT id FROM users WHERE username = ? OR email = ?';
    con.query(checkQuery, [username, email], (err, results) => {
      if (err) {
        console.error('Error checking user existence:', err);
        return res.status(500).json({ error: 'Server error.' });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: 'User already exists.' });
      }

      // Insert new user
      const insertQuery = 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)';
      con.query(insertQuery, [username, email, hashedPassword], (err, insertResult) => {
        if (err) {
          console.error('Error inserting user:', err);
          return res.status(500).json({ error: 'Server error.' });
        }

        return res.status(201).json({ message: 'User created successfully.' });
      });
    });
  } catch (err) {
    console.error('Bcrypt error:', err);
    return res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
