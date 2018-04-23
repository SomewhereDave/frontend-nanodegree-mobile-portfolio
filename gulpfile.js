'use strict'

var gulp = require('gulp'),
    uglify = require('gulp-uglify'), //Minify JavaScript using UglifyJS2.
    rename = require('gulp-rename'), //Rename files
    minifyCSS = require('gulp-clean-css'), //Minify CSS using clean-css
    plumber = require('gulp-plumber'), //Prevent pipe breaking caused by errors from gulp plugins
    responsive = require('gulp-responsive'), //Responsive images
    browserSync = require('browser-sync').create(); //Synchronised browser testing

//Copy files that will stay untouched
gulp.task('copy', function() {
	gulp.src('views/*')
		.pipe(gulp.dest('build/views/'));

	gulp.src('*.html')
		.pipe(gulp.dest('build/'));

	gulp.src('img/*')
		.pipe(gulp.dest('build/img/'));			
});

gulp.task('scripts', function(){
  gulp.src('js/perfmatters.js')
      .pipe(plumber())
      .pipe(uglify())
      .pipe(rename('perfmatters.min.js'))
      .pipe(plumber.stop())
      .pipe(gulp.dest('./build/js/'));
});

gulp.task('styles', function(){
  gulp.src('css/*.css')
      .pipe(plumber())
      .pipe(minifyCSS())
      .pipe(rename(function(path) {
        path.basename += ".min";
        path.extname = ".css"
      }))
      .pipe(plumber.stop())
      .pipe(gulp.dest('./build/css/'));
});

gulp.task('responsive', function(){
	gulp.src('views/images/*.jpg')
		.pipe(responsive({
			'pizzeria.jpg': {
				width: 100
			}
		}))
		.pipe(gulp.dest('build/views/images'));
});

// Static server
gulp.task('browser-sync', function() {
  browserSync.init({
      server: {
          baseDir: "./"
      }
  });
});

gulp.task('watch', function() {
  gulp.watch('js/*.js', ['scripts',browserSync.reload]); //Reload browser on change
  gulp.watch('css/*.css', ['styles',browserSync.reload]);
  gulp.watch('*.html', browserSync.reload);
});

gulp.task('default', ['copy', 'scripts', 'styles','responsive', 'browser-sync', 'watch']);