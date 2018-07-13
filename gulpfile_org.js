'use strict'

var gulp = require('gulp'),
    uglify = require('gulp-uglify'), //Minify JavaScript using UglifyJS2.
    rename = require('gulp-rename'), //Rename files
    minifyCSS = require('gulp-clean-css'), //Minify CSS using clean-css
    plumber = require('gulp-plumber'), //Prevent pipe breaking caused by errors from gulp plugins
    responsive = require('gulp-responsive-images'), //Responsive images
    browserSync = require('browser-sync').create(); //Synchronised browser testing

var src = "./src",
    dist = "./dist"

//Copy files and folders that will stay untouched
gulp.task('copy', function() {
	gulp.src(src + '/views/*')
		.pipe(gulp.dest(dist + '/views/'));

	gulp.src(src + '/*.html')
		.pipe(gulp.dest(dist));

	gulp.src(src + '/img/*')
		.pipe(gulp.dest(dist + '/img/'));
});

//Minify Javascript
gulp.task('scripts', function(){
  gulp.src(src + '/js/perfmatters.js')
      .pipe(plumber())
      .pipe(uglify())
      .pipe(rename('perfmatters.min.js'))
      .pipe(plumber.stop())
      .pipe(gulp.dest(dist + '/js/'));
});

//Minify CSS
gulp.task('styles', function(){
  gulp.src(src + '/css/*.css')
      .pipe(plumber())
      .pipe(minifyCSS())
      .pipe(rename(function(path) {
        path.basename += ".min";
        path.extname = ".css"
      }))
      .pipe(plumber.stop())
      .pipe(gulp.dest(dist + '/css/'));
});

gulp.task('responsive', function(){
	gulp.src('views/images/*.jpg')
		.pipe(responsive({
			'pizzeria.jpg': {
				width: 100
			}
		}))
		.pipe(gulp.dest(dist + '/views/images/'));
});

// Static server
gulp.task('browser-sync', function() {
  browserSync.init({
      server: {
          baseDir:  src + "./"
      }
  });
});

gulp.task('watch', function() {
  gulp.watch(src + '/js/*.js', ['scripts',browserSync.reload]); //Reload browser on change
  gulp.watch(src + '/css/*.css', ['styles',browserSync.reload]);
  gulp.watch(src + '/*.html', browserSync.reload);
});

gulp.task('default', ['copy', 'scripts', 'styles','responsive', 'browser-sync', 'watch']);