const gulp = require('gulp');
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const stylelint = require('gulp-stylelint');
const htmlhint = require('gulp-htmlhint');
const sync = require('browser-sync');

// Stylelint

const lintStyles = () => {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(stylelint({
      failAfterError: false,
      reporters: [
        {
          formatter: 'string',
          console: true
        }
      ]
    }))
};

exports.lintStyles = lintStyles;

// Htmlhint

const lintHtml = () => {
  return gulp.src('./src/*.html')
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(htmlhint.reporter('htmlhint-stylish'))
};

exports.lintHtml = lintHtml;

// Styles

const styles = () => {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnano())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('./src/css/'))
    .pipe(sync.stream());
};

exports.styles = styles;

// Server

const server = () => {
  sync.init({
    ui: false,
    notify: false,
    server: {
      baseDir: './src/'
    }
  });
};

exports.server = server;

// Watch

const watch = () => {
  gulp.watch('./src/*.html', lintHtml).on('change', sync.reload);
  gulp.watch('./src/scss/**/*.scss', gulp.series(styles, lintStyles));
};

exports.watch = watch;

// Default

exports.default = gulp.series(
  styles,
  gulp.parallel(
    lintHtml,
    lintStyles
  ),
  gulp.parallel(
    watch,
    server
  )
);