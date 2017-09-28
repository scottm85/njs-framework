module.exports = function(io){

    const express = require('express'),
          router  = express.Router();
    
    router.get('/api', function(req, res, next) {
        let date = new Date();
        res.json({
            'date': date.toString()
        });
    });
    
    return router;

};
