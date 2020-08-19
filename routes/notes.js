var express = require('express');
var router = express.Router(); 
//var cors = require('cors');
var app = express();
var mysql = require('mysql');
var sha256 = require('sha256');
var config = require('../config/secret.json');

var con = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
});

//router.use(cors({origin: "http://www.ericnote.us", credentials: true}));
//router.use(cors({origin: ["http://ericnote.us", "http://www.ericnote.us"], credentials: true}));
con.connect(function(err) {
  if (err) throw err;
});

//START OF AUTOSETUP

//var sql = "CREATE TABLE notes (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), message VARCHAR(255), date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, date_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, private BOOLEAN, pid INT, namepid VARCHAR(255) UNIQUE NOT NULL)";
//con.query(sql, function (err, result) {
//if (err) throw err;
//console.log("Notes Table created");
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

//var sql = "CREATE TABLE subnotes (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), message VARCHAR(255), UNIQUE (name), date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, date_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, private BOOLEAN, note_id INT REFERENCES notes (id))";
//con.query(sql, function (err, result) {
//if (err) throw err;
//console.log("Table created");
//});

//var sql = "INSERT IGNORE INTO subnotes (name, message, note_id) VALUES ?";
//var values = [
//['subnotes1', 'thing1', 1],
//['Day2', 'thing2', 2],
//['Day3', 'thing3', 3]
//];
//con.query(sql, [values], function (err, result) {
//if (err) throw err;
//console.log("Number of records inserted: " + result.affectedRows);
//});

//var pw = "CREATE TABLE password (id INT AUTO_INCREMENT PRIMARY KEY, password VARCHAR(255))";
//con.query(pw, [values], function (err, result) {
//if (err) throw err;
//console.log("Number of records inserted: " + result.affectedRows);
//});
//var p = `${"INSERT INTO password (password) VALUE('" + sha256('lkjhasdf') + "')"}`;//REMEMBER TO REMOVE WHEN DONE
//con.query(p, function(err, result){
//if(err) throw err;
//console.log('password errored');
//});

//END OF AUTO SETUP

//TRUNCATE TABLE password; // this lets you delete your password. A new one can be added after.
//INSERT INTO password(password) VALUE("fkajshdlkasd81173871273askljdhasdjh");
router.get('/', function(req, res, next) {
  con.query("SELECT name FROM notes where pid = 0 OR pid IS NULL ORDER BY name", function (err, result, fields) {
    if (err) throw err;
    // console.log(result);
    res.json( result );
  });
});

router.get('/:notesId', function(req, res, next) {
  con.query(`SELECT n.id, n.name, n.message, n.date_created, n.date_modified, n.private, sn.name AS subnote_title FROM notes n
            LEFT JOIN subnotes sn ON n.id = sn.note_id
            WHERE n.name='${req.params.notesId.toLowerCase()}';`, function (err, result, fields) {
              //console.log('baseUrl', req.baseUrl);
              //console.log('path', req.path);
              //console.log('originalUrl', req.originalUrl);
              if (err) throw err;
              res.send(result);
            });
});

router.get('/namepid/:notesId/:pid', function(req, res, next) {
  con.query(`SELECT id, name, message, date_created, date_modified, private, pid, namepid FROM notes 
            WHERE namepid='${req.params.notesId} ${req.params.pid}';`, function (err, result, fields) {
              //console.log('req.params.notesId', req.params.notesId);
              //console.log('req.body.pid', req.params.pid);
              //console.log('result', result);
              //console.log('path', req.path);
              //console.log('originalUrl', req.originalUrl);
              if (err) throw err;
              res.send(result);
            });
});

router.get('/children/:notesId', function(req, res, next) {
  con.query(`SELECT id, name, message, date_created, date_modified, private, pid FROM notes 
            WHERE pid='${req.params.notesId}';`, function (err, result, fields) {
              //console.log('req', req.params);
              //console.log('result', result);
              //console.log('path', req.path);
              //console.log('originalUrl', req.originalUrl);
              if (err) throw err;
              res.send(result);
            });
});

router.post('/:notesId', function(req, res, next) {
  con.query(`INSERT IGNORE INTO notes (name, message, pid, namepid) VALUES ('${req.params.notesId.toLowerCase()}', '${req.body.messageData}', '${req.body.pid}', '${req.params.notesId} ${req.body.pid}')`, function (err, result, fields) {
    if (err) throw err;
    res.send(result)
    // console.log(result);
    // let sql = `INSERT IGNORE INTO notes (name, message) VALUES ('${req.params.notesId}', '')`;
    // let query = con.query(sql);
  });
});


router.post('/update/:notesId/:pid', function(req, res, next) {
  con.query(`UPDATE notes SET message='${req.body.messageData}' WHERE namepid='${req.params.notesId} ${req.params.pid}';`, function (err, result, fields) {
    //console.log('msgdata', req.body.messageData);
    //console.log('namepid', req.params.notesId + ' ' + req.params.pid);
    if (err) throw err;
    res.send(result)
  });
});


router.post('/private/:notesId', function(req, res, next) {
  con.query(`UPDATE notes SET private='${req.body.privateMode}' WHERE name='${req.params.notesId.toLowerCase()}';`, function (err, result, fields) {
    if (err) throw err;
    //console.log(req.body.privateMode);
    res.send(result)
  });
});

router.delete('/:notesId', function(req, res, next) {
  //console.log("deleted");
  //console.log(req.params.notesId);
  con.query(`DELETE FROM notes WHERE name='${req.params.notesId}'`, function (err, result, fields) {
    if (err) throw err;
    res.send(result);
    // 	console.log(req.params.notesID);
    // let sql = `DELETE FROM notes WHERE name='${req.params.notesId}'`;
    //  let query = con.query(sql);
  });
});

module.exports = router;
