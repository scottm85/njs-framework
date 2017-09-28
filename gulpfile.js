const gulp      = require("gulp"),
      chown     = require('gulp-chown'),
      stylus    = require("gulp-stylus"),
      cleanCSS  = require("gulp-clean-css"),
      nib       = require('nib'),
      uglify    = require("gulp-uglify"),
      rename    = require("gulp-rename"),
      child     = require('child_process'),
      fs        = require('fs'),
      jshint    = require('gulp-jshint'),
      user      = 'ubuntu',
      date      = new Date(),
      dateFmt   = date.getMonth() + '-' + date.getDate() + '-' + date.getFullYear();

console.log('||**********************|| DO NOT RUN AS SUDO ||**********************||');

// INIT
gulp.task('default', ['mongodb', 'server', 'watch:styles', 'watch:scripts', 'client-lint', 'server-routes-lint', 'server-schemas-lint', 'server-config-lint']);

// DATABASE
gulp.task('mongodb', function(){
    let server  = child.spawn('./mongod'),
        log     = fs.createWriteStream('./logs/database_' + dateFmt + '.log', {flags: 'a'});
    server.stdout.pipe(log);
    server.stderr.pipe(log);
});

// SERVER
gulp.task('server', function(){
    let server  = child.spawn('nodemon', ['./bin/www']),
        log     = fs.createWriteStream('./logs/server_' + dateFmt + '.log', {flags: 'a'});
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
        .pipe(uglify())
        .pipe(rename(function(path){
            console.log('Script: ' + (path.basename + path.extname ) + ' was uglified ****');
            path.basename = path.basename.split('_src')[0];
        }))
        .pipe(chown(user))
        .pipe(gulp.dest('./public/js/custom/'));
});

gulp.task('watch:scripts', function(){
    gulp.watch('./public/js/custom/*_src.js', ['scripts']);
});

// LINTER
gulp.task('client-lint', function() {
  return gulp.src('./public/js/custom/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('server-routes-lint', function() {
  return gulp.src('./routes/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('server-schemas-lint', function() {
  return gulp.src('./schemas/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('server-config-lint', function() {
  return gulp.src('./config/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});