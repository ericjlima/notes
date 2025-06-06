const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mysql = require('mysql');
const config = require('../config/secret.json');

const con = mysql.createConnection(config);
con.connect();

router.post('/', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) return res.status(400).json({ error: 'All fields required' });
  console.log('hit login0.5');

  const query = `SELECT * FROM users WHERE username = ?`;

  con.query(query, [username], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Server error' });

    if (results.length === 0) return res.status(401).json({ error: 'Invalid username or password' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) return res.status(401).json({ error: 'Invalid username or password' });

    // ✅ Generate session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

    const insertSession = `
      INSERT INTO sessions (user_id, session_token, expires_at)
      VALUES (?, ?, ?)
    `;
    con.query(insertSession, [user.id, sessionToken, expiresAt], (err) => {
      if (err) return res.status(500).json({ error: 'Failed to create session' });

  console.log('hit login3');
      // ✅ Set cookie (HTTP-only)
      res.cookie('session_token', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: expiresAt,
        sameSite: 'Lax',
      });

      return res.status(200).json({ message: 'Login successful' });
    });
  });
});

module.exports = router;
