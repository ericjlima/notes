var express = require('express');
var router = express.Router();
var cors = require('cors');
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

router.get('/', function(req, res, next) {
        con.query("SELECT name FROM subnotes", function (err, result, fields) {
                if (err) throw err;
                // console.log(result);
                res.json( result );
    });
});

router.get('/:subnotesId', function(req, res, next) {
    con.query(`SELECT * FROM subnotes WHERE name='${req.params.subnotesId.toLowerCase()}';`, function (err, result, fields) {
        if (err) throw err;
        res.send(result[0]);
    });
});
module.exports = router;
