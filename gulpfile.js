const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const sync = require('browser-sync');

// Styles

const styles = () => {
  return gulp.src('./styles/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('style.css'))
    .pipe(gulp.dest('./styles/'))
    .pipe(sync.stream());
};

exports.styles = styles;

// Server

const server = () => {
  sync.init({
    ui: false,
    notify: false,
    server: {
      baseDir: './'
    }
  });
};

exports.server = server;

// Watch

const watch = () => {
  gulp.watch('./*.html').on('change', sync.reload);
  gulp.watch('./styles/scss/**/*.scss', gulp.series(styles));
};

exports.watch = watch;

// Default

exports.default = gulp.series(
  styles,
  gulp.parallel(
    watch,
    server,
  ),
);