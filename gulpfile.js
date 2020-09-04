// import gulp from 'gulp';
// import babel from 'gulp-babel';
// import uglify from 'gulp-uglify';
// import del from 'del';

const gulp = require('gulp')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const del = require('del')

const paths = {
  scripts: {
    src: 'src/**/*.js',
    dest: 'dest/'
  }
};

const clean = () => del(['dest']);

function scripts() {
  return gulp.src(paths.scripts.src, {
    sourcemaps: true
  })
  .pipe(babel())
  // .pipe(uglify())
  .pipe(gulp.dest(paths.scripts.dest));
}

const build = gulp.series(clean, gulp.parallel(scripts));
/*
 * Export a default task
 */
exports.default = build;