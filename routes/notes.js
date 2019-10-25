var express = require('express');
var router = express.Router();
var cors = require('cors');
var app = express();
var mysql = require('mysql');
var sha256 = require('sha256');



var con = mysql.createConnection({
  host: "localhost",
  user: "ericx2x",
  password: "water123",
  database: "mydb"
});

//router.use(cors({origin: "http://www.ericnote.us", credentials: true}));
router.use(cors({origin: ["http://ericnote.us", "http://www.ericnote.us"], credentials: true}));
con.connect(function(err) {
  if (err) throw err;
});

// var sql = "CREATE TABLE notes (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), message VARCHAR(255), UNIQUE (name), date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, date_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, private BOOLEAN)";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("Table created");
// });
//CREATE TABLE sessions (session_id INT AUTO_INCREMENT PRIMARY KEY, expires TIMESTAMP, data VARCHAR(255));

// var sql = "INSERT IGNORE INTO notes (name, message) VALUES ?";
// var values = [
// ['Day1', 'Writing1'],
// ['Day2', 'Writing2'],
// ['Day3', 'Writing3'],
// ['Day4', 'Writing4'],
// ['Day5', 'Writing5'],
// ['Day6', 'Writing6'],
// ['Day7', 'Writing7'],
// ['Day8', 'Writing8'],
// ['Day9', 'Writing9'],
// ['Day10', 'Writing10'],
// ['Day11', 'Writing11'],
// ['Day12', 'Writing12'],
// ['Day13', 'Writing13'],
// ['Day14', 'Writing14']
// ];
// con.query(sql, [values], function (err, result) {
// if (err) throw err;
// console.log("Number of records inserted: " + result.affectedRows);
// });

// var pw = "CREATE TABLE password (id INT AUTO_INCREMENT PRIMARY KEY, password VARCHAR(255))";
// con.query(pw, [values], function (err, result) {
// if (err) throw err;
// console.log("Number of records inserted: " + result.affectedRows);
// });
// var p = `${"INSERT INTO password (password) VALUE('" + sha256('') + "')"}`;//REMEMBER TO REMOVE WHEN DONE
// con.query(p, function(err, result){
// 	if(err) throw err;
// 	console.log('password errored');
// });

//TRUNCATE TABLE password; // this lets you delete your password. A new one can be added after.
//INSERT INTO password(password) VALUE("fkajshdlkasd81173871273askljdhasdjh");
	router.get('/', function(req, res, next) {
		con.query("SELECT name FROM notes", function (err, result, fields) {
			if (err) throw err;
			// console.log(result);
	   		res.json( result );
	    });
	});

	router.get('/:notesId', function(req, res, next) {
		con.query(`SELECT * FROM notes WHERE name='${req.params.notesId.toLowerCase()}';`, function (err, result, fields) {
			if (err) throw err;
			console.log(result);
	  		const note = result.find(c => c.name === req.params.notesId);
	  		//Is the above line necessary? Can reduce this?
			
	  		res.send(note);
		});
	});

	router.post('/:notesId', function(req, res, next) {
		con.query(`INSERT IGNORE INTO notes (name, message) VALUES ('${req.params.notesId.toLowerCase()}', '')`, function (err, result, fields) {
				if (err) throw err;
				// console.log(result);
				// let sql = `INSERT IGNORE INTO notes (name, message) VALUES ('${req.params.notesId}', '')`;
		  		// let query = con.query(sql);
	  	});
	});

	router.post('/update/:notesId', function(req, res, next) {
		con.query(`UPDATE notes SET message='${req.body.messageData}' WHERE name='${req.params.notesId.toLowerCase()}';`, function (err, result, fields) {
				if (err) throw err;
		});
	});

	router.post('/private/:notesId', function(req, res, next) {
		con.query(`UPDATE notes SET private='${req.body.privateMode}' WHERE name='${req.params.notesId.toLowerCase()}';`, function (err, result, fields) {
            if (err) throw err;
			console.log(req.body.privateMode);
		});
	});

	router.delete('/:notesId', function(req, res, next) {
		//console.log("deleted");
		//console.log(req.params.notesId);
		con.query(`DELETE FROM notes WHERE name='${req.params.notesId}'`, function (err, result, fields) {
				if (err) throw err;
			// 	console.log(req.params.notesID);
			// let sql = `DELETE FROM notes WHERE name='${req.params.notesId}'`;
		 	//  let query = con.query(sql);
	  	});
	});

module.exports = router;
