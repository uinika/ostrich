const gulp = require("gulp"),
  express = require('gulp-express'),
  connect = require('gulp-connect'),
  livereload = require("gulp-livereload"),
  nodemon = require('gulp-nodemon'),
  less = require('gulp-less'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  sourcemap = require('gulp-sourcemaps'),
  csso = require('gulp-csso'),
  del = require('del');

/**------------------ gulp default ------------------*/
gulp.task('default', ['server', 'client']);


/**------------------ gulp client ------------------*/
gulp.task('client', ['less', 'connect', 'watch']);
// Less Processor
gulp.task('less', function() {
  gulp.src('./client/styles/less/app.less')
    .pipe(less())
    .pipe(gulp.dest('./client/styles/'));
});
// Static Server
gulp.task('connect', function() {
  connect.server({
    root: './client/',
    port: 8001,
    livereload: true
  });
});
// Reload Static Server
gulp.task('livereload', ['less'], function() {
  gulp.src('./client/**/*.*')
    .pipe(connect.reload());
});
// Watch Client
gulp.task('watch', function() {
  gulp.watch(['./client/scripts/**/*.*', './client/styles/**/*.*', './client/views/**/*.html', './client/*.html'], ['livereload']);
})


/**------------------ gulp server ------------------*/
gulp.task('server', ['nodemon']);
// API Server
gulp.task('express', function() {
  express.run(['./server/app.js'], {}, false);
})
// Whach Server
gulp.task('nodemon', function() {
  nodemon({
    script: './server/app.js',
    env: {
      'NODE_ENV': 'development'
    }
  })
});


/**------------------ gulp build ------------------*/
gulp.task('build', ['scripts','styles','images','htmls','libraries']);
// Handle JavaScript
gulp.task('scripts', function() {
  gulp.src('./client/scripts/**/*.js')
    .pipe(sourcemap.init())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./build/scripts'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemap.write('./'))
    .pipe(gulp.dest('./build/scripts'))
});
// Handle CSS
gulp.task('styles', function() {
  gulp.src('./client/styles/less/app.less')
    .pipe(less())
    .pipe(gulp.dest('./build/styles'))
    .pipe(csso())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./build/styles'))
});
//  Handle HTML
gulp.task('htmls', function(){
  gulp.src(['./client/**/*.html'])
    .pipe(gulp.dest('./build'));
  gulp.src(['./client/views/*'])
    .pipe(gulp.dest('./build/views'));
})
// Handle Libraries
gulp.task('libraries', function(){
  gulp.src(['./client/libraries/**/*'])
    .pipe(gulp.dest('./build/libraries'));
})
// Handle Images
gulp.task('images', function(){
  gulp.src(['./client/styles/images/**/*'])
    .pipe(gulp.dest('./build/styles/images'));
})


/**------------------ gulp clean ------------------*/
gulp.task('clean', function() {
  del(['./build/**/*']);
});
