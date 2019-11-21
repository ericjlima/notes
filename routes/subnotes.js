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
                res.json( result );
    });
});

router.get('/:notesId/:subnotesId', function(req, res, next) {
        con.query(`SELECT sn.name AS subnote_title, sn.message, sn.date_created, sn.date_modified, n.name FROM notes n
                   JOIN subnotes sn ON n.id = sn.note_id
                   WHERE sn.name = '${req.params.subnotesId}';

                   `, function (err, result, fields) {
                if (err) throw err;
                res.send(result[0]);
        });
});

router.get('/:subnotesId', function(req, res, next) {
    con.query(`SELECT * FROM subnotes WHERE name='${req.params.subnotesId.toLowerCase()}';`, function (err, result, fields) {
        if (err) throw err;
        res.send(result[0]);
    });
});

router.post('/update/:subnotesId', function(req, res, next) {
        con.query(`UPDATE subnotes SET message='${req.body.messageData}' WHERE name='${req.params.subnotesId.toLowerCase()}';`, function (err, result, fields) {
                        if (err) throw err;
        });
});

router.post('/:subnotesId/:thenoteId', function(req, res, next) {
        con.query(`INSERT IGNORE INTO subnotes (name, message, note_id) VALUES ('${req.params.subnotesId.toLowerCase()}', '', '${req.params.thenoteId}')`, function (err, result, fields) {
                        if (err) throw err;

        });
});
module.exports = router;
