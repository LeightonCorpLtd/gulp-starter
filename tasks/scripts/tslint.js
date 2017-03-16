'use strict';

const gulp = require('gulp');
const tslint = require('gulp-tslint');
const reporter = require('gulp-tslint-jenkins-reporter');
const paths = require('../../config/paths');
const settings = require('../../config/settings');
const config = {
  tslint: require('../../config/tslint')
};

gulp.task('scripts:tslint', () => gulp
  .src(paths.src.scripts.files)
  .pipe(tslint(settings.lint.ts))
  .pipe(tslint.report(config.tslint.report))
  .pipe(reporter(config.tslint.reporter)));
