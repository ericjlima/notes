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

con.query("SELECT * FROM customers", function (err, result, fields) {
	if (err) throw err;
	console.log(result);

	/* GET users listing. */
	router.get('/customers', function(req, res, next) {
	  res.json( result );
	});

	router.get('/customers/:customersId', function(req, res, next) {
	  const customer = result.find(c => c.name === req.params.customersId);
	  console.log("customer: ");
	  console.log(customer);
	  
	  res.send(customer);
	});

	router.post('/customers/:customersId', function(req, res, next) {
		let sql = `INSERT IGNORE INTO customers (name, address) VALUES ('${req.params.customersId}', 'Lorem Ipsum')`;
	  	let query = con.query(sql);
	});

	router.put('/customers/:customersId/:customersMessage', function(req, res, next) {
	

		let sql = `UPDATE customers SET address='${req.params.customersMessage}' WHERE name='${req.params.customersId}';`;
	  	let query = con.query(sql);
	  	
	});

});

module.exports = router;
