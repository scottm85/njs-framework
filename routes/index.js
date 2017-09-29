module.exports = function(io, passport){
    const express   = require('express'),
          router    = express.Router(),
          User      = require("../schemas/users");

    router.get('/', function(req, res, next) {
        res.render('index', { title: 'Express' });
    });
    
    io.on('connection', function(socket){
        console.log('User connected...');
    });
    
    return router;
};