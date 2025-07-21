const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const config = require('../config/secret.json');

// Create a MySQL connection
const con = mysql.createConnection(config);
con.connect();

// GET /api/search?query=...&userOnly=true/false
router.get('/', (req, res) => {
  const query = req.query.query || '';
  const userOnly = req.query.userOnly === 'true'; // Get the userOnly parameter
  const firstPathSegment = req.query.firstPathSegment || '';

  if (!query.trim()) {
    return res.json([]); // Empty query returns empty results
  }

  const sql = `
    SELECT id, name, message 
    FROM notes 
    WHERE LOWER(message) LIKE ? OR LOWER(name) LIKE ?
  `;

  const searchValue = `%${encodeURIComponent(query.toLowerCase())}%`;

  // If userOnly is true, filter by the current user
  if (userOnly) {
    const userPathSegment = firstPathSegment; // Get the user from the path
    const username = userPathSegment.startsWith('@')
      ? userPathSegment.slice(1)
      : userPathSegment;

    // Modify the SQL query to include a filter for the username
    const userSql = `
        SELECT id, name, message 
        FROM notes 
        WHERE (LOWER(message) LIKE ? OR LOWER(name) LIKE ?) AND username = ?
      `;

    con.query(userSql, [searchValue, searchValue, username], (err, results) => {
      if (err) {
        console.error('Search query failed:', err);
        return res.status(500).json({error: 'Database error'});
      }

      res.json(results);
    });
  } else {
    // Execute the query without user filtering
    con.query(sql, [searchValue, searchValue], (err, results) => {
      if (err) {
        console.error('Search query failed:', err);
        return res.status(500).json({error: 'Database error'});
      }

      res.json(results);
    });
  }
});

module.exports = router;
