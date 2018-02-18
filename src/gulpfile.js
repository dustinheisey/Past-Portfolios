//Base Variables
var gulp = require('gulp'); //Base
var webpack = require('webpack-stream');
var rename = require('gulp-rename'); 
var multiDest = require('gulp-multi-dest');
var sequence = require('run-sequence');

//Assets
var optimizeIMG = require('gulp-imagemin');

//CSS
var scss = require('gulp-sass');
var concatCSS = require('gulp-concat-css');
var prefixCSS = require('gulp-autoprefixer');
var uncommentCSS = require('gulp-strip-css-comments');
var unCSS = require('gulp-uncss');
var compressCSS = require('gulp-clean-css');

//JS
var concatJS = require('gulp-concat');
var uglify = require('gulp-uglify');

//HTML
var editHTML = require('gulp-useref');
var critical = require('critical');
var compressHTML = require('gulp-htmlmin');


//Functions

//Development

gulp.task('watch:scss', function () {
  gulp.watch('scss/style.scss', ['comp:css']);
});













//Build
gulp.task('build', function(callback) {
  sequence('assets', 'build:css', 'build:js', callback);
});

//Assets
gulp.task('assets', function(callback) {
  sequence('images', 'favicons', callback);
});

gulp.task('images', function() {
  return gulp.src('assets/*.jpg')
    .pipe(optimizeIMG())
    .pipe(gulp.dest('../build/assets'));
});

gulp.task('favicons', function(){
  return gulp.src('assets/favicons/*')
  .pipe(gulp.dest('../build/assets/ favicons'));
})

//CSS
// gulp.task('build:css', function(callback) {
//   sequence('comp:css', 'concat:css', 'prefix:css', 'uncomment:css', 'compress:css', callback);
// });

gulp.task('comp:css', function() {
  return gulp.src('scss/**/*.scss')
    .pipe(scss().on('error', scss.logError))
    .pipe(rename("style.css"))
    .pipe(gulp.dest('styles/'));
});

gulp.task('concat:css', function() {
  return gulp.src(['styles/icon-font.css', 'styles/style.css'])
    .pipe(concatCSS('style.min.css'))
    .pipe(gulp.dest('../build/'));
});

gulp.task('prefix:css', function() {
  return gulp.src('../build/style.min.css')
    .pipe(prefixCSS({browsers: ['last 10 versions'], cascade: false}))
    .pipe(gulp.dest('../build/'));
});

gulp.task('uncomment:css', function() {
  return gulp.src('../build/style.min.css')
    .pipe(uncommentCSS())
    .pipe(gulp.dest('../build/'));
});

// gulp.task('uncss:css', function(){
//   return gulp.dest('../build');
// });

gulp.task('compress:css', function(){
  return gulp.src('../build/style.min.css')
  .pipe(compressCSS({compatibility: 'ie8'}))
  .pipe(gulp.dest('../build/'));
});

gulp.task('build:css', function(){

  gulp.src('styles/fonts/*')
    .pipe(gulp.dest('../build/fonts/'));

  return gulp.src(['styles/icon-font.css', 'styles/style.css'])
    .pipe(concatCSS('style.min.css'))
    .pipe(prefixCSS({browsers: ['last 10 versions'], cascade: false}))
    .pipe(uncommentCSS())
    .pipe(compressCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('../build/'));

});



//JS

gulp.task('build:js', function() {
  return gulp.src('scripts/*.js')
    .pipe(concatJS('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('../build/'));
});

// gulp.task('build:js', function(callback) {
//   sequence('concat:js', 'compress:js', callback);
// });

gulp.task('concat:js', function() {
  return gulp.src('scripts/*.js')
    .pipe(concatJS('app.min.js'))
    .pipe(gulp.dest('../build/'));
});

gulp.task('compress:js', function() {
  return gulp.src('app.min.js')
    .pipe(uglify())
    .pipe(gulp.dest('../build/'));
});


//HTML 

gulp.task('html', function(callback){
    sequence('edit:html', 'critical', 'compress:html', callback);
});

gulp.task('edit:html', function() {
  
  return gulp.src('index.html')
    .pipe(editHTML())
    .pipe(gulp.dest('../build'));

});

gulp.task('critical', function (cb) {
    return gulp.src('../build/style.min.css')
      .pipe(critical.generate({
        inline: true,
        base: '../build',
        src: 'index.html',
        minify: true,
        dest: 'index.html'
      }));
});

gulp.task('compress:html', function() {
  return gulp.src(['404.html', '../build/index.html'])
    .pipe(compressHTML({collapseWhitespace: true, minifyCSS: true, minifyJS: true, removeComments: true}))
    .pipe(gulp.dest('../build'));
});
