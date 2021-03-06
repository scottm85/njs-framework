const LocalStrategy = require('passport-local').Strategy,
      mongoose      = require("mongoose"),
      User          = require('../schemas/users'),
      uuid          = require('node-uuid'),
      crypto        = require('crypto'),
      nodemailer    = require('nodemailer');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    }, function(req, email, password, done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'email' :  email }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(null, false, req.flash('signupMessage', err));
    
                // check to see if theres already a user with that email
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {
    
                    // if there is no user with that email
                    // create the user
                    var newUser            = new User();
                    
                    var key = uuid();
                    key = crypto.createHash('sha256')
                        .update(key)
                        .update('salt')
                        .digest('hex');
    
                    // set the user's local credentials
                    newUser.email     = email;
                    newUser.password  = newUser.generateHash(password);
                    newUser.name      = req.body.name;
                    newUser.tnc       = req.body.tnc;
                    newUser.apikey    = key;
    
                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                            
                        let transport = nodemailer.createTransport('direct', {
                            debug: true,
                        });
                        
                        transport.sendMail({
                            from: 'verification@njsframework.com',
                            to: newUser.email,
                            subject: 'Hello ✔ - Please verify your new account',
                            text: 'Click the link to verify your account:',
                            html: '<a href="https://new-framework-wrxsti85.c9users.io/verify/' + newUser.apikey + '">Verify</a>'
                        }, console.error);
                        
                        return done(null, newUser);
                    });
                    
                }
    
            });    

        });

    }));
    
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    }, function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(null, false, req.flash('loginMessage', err));

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            req.session.user = user;
            return done(null, user);
        });

    }));
    
};