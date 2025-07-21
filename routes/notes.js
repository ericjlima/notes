var express = require('express');
var router = express.Router();
//var cors = require('cors');
var app = express();
var mysql = require('mysql2');
var sha256 = require('sha256');
var config = require('../config/secret.json');

var con = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
});

//router.use(cors({origin: "http://www.ericnote.us", credentials: true}));
//router.use(cors({origin: ["http://ericnote.us", "http://www.ericnote.us"], credentials: true}));
con.connect(function (err) {
  if (err) throw err;
});

//START OF AUTOSETUP

//var sql_users = `
//CREATE TABLE users (
//id INT AUTO_INCREMENT PRIMARY KEY,
//username VARCHAR(255) UNIQUE NOT NULL,
//email VARCHAR(255) UNIQUE NOT NULL,
//password_hash VARCHAR(255) NOT NULL,
//created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//);
//`;

//con.query(sql_users, function (err, result) {
//if (err) throw err;
//console.log("Users Table created");

//// Create the Notes table after the Users table
//var sql_notes = `
//CREATE TABLE notes (
//id INT AUTO_INCREMENT PRIMARY KEY,
//name VARCHAR(255),
//message LONGTEXT,
//date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
//date_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//private BOOLEAN DEFAULT FALSE,
//pid INT,
//namepid VARCHAR(255) UNIQUE NOT NULL,
//pin BOOLEAN DEFAULT FALSE,
//user_id INT,
//FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
//);
//`;
//});

//var sql = "CREATE TABLE sessions (session_id INT AUTO_INCREMENT PRIMARY KEY, expires TIMESTAMP, data VARCHAR(255))";
//con.query(sql, function (err, result) {
//if (err) throw err;
//console.log("Sessions Table created");
//});

//var sql = "INSERT IGNORE INTO notes (name, message, namepid) VALUES ?";
//var values = [
//['Day1', 'Writing1', 'Day1 0'],
//['Day2', 'Writing2', 'Day2 0'],
//['Day3', 'Writing3', 'Day3 0'],
//['Day4', 'Writing4', 'Day4 0'],
//['Day5', 'Writing5', 'Day5 0'],
//['Day6', 'Writing6', 'Day6 0'],
//['Day7', 'Writing7', 'Day7 0'],
//['Day8', 'Writing8', 'Day8 0'],
//['Day9', 'Writing9', 'Day9 0'],
//['Day10', 'Writing10', 'Day10 0'],
//['Day11', 'Writing11', 'Day11 0'],
//['Day12', 'Writing12', 'Day12 0'],
//['Day13', 'Writing13', 'Day13 0'],
//['Day14', 'Writing14', 'Day14 0']
//];
//con.query(sql, [values], function (err, result) {
//if (err) throw err;
//console.log("Number of records inserted: " + result.affectedRows);
//});

//var pw = "CREATE TABLE password (id INT AUTO_INCREMENT PRIMARY KEY, password VARCHAR(255))";
//con.query(pw, function (err, result) {
//if (err) throw err;
//console.log("password table made");
//});
//console.log('see', config.clientPassword);
//var p = `${"INSERT INTO password (password) VALUE('" + sha256(config.clientPassword) + "')"}`;//REMEMBER TO REMOVE WHEN DONE
//con.query(p, function(err, result){
//if(err) throw err;
//console.log('password errored');
//});

//END OF AUTO SETUP

//TRUNCATE TABLE password; // this lets you delete your password. A new one can be added after.
//INSERT INTO password(password) VALUE("fkajshdlkasd81173871273askljdhasdjh");
router.get('/', function (req, res, next) {
  con.query(
    'SELECT name FROM notes where pid = 0 OR pid IS NULL ORDER BY name',
    function (err, result, fields) {
      if (err) throw err;
      // console.log(result);
      res.json(result);
    },
  );
});

router.get('/publicNotes', function (req, res, next) {
  con.query(
    'SELECT name FROM notes where (pid = 0 OR pid IS NULL) AND private = 0 ORDER BY name',
    function (err, result, fields) {
      if (err) throw err;
      // console.log(result);
      res.json(result);
    },
  );
});

router.get('/pinNotes', function (req, res, next) {
  con.query(
    'SELECT name, namepid FROM notes where pin = true AND private = 0 ORDER BY name',
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    },
  );
});

router.get('/getPinNote/:currentNoteId', function (req, res, next) {
  con.query(
    `SELECT pin FROM notes where id = '${req.params.currentNoteId}'`,
    function (err, result, fields) {
      if (err) throw err;
      console.log('res', result);
      res.send(result);
    },
  );
});

router.get('/:notesId', function (req, res, next) {
  con.query(
    `con.query("SELECT name FROM notes where pid = 0 OR pid IS NULL ORDER BY name", function (err, result, fields) {
';`,
    function (err, result, fields) {
      //console.log('baseUrl', req.baseUrl);
      //console.log('path', req.path);
      //console.log('originalUrl', req.originalUrl);
      if (err) throw err;
      res.send(result);
    },
  );
});

