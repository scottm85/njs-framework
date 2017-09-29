module.exports = function(io, passport){
    const express   = require('express'),
          router    = express.Router(),
          User      = require("../schemas/users");

    router.get('/', function(req, res, next) {
        if(!req.session.user) res.redirect('/login');
        res.render('index', {
            title: 'Express',
            user: req.session.user
        });
    });
    
    io.on('connection', function(socket){
        console.log('User connected...');
    });
    
    return router;
};