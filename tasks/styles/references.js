'use strict';

const gulp = require('gulp');
const revReplace = require('gulp-rev-replace');
const {join} = require('path');
const errorHandler = require('../../utilities/errorHandler');
const paths = require('../../config/paths');

gulp.task('styles:references', () => gulp
  .src(join(paths.dest.css, '**/*'))
  .pipe(errorHandler())
  .pipe(revReplace({
    manifest: gulp.src(paths.manifests.revision)
  }))
  .pipe(gulp.dest(paths.dest.css)));
