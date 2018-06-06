var express = require('express');
var router = express.Router();
var session = require('express-session');

var mysql = require('mysql2');

var con = mysql.createConnection({
  host: "localhost",
  user: "ericx2x",
  password: "water123",
  database: "mydb"
});

router.use(session({secret: 'iloveel89', resave: true, saveUninitialized: true, logged: false, cookie: { maxAge: 3600000 }}));
//TODO: see if you can get sessionid console logged in front end of password. make a third column field next to password that is sessionID. Then make it equal to req.session.id




con.connect(function(err) {
  if (err) throw err;
});


router.post('/api/password', function(req, res, next) {
  console.log("req.body.password");
  console.log(req.body.password);
     console.log('session');
    console.log(req.session.id);
  // console.log(req.params.password);
  con.query("SELECT * FROM password", function (err, result, fields) {
    if (err) throw err;
    // console.log(req.session.cookie.test)
    // console.log(result);
      const password_data = result.find(c => c.name === req.params.password);
      if (req.body.password === password_data.password){
        console.log("boom");
        req.session.logged=true;
        console.log(req.session.logged);
        res.send("logged");
      }else{
        // req.session.logged=false;
        console.log(req.session.logged);
        res.send("error")
      }
  });
  // res.send("error");
});


router.get('/api/password', function(req, res, next) {
	con.query("SELECT * FROM password", function (err, result, fields) {
		if (err) throw err;
    console.log("cookie logged?");
    console.log(req.session.logged);
 
  //   console.log("password");
  //   console.log(req.session.id);
		// console.log(result[0].password);
	
  // con.query("SELECT * FROM notes", function (err, result, fields) {
  //       if (err) throw err;
  //       // console.log(result);

  //       let sql = `UPDATE notes SET message='${req.params.notesMessage}' WHERE name='${req.params.notesId}';`;
  //         let query = con.query(sql);
  //   });

    let obj = {password: result[0].password, logged: req.session.logged};
   		res.json( obj );
    });
});



// router.get('/api/password/:password', function(req, res, next) {
// 	con.query("SELECT * FROM password", function (err, result, fields) {
// 		if (err) throw err;
//     console.log("password")
//     // console.log(req.session.cookie.test)
// 		console.log(result);
//   	const password_data = result.find(c => c.name === req.params.password);
  
//   	res.send(password_data);
// 	});
// });


module.exports = router;
