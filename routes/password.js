var express = require('express');
var router = express.Router();
var session = require('express-session');
var md5 = require('md5');

var mysql = require('mysql2');

var con = mysql.createConnection({
  host: "localhost",
  user: "ericx2x",
  password: "water123",
  database: "mydb"
});

router.use(session({secret: 'iloveel89', resave: true, saveUninitialized: true, logged: false, cookie: { maxAge: 7200000 }}));

con.connect(function(err) {
  if (err) throw err;
});


router.post('/api/password', function(req, res, next) {
  con.query("SELECT * FROM password", function (err, result, fields) {
    if (err) throw err;

      const password_data = result.find(c => c.name === req.params.password);

      if (req.body.password === password_data.password){
        req.session.logged=true;
        res.send("logged");
      } else {
        res.send("error")
      }
  });
});

router.post('/api/password/:passwordEntered', function(req, res, next) {
  con.query("SELECT * FROM password", function (err, result, fields) {
    if (err) throw err;

      const password_data = result.find(c => c.name === req.params.password);
      if (md5(req.params.passwordEntered) === password_data.password){
        req.session.logged=true;
        res.send("logged");
      } else {
        res.send("error")
      }
  });
});

router.post('/api/logout', function(req, res, next) {
        req.session.logged=false;
        res.send("logged out");
      
});

router.get('/api/password', function(req, res, next) {
	con.query("SELECT * FROM password", function (err, result, fields) {
		if (err) throw err;

    let obj = {password: result[0].password, logged: req.session.logged};
   		res.json( obj );
    });
});

module.exports = router;
