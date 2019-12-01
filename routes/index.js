var express = require('express');
var router = express.Router();
var cors = require('cors');

router.use(cors({origin: ["http://ericnote.us", "http://www.ericnote.us"], credentials: true}));
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
