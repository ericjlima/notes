//TODO: DELETE this file or move over login /me route here.. ask ai which is best.

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const mysql = require('mysql2');
const config = require('../config/secret.json');

const con = mysql.createConnection({
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
  console.log('Connected to MySQL (sessions route)');
});

// Route to check session status
router.get('/status', (req, res) => {
  const token = req.cookies.session_token;
  if (!token) return res.status(401).json({ loggedIn: false });

  const query = 'SELECT * FROM sessions WHERE session_token = ? AND expires_at > NOW()';
  con.query(query, [token], (err, results) => {
    if (err) return res.status(500).json({ error: 'Server error.' });
    if (results.length === 0) return res.status(401).json({ loggedIn: false });

    return res.json({ loggedIn: true, userId: results[0].user_id });
  });
});

module.exports = router;
