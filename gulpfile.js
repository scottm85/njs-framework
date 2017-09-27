var gulp        = require("gulp"),
    chown       = require('gulp-chown'),
    stylus      = require("gulp-stylus"),
    cleanCSS    = require("gulp-clean-css"),
    nib         = require('nib'),
    uglify      = require("gulp-uglify"),
    rename      = require("gulp-rename"),
    child       = require('child_process'),
    fs          = require('fs'),
    user        = 'ubuntu';

gulp.task('default', ['mongodb', 'server', 'watch:styles', 'watch:scripts']);

// DATABASE
gulp.task('mongodb', function(){
    var server  = child.spawn('./mongod');
});

// SERVER
gulp.task('server', function(){
    var date    = new Date(),
        dateFmt = date.getMonth() + '-' + date.getDate() + '-' + date.getFullYear(),
        server  = child.spawn('nodemon', ['./bin/www']),
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
            path.basename = path.basename.split('_src')[0]
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
            path.basename = path.basename.split('_src')[0]
        }))
        .pipe(chown(user))
        .pipe(gulp.dest('./public/js/custom/'));
});

gulp.task('watch:scripts', function(){
    gulp.watch('./public/js/custom/*_src.js', ['scripts']);
});