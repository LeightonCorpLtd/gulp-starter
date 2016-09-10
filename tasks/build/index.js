'use strict';

var gulp = require('gulp');
var sequence = require('gulp-sequence');
var settings = require('../../config/settings');

function task (cb) {
  sequence(
    'clean',
    'templates',
    ['copy', 'fonts', 'icons', 'images'],
    ['scss:lint', settings.scripting === 'ts' ? 'ts:lint' : 'js:lint'],
    ['scss', '' + settings.scripting === 'ts' ? 'ts' : 'js' + ''],
    cb
  );
}

gulp.task('build', task);

module.exports = task;
