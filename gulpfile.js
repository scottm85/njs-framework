const gulp      = require("gulp"),
      chown     = require('gulp-chown'),
      stylus    = require("gulp-stylus"),
      cleanCSS  = require("gulp-clean-css"),
      uglify    = require("gulp-uglify"),
      obfuscate = require("gulp-javascript-obfuscator"),
      rename    = require("gulp-rename"),
      jshint    = require('gulp-jshint'),
      nib       = require('nib'),
      fs        = require('fs'),
      child     = require('child_process'),
      dateFmt   = new Intl.DateTimeFormat("en-US"),
      date      = dateFmt.format(new Date()).replace(/\//g, '-'),
      user      = 'ubuntu';

console.log('||**********************|| DO NOT RUN AS SUDO ||**********************||');

// INIT
gulp.task('default', [
    'mongodb',
    'server',
    'watch:styles',
    'watch:scripts',
    'lint'
]);

// DATABASE
gulp.task('mongodb', function(){
    let server  = child.spawn('./mongod'),
        log     = fs.createWriteStream('./logs/database_' + date + '.log', {flags: 'a'});
    server.stdout.pipe(log);
    server.stderr.pipe(log);
});

// SERVER
gulp.task('server', function(){
    let server  = child.spawn('nodemon', ['./bin/www']),
        log     = fs.createWriteStream('./logs/server_' + date + '.log', {flags: 'a'});
    server.stdout.pipe(log);
    server.stderr.pipe(log);
});

// STYLESHEETS
gulp.task('styles', function(){
    gulp.src('./public/css/custom/*_src.styl')
        .pipe(stylus({
            use: nib(),
            import: ['nib']
        }))
        .pipe(cleanCSS())
        .pipe(rename(function(path){
            console.log('CSS: ' + (path.basename + path.extname ) + ' was minified ****');
            path.basename = path.basename.split('_src')[0];
        }))
        .pipe(chown(user))
        .pipe(gulp.dest('./public/css/custom/'));
});

gulp.task('watch:styles', function(){
    gulp.watch('./public/css/custom/*_src.styl', ['styles']);
});

// JAVASCRIPTS
gulp.task('scripts', function(){
    gulp.src('./public/js/custom/*_src.js')
        .pipe(obfuscate())
        .pipe(uglify())
        .pipe(rename(function(path){
            console.log('Script: ' + (path.basename + path.extname ) + ' was obfuscated & uglified ****');
            path.basename = path.basename.split('_src')[0];
        }))
        .pipe(chown(user))
        .pipe(gulp.dest('./public/js/custom/'));
});

gulp.task('watch:scripts', function(){
    gulp.watch('./public/js/custom/*_src.js', ['scripts']);
    gulp.watch([
        './public/js/custom/**/*_src.js',
        './routes/**/*.js',
        './schemas/**/*.js',
        './config/**/*.js'
    ], ['lint']);
});

// LINTER
gulp.task('lint', function() {
  return gulp.src([
      './public/js/custom/**/*_src.js',
      './routes/**/*.js',
      './schemas/**/*.js',
      './config/**/*.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});