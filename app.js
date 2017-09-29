const mongoose        = require('mongoose'),
      express         = require('express'),
      socket_io       = require('socket.io'),
      path            = require('path'),
      favicon         = require('serve-favicon'),
      logger          = require('morgan'),
      cookieParser    = require('cookie-parser'),
      bodyParser      = require('body-parser'),
      configDB        = require('./config/database.js'),
      passport        = require('passport'),
      session         = require('express-session'),
      flash           = require('connect-flash');

let app = express(),
    io  = socket_io();
    
app.io = io;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// database
mongoose.connect(configDB.url, { useMongoClient: true });
require('./config/passport')(passport);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'thisisatest' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

// routes
const index = require('./routes/index')(io, passport),
      users = require('./routes/users')(io, passport);

app.use('/', index);
app.use('/', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
