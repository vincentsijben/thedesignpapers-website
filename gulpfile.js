// Sass configuration
var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));
var sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function(cb) {
  gulp
    .src('sass/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('css'));
  cb();
});

gulp.task(
  'default',
  gulp.series('sass', function(cb) {
    gulp.watch('sass/*.scss', gulp.series('sass'));
    cb();
  })
);