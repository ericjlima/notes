var express = require('express');
var router = express.Router();
var mysql = require('mysql2');
var cors = require('cors');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();

router.use(cors());

app.set('views', "/views");
// app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// router.use(session({secret: 'iloveel89', cookie: { maxAge: 60000, test: "testicles"  }}));

var con = mysql.createConnection({
  host: "localhost",
  user: "ericx2x",
  password: "water123",
  database: "mydb"
});


con.connect(function(err) {
  if (err) throw err;
});

router.post(`/api/login`, function(req, res, next) {
	// console.log("res");
	// console.log(res.session);
	console.log("req")
	req.session.test = "test";
	console.log(req.session.id);
	console.log(req.session.test);
	// req.session.email = req.body.email;
	// req.session.password = req.body.password;
	let obj = {email: req.body.email, password: req.body.password}
	res.send(obj);
	// con.query("SELECT * FROM notes", function (err, result, fields) {
	// 		if (err) throw err;
	// 		// console.log(result);
	// 	let sql = `INSERT IGNORE INTO notes (name, message) VALUES ('${req.params.notesId}', '')`;
	//   	let query = con.query(sql);
 //  	});
});


router.get('/api/login', function(req, res, next) {
		// if (err) throw err;
		if(req.session.email){
			res.redirect("/logged");
		} else {
			res.render("index")
		}
});

router.get('/api/logged', function(req, res, next) {
		if (err) throw err;
		if(req.session.email){
			res.write( "<h1>Logged</h1><a href='/logout'>Logout</a>" );
			res.end();
		}
});


router.get(`/api/password`, function(req, res, next) {
	con.query("SELECT * FROM password", function (err, result, fields) {
		if (err) throw err;
		console.log(result);

   		res.json( result );
    });
});

router.get(`/api/password/:password`, function(req, res, next) {
	con.query("SELECT * FROM password", function (err, result, fields) {
		if (err) throw err;
		console.log(result);
  		const password_data = result.find(c => c.name === req.params.password);

  		res.send(password_data);
	});
});


module.exports = router;