var express = require('express');
var router = express.Router();
var mysql = require('mysql2');
var bcrypt = require('bcrypt');
var config = require('../config/secret.json');

// Set up MySQL connection
var con = mysql.createConnection({
  host: config.host,
  user: config.user,
  theme: config.theme,
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

// Change theme route
router.post('/', async (req, res) => {
  console.log('change theme route', req.body);
  const {userId, theme} = req.body; // Get userId and theme from the request body
  console.log('userId', userId);

  // Update the theme for the user
  con.query(
    `UPDATE users SET theme = ? WHERE id = ?`,
    [theme, userId], // Use parameterized queries to prevent SQL injection
    function (err, result) {
      if (err) {
        console.error('Error updating theme:', err);
        return res
          .status(500)
          .send({message: 'An error occurred while updating the theme'});
      }
      if (result.affectedRows === 0) {
        return res.status(404).send({message: 'User not found'});
      }
      // Send a success response
      res.send({message: 'Theme updated successfully'});
    },
  );
});



// Get theme route
router.get('/:userId/theme', (req, res) => {
  const userId = req.params.userId;

  // Retrieve the theme for the user
  con.query(
    `SELECT theme FROM users WHERE id = ?`,
    [userId], // Use parameterized queries to prevent SQL injection
    function (err, result) {
      if (err) {
        console.error('Error retrieving theme:', err);
        return res.status(500).send({ message: 'An error occurred while retrieving the theme' });
      }

      if (result.length === 0) {
        return res.status(404).send({ message: 'User not found' });
      }

      const theme = result[0].theme;

      if (!theme) {
        // Handle case where the user has no theme set
        return res.status(200).send({ theme: 'default' }); // Set 'default' as a fallback
      }

      // Return the theme to the client
      res.status(200).send({ theme });
    }
  );


});


module.exports = router;
