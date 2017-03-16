'use strict';

const gulp = require('gulp');
const {colors, log} = require('gulp-util');
const livereload = require('gulp-livereload');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const {notify} = require('node-notifier');
const paths = require('../../config/paths');
const config = {
  webpack: require(paths.config.webpack)
};

gulp.task('scripts', (cb) => {
  let flag = true;

  return webpackStream(config.webpack, webpack, (err, stats) => {
    if (err || stats.compilation.errors.length > 0) {
      log('[Webpack: Error]', stats.compilation.errors);

      notify({
        message: stats.compilation.errors[0].message,
        sound: true,
        title: '[Webpack: Error]',
        type: 'error'
      });

      if (flag) {
        flag = false;

        return cb();
      }
    } else {
      log('[Webpack: Build]', stats.toString({
        assets: false,
        cached: false,
        children: false,
        chunkModules: false,
        chunkOrigins: false,
        chunks: false,
        colors: colors.supportsColor,
        errorDetails: false,
        hash: false,
        modules: false,
        reasons: false,
        source: false,
        timings: true,
        version: false
      }));

      if (flag) {
        flag = false;

        if (config.webpack.watch) {
          return cb();
        }
      } else {
        livereload();
      }
    }
  });
});
