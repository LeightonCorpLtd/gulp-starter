'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var webpackStream = require('webpack-stream');
var browsersync = require('browser-sync');
var notifier = require('node-notifier');
var paths = require('../../config/paths');
var config = {
  webpack: require('../../config/webpack').client
};

// TODO: Tree shaking
// TODO: Watch based on task not env
// TODO: Use actual package once merge request is accepted (https://github.com/shama/webpack-stream/pull/126)
function task (cb) {
  var flag = true;

  return webpackStream(config.webpack, webpack, function (err, stats) {
    if (err || stats.compilation.errors.length > 0) {
      // Output error to console
      gutil.log('[Webpack: Error]', stats.compilation.errors);

      // Send error notification
      notifier.notify({
        title: '[Webpack: Error]',
        message: stats.compilation.errors[0].message,
        sound: true,
        type: 'error'
      });

      if (flag) {
        flag = false;
        cb();
      }
    } else {
      gutil.log('[Webpack: Build]', stats.toString({
        colors: gutil.colors.supportsColor,
        hash: false,
        version: false,
        timings: true,
        assets: false,
        chunks: false,
        chunkModules: false,
        modules: false,
        children: false,
        cached: false,
        reasons: false,
        source: false,
        errorDetails: false,
        chunkOrigins: false
      }));

      if (flag) {
        flag = false;

        if (config.webpack.watch) {
          cb();
        }
      } else {
        browsersync.reload();
      }
    }
  })
    .pipe(gulp.dest(paths.dest.js));
}

gulp.task('scripts:client', task);

module.exports = task;