router.get('/namepid/:notesName/:pid', function (req, res, next) {
  const namepid = `${req.params.notesName.toLowerCase()} ${req.params.pid}`;


  con.query(
    `SELECT id, name, message, date_created, date_modified, private, pid, namepid FROM notes 
            WHERE namepid='${namepid}';`,
    function (err, result, fields) {
      //console.log('req.params.notesName', req.params.notesName);
      //console.log('req.body.pid', req.params.pid);
      //console.log('result', result);
      //console.log('path', req.path);
      //console.log('originalUrl', req.originalUrl);
      if (err) throw err;
      res.send(result);
    },
  );
});

//retreivePathing
router.get('/retreivePathing/:id', function (req, res, next) {
  con.query(
    `SELECT namepid FROM notes 
            WHERE id='${req.params.id}';`,
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    },
  );
});

router.get('/children/:notesId', function (req, res, next) {
  con.query(
    `SELECT id, name, message, date_created, date_modified, private, pid FROM notes 
            WHERE pid='${req.params.notesId}';`,
    function (err, result, fields) {
      //console.log('req', req.params);
      //console.log('result', result);
      //console.log('path', req.path);
      //console.log('originalUrl', req.originalUrl);
      if (err) throw err;
      res.send(result);
    },
  );
});

router.post('/:notesId', function (req, res, next) {
  const { messageData, pid, routeUsername } = req.body;
  const { username: sessionUsername } = req.body.userCreds;
  const { notesId } = req.params;

  const name = notesId.toLowerCase();
  const namepid = `${notesId.toLowerCase()} ${pid}`; // ✅ Retain space at the end if required for compatibility

  // Step 1: Enforce route access control
  if (routeUsername !== '@' + sessionUsername) {
    return res.status(403).json({ message: 'You are not authorized to access this route.' });
  }

  // Step 2: Insert the new note (mimicking original SQL)
  const insertQuery = `
    INSERT IGNORE INTO notes (name, message, pid, namepid, username)
    VALUES (?, ?, ?, ?, ?)`;

  con.query(
    insertQuery,
    [name, messageData, pid, namepid, sessionUsername],
    function (insertError) {
      if (insertError) {
        console.log('Insert error:', insertError);
        return next(insertError);
      }

      return res.status(201).json({ message: 'Note created successfully.' });
    }
  );
});

router.post('/update/:notesId/:pid', function (req, res, next) {
  const { messageData, routeUsername } = req.body;
  const { username: sessionUsername } = req.body.userCreds;
  const { notesId, pid } = req.params;

  const namepid = `${notesId.toLowerCase()} ${pid}`;

  // Step 1: Enforce route access control
  if (routeUsername !== '@' + sessionUsername) {
    return res.status(403).json({ message: 'You are not authorized to access this route.' });
  }

  // Step 2: Try to update the note
  const updateQuery = `
    UPDATE notes
    SET message = ?
    WHERE namepid = ? AND username = ?;`;

  con.query(updateQuery, [messageData, namepid, sessionUsername], function (updateError, updateResults) {
    if (updateError) {
      console.log('Update error:', updateError);
      return next(updateError);
    }

    if (updateResults.affectedRows > 0) {
      // Note updated
      console.log('Note updated');
      return res.status(200).json({ message: 'Note updated successfully.' });
    }

  });
});
router.post('/updatePid/:notesId/:newPid/:id', function (req, res, next) {
  con.query(
    `UPDATE notes SET name='${req.params.notesId}', message='${req.body.messageData}', pid='${req.params.newPid}', namepid='${req.params.notesId} ${req.params.newPid}' WHERE id='${req.params.id}';`,
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    },
  );
});

router.post('/private/:notesId', function (req, res, next) {
  con.query(
    `UPDATE notes SET private='${
      req.body.isPrivateNote
    }' WHERE name='${req.params.notesId.toLowerCase()}';`,
    function (err, result, fields) {
      if (err) throw err;
      //console.log(req.body.privateMode);
      res.send(result);
    },
  );
});

router.delete('/:id', function (req, res, next) {
  //TODO: test this function especially after adding user defined notes and make sure only proper users can delete
  //console.log("deleted");
  //console.log(req.params.notesId);
  con.query(
    `DELETE FROM notes WHERE id='${req.params.id}'`,
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
      // 	console.log(req.params.notesID);
      // let sql = `DELETE FROM notes WHERE name='${req.params.notesId}'`;
      //  let query = con.query(sql);
    },
  );
});

router.post('/setpin/:namepid', function (req, res, next) {
  con.query(
    `UPDATE notes SET pin=NOT pin WHERE namepid='${req.params.namepid}';`,
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    },
  );
});

module.exports = router;
