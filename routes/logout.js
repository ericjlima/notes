const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mysql = require('mysql2');
const config = require('../config/secret.json');

const con = mysql.createConnection(config);
con.connect();

router.post('/', (req, res) => {
  const sessionToken = req.cookies.session_token;

  if (!sessionToken) return res.status(400).json({ error: 'No session token provided' });

  const deleteQuery = 'DELETE FROM sessions WHERE session_token = ?';
  con.query(deleteQuery, [sessionToken], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to log out' });

    res.clearCookie('session_token');
    return res.status(200).json({ message: 'Logout successful' });
  });
});

module.exports = router;
