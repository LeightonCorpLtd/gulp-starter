'use strict';

var gulp = require('gulp');
var gulpIf = require('gulp-if');
var data = require('gulp-data');
var htmlmin = require('gulp-htmlmin');
var nunjucks = require('gulp-nunjucks-render');
var browsersync = require('browser-sync');
var fs = require('fs');
var paths = require('../../config/paths');
var errorHandler = require('../../utilities/errorHandler');
var config = {
  nunjucks: require('../../config/nunjucks')
};

function task () {
  return gulp
    .src(paths.src.templates.pages)
    .pipe(data(JSON.parse(fs.readFileSync(paths.src.templates.data, 'utf8'))))
    .pipe(nunjucks(config.nunjucks))
    .pipe(gulpIf(process.env.NODE_ENV === 'production', htmlmin())) // Minify html for production
    .on('error', errorHandler)
    .pipe(gulp.dest(paths.dest.base))
    .on('end', browsersync.reload);
}

gulp.task('templates', task);

module.exports = task;
