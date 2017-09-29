module.exports = function(io, passport){

    const express   = require('express'),
          router    = express.Router(),
          User      = require("../schemas/users");
          
    /*========================== PROFILE ==========================*/
          
    router.get('/profile', function(req, res, next) {
        res.render('index', { title: 'Express' });
    });
    
    /*=========================== LOGIN ===========================*/
    
    router.get('/login', function(req, res, next) {
        res.render('session/login', {
            title: 'Login',
            message: req.flash('loginMessage')
        });
    });
    
    router.get('/logout', function(req, res, next) {
        req.session.destroy(function(err) {
            if(err) throw err;
            res.redirect('/');
        });
    });
    
    router.post('/attempt-login', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    
    /*========================= REGISTER =========================*/
    
    router.get('/signup', function(req, res, next) {
        res.render('session/signup', {
            title: 'Sign Up',
            message: req.flash('signupMessage')
        });
    });
    
    router.post('/register', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    
    router.get('/password-reset', function(req, res, next) {
        res.render('session/passwordreset', { title: 'Password Reset' });
    });
          
    return router;

};
