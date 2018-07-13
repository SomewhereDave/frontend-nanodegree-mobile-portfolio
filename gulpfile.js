'use strict'

var gulp = require('gulp'),
    uglify = require('gulp-uglify'), //Minify JavaScript using UglifyJS2.
    rename = require('gulp-rename'), //Rename files
    minifyCSS = require('gulp-clean-css'), //Minify CSS using clean-css
    htmlclean = require('gulp-htmlclean'),
    plumber = require('gulp-plumber'), //Prevent pipe breaking caused by errors from gulp plugins
    responsive = require('gulp-responsive-images'), //Responsive images
    inject = require('gulp-inject'), //Adaptes file references in HTML markup
    browserSync = require('browser-sync').create(), //Synchronised browser testing
    del = require('del'); //Clean up unnecessary folders

var paths = {
  src: 'src/**/*',
  srcHTML: 'src/**/*.html',
  srcCSS: 'src/**/*.css',
  srcJS: 'src/**/*.js',
  srcImg: ['src/**/*.png','src/**/*.jpg'],

  tmp: 'tmp',
  tmpViews: 'tmp/views',
  tmpIndex: 'tmp/*.html',
  tmpPizza: 'tmp/views/pizza.html',
  tmpCSS: 'tmp/**/*.css',
  tmpJS: 'tmp/**/*.js',
  tmpImg: ['tmp/**/*.png','tmp/**/*.jpg'],
  tmpCSSIndex: 'tmp/css/*.css',
  tmpJSIndex: 'tmp/js/*.js',
  tmpCSSViews: 'tmp/views/css/*.css',
  tmpJSViews: 'tmp/views/js/*.js',

  dist: 'dist',
  distViews: 'dist/views',
  distIndex: 'dist/*.html',
  distPizza: 'dist/views/pizza.html',
  distCSS: 'dist/**/*.css',
  distJS: 'dist/**/*.js',
  distCSSIndex: 'dist/css/*.css',
  distJSIndex: 'dist/js/*.js',
  distCSSViews: 'dist/views/css/*.css',
  distJSViews: 'dist/views/js/*.js'
};

////////////SRC to TMP////////////


gulp.task('html', function() {
  return gulp.src(paths.srcHTML)
    .pipe(gulp.dest(paths.tmp));
});

gulp.task('css', function() {
  return  gulp.src(paths.srcCSS)
          .pipe(gulp.dest(paths.tmp));
});

//Minify Javascript
gulp.task('js', function() {
  return  gulp.src(paths.srcJS)
            .pipe(plumber())
            .pipe(uglify())
            .pipe(rename(function(path) {
              path.basename += ".min";
              path.extname = ".js"
            }))
            .pipe(plumber.stop())
            .pipe(gulp.dest(paths.tmp));
});

//Copy images
gulp.task('img', function(){
  gulp.src(paths.srcImg)
    .pipe(gulp.dest(paths.tmp));
});

gulp.task('copy', ['html', 'css', 'js', 'img']);

//Inject adjusted file pathes
gulp.task('inject', ['copy'], function () {
  //Incejtions to base folder
  var css = gulp.src(paths.tmpCSSIndex, {read: false});
  var js = gulp.src(paths.tmpJSIndex, {read: false});
  gulp.src(paths.tmpIndex)
    .pipe(inject( css, { relative:true } ))
    .pipe(inject( js, { relative:true } ))
    .pipe(gulp.dest(paths.tmp));
  //Injections to views folder
  css = gulp.src(paths.tmpCSSViews, {read: false});
  js = gulp.src(paths.tmpJSViews, {read: false});
  return gulp.src(paths.tmpPizza)
    .pipe(inject( css, { relative:true } ))
    .pipe(inject( js, { relative:true } ))
    .pipe(gulp.dest(paths.tmpViews));
});

////////////TMP to DEST////////////
gulp.task('html:dist', function() {
  return gulp.src(paths.srcHTML)
    .pipe(htmlclean())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('css:dist', function() {
  return  gulp.src(paths.srcCSS)
            .pipe(plumber())
            .pipe(minifyCSS())
            .pipe(rename(function(path) {
              path.basename += ".min";
              path.extname = ".css"
            }))
            .pipe(plumber.stop())
            .pipe(gulp.dest(paths.dist));
});

gulp.task('js:dist', function() {
  return  gulp.src(paths.srcJS)
            .pipe(plumber())
            .pipe(uglify())
            .pipe(rename(function(path) {
              path.basename += ".min";
              path.extname = ".js"
            }))
            .pipe(plumber.stop())
            .pipe(gulp.dest(paths.dist));
});

gulp.task('img:dist', function(){
  gulp.src(paths.srcImg)
    .pipe(gulp.dest(paths.dist));
});

//Resize oversized pizza image
//This is just for practice reasons. Resizing the image once would be more efficient in this case
gulp.task('responsive', function(){
  gulp.src('views/images/*.jpg')
    .pipe(responsive({
      'pizzeria.jpg': {
        width: 100
      }
    }))
    .pipe(gulp.dest(paths.dist + '/views/images/'));
});

gulp.task('copy:dist', ['html:dist', 'css:dist', 'js:dist', 'img:dist', 'responsive']);

gulp.task('inject:dist', ['copy:dist'], function () {
  //Injections to main folder
  var css = gulp.src(paths.distCSSIndex);
  var js = gulp.src(paths.distJSIndex);
  gulp.src(paths.distIndex)
    .pipe(inject( css, { relative:true } ))
    .pipe(inject( js, { relative:true } ))
    .pipe(gulp.dest(paths.dist));

  //Injections to views folder
  css = gulp.src(paths.distCSSViews, {read: false});
  js = gulp.src(paths.distJSViews, {read: false});
  return gulp.src(paths.distPizza)
    .pipe(inject( css, { relative:true } ))
    .pipe(inject( js, { relative:true } ))
    .pipe(gulp.dest(paths.distViews));
});

gulp.task('build', ['inject:dist']);
////////////////////////////////////

gulp.task('clean', function () {
  del([paths.tmp, paths.dist]);
});

// Run Static server
gulp.task('browser-sync', ['inject'], function() {
  browserSync.init({
      server: {
          baseDir: "tmp/"
      }
  });
});

gulp.task('watch', function() {
  gulp.watch(paths.srcJS, ['js',browserSync.reload]); //Reload browser on change
  gulp.watch(paths.srcCSS, ['css',browserSync.reload]);
  gulp.watch(paths.srcHTML, browserSync.reload);
});

gulp.task('default', ['inject', 'browser-sync', 'watch']);