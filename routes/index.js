var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('session/login', { title: 'Login' });
});

router.get('/signup', function(req, res, next) {
  res.render('session/signup', { title: 'Login' });
});


module.exports = router;
