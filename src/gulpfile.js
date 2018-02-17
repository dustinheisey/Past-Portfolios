//Variables

//Base Variables
var gulp = require('gulp');
var webpack = require('webpack-stream');
var rename = require('gulp-rename'); 
var multiDest = require('gulp-multi-dest');
var sequence = require('run-sequence');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var critical = require('critical');

//Assets
var optimize = require('gulp-imagemin');

//CSS
var sass = require('gulp-sass');
var concatCSS = require('gulp-concat-css');
var prefix = require('gulp-autoprefixer');
var uncomment = require('gulp-strip-css-comments');
var uncss = require('gulp-uncss');
var compressCSS = require('gulp-clean-css');

//JS
var concatJS = require('gulp-concat');

//HTML
var compressHTML = require('gulp-htmlmin');


//Functions

//Build
gulp.task('build', function(callback) {
  sequence('assets', 'css', 'js', callback);
});

//Development

gulp.task('watch:scss', function () {
  gulp.watch('scss/style.scss', ['comp:css']);
});


//Assets

gulp.task('assets', function(callback) {
  sequence('images', 'favicons', callback);
});

gulp.task('images', function() {
  return gulp.src('assets/*.jpg')
    .pipe(optimize())
    .pipe(gulp.dest('../build/assets'));
});

gulp.task('favicons', function(){
  return gulp.src('assets/favicons/*')
  .pipe(gulp.dest('../build/assets/ favicons'));
})

//CSS

gulp.task('css', function(callback) {
  sequence('comp:css','build:css', callback);
});

gulp.task('comp:css', function() {

  return gulp.src('scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename("style.css"))
    .pipe(gulp.dest('styles/'));

});

gulp.task('build:css', function(){

  gulp.src('styles/fonts/*')
    .pipe(gulp.dest('../build/fonts/'));

  return gulp.src(['styles/icon-font.css', 'styles/style.css'])
    .pipe(concatCSS('style.min.css'))
    .pipe(prefix({browsers: ['last 10 versions'], cascade: false}))
    .pipe(uncomment())
    .pipe(compressCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('../build/'));

});

//JS

gulp.task('js', function() {
  return gulp.src('scripts/*.js')
    .pipe(concatJS('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('../build/'));
});

//HTML 

gulp.task('html', function(callback){
    sequence('edit:html', 'critical', 'compress:html', callback);
});

gulp.task('edit:html', function() {
  return gulp.src('index.html')
  .pipe(useref())
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
      }), 'compress:html');
  });

gulp.task('compress:html', function() {
  return gulp.src(['404.html', '../build/index.html'])
    .pipe(compressHTML({collapseWhitespace: true, minifyCSS: true, minifyJS: true, removeComments: true}))
    .pipe(gulp.dest('../build'));
});
