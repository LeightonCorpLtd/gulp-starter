'use strict';

var gulp = require('gulp');
var sequence = require('gulp-sequence');

function task (cb) {
  sequence(
    'rev:assets',
    'rev:references',
    cb
  );
}

gulp.task('rev', task);

module.exports = task;
