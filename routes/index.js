var express = require('express'),
    router  = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
    res.render('session/login', { title: 'Login' });
});

router.get('/signup', function(req, res, next) {
    res.render('session/signup', { title: 'Sign Up' });
});

router.get('/password-reset', function(req, res, next) {
    res.render('session/passwordreset', { title: 'Password Reset' });
});

module.exports = router;
