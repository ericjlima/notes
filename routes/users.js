var express = require('express');
var router = express.Router();

//you don't make a route to /groceries, you make a route to /:noteTitle and then use that parameter to open the appropriate note (or create it if needed)
// https://expressjs.com/en/guide/routing.html#route-parameters


/* GET users listing. */
router.get('/users', function(req, res, next) {
  res.json([
    {id:1, username: "somebody1"},
    {id:2, username: "somebody2"},
    {id:3, username: "somebody3"},
    {id:4, username: "somebody4"},
    {id:5, username: "somebody5"},
  ]);
});
//returns the above json


router.get('/users/:usersId', function(req, res, next) {
  res.send(req.params);
});
//returns { "usersId": "2" } and not { username: "somebody2"}
//How do I write my code to return somebody 2 instead?

module.exports = router;