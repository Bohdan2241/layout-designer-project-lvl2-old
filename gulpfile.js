const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const stylelint = require('gulp-stylelint');
const htmlhint = require('gulp-htmlhint');
const sync = require('browser-sync');

// Stylelint

const lintStyles = () => {
  return gulp.src('./styles/scss/**/*.scss')
    .pipe(stylelint({
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
  return gulp.src('./*.html')
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(htmlhint.reporter('htmlhint-stylish'))
};

exports.lintHtml = lintHtml;

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
  gulp.watch('./*.html', lintHtml).on('change', sync.reload);
  gulp.watch('./styles/scss/**/*.scss', gulp.series(styles, lintStyles));
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