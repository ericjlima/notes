var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json([
    {id:1, username: "somebody1"},
    {id:2, username: "somebody2"},
    {id:3, username: "somebody3"},
    {id:4, username: "somebody4"},
    {id:5, username: "somebody5"},
  ]);
});

module.exports = router;
