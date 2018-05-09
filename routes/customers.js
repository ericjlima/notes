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
  con.query("SELECT * FROM customers", function (err, result, fields) {
    if (err) throw err;
    console.log(result);

	/* GET users listing. */
	router.get('/customers', function(req, res, next) {
	  res.json( result );
	});

	router.get('/customers/:customersId', function(req, res, next) {
	  // res.send(req.params.customersId);
	  const customer = result.find(c => c.id === parseInt(req.params.customersId));
	  if(!customer) res.status(404).send("Error the customer was not found.");
	  res.send(customer);
	});
  });
});


module.exports = router;
