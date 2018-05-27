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

	router.get('/api/password', function(req, res, next) {
		con.query("SELECT * FROM password", function (err, result, fields) {
			if (err) throw err;
			console.log(result);
		
	   		res.json( result );
	    });
	});



	router.get('/api/password/:password', function(req, res, next) {
		con.query("SELECT * FROM password", function (err, result, fields) {
			if (err) throw err;
			console.log(result);
	  		const password_data = result.find(c => c.name === req.params.password);
	  
	  		res.send(password_data);
		});
	});


module.exports = router;
