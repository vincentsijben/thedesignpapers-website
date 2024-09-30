const gulp = require('gulp');
const dartSass = require('sass');
const gulpDartSass = require('gulp-dart-sass');
const sourcemaps = require('gulp-sourcemaps');

// Sass compilation task
const compileSass = () => {
  return gulp
    .src('sass/style.scss')
    .pipe(sourcemaps.init())
    .pipe(gulpDartSass({ outputStyle: 'compressed' }).on('error', gulpDartSass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('css'));
};

// Watch task
const watchSass = () => {
  gulp.watch('sass/*.scss', compileSass);
};

// Default task
gulp.task('default', gulp.series(compileSass, watchSass));

// Export tasks
exports.sass = compileSass;
exports.watch = watchSass;