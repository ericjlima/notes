var express = require('express');
var router = express.Router();

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "ericx2x",
  password: "water123",
  database: "mydb"
});


con.connect(function(err) {
  if (err) throw err;
});

// var sql = "CREATE TABLE notes (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), message VARCHAR(255), UNIQUE (name))";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("Table created");
// });

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



con.query("SELECT * FROM notes", function (err, result, fields) {
	if (err) throw err;
	console.log(result);

	router.get('/api/notes', function(req, res, next) {
	  res.json( result );
	});

	router.get('/api/notes/:notesId', function(req, res, next) {
	  const note = result.find(c => c.name === req.params.notesId);
	  
	  res.send(note);
	});

	router.post('/api/notes/:notesId', function(req, res, next) {
		let sql = `INSERT IGNORE INTO notes (name, message) VALUES ('${req.params.notesId}', 'Lorem Ipsum')`;
	  	let query = con.query(sql);
	});

	router.put('/api/notes/:notesId/:notesMessage', function(req, res, next) {
		let sql = `UPDATE notes SET message='${req.params.notesMessage}' WHERE name='${req.params.notesId}';`;
	  	let query = con.query(sql);

	});
});

module.exports = router;
