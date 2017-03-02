'use strict';

var path = require('path');
var webpack = require('webpack');
var paths = require('./paths');
var settings = require('./settings');
var WebpackManifest = require('../utilities/webpackManifest');
var scripting = settings.scripting === 'ts' ? 'ts' : 'js';
var root = paths.src[scripting].watch.replace('/**/*', '');
var publicPath = paths.dest.js.replace(paths.dest.base + '/', '');

var config = {
  resolve: {
    extensions: [
      '.js',
      '.ts'
    ],
    modules: [
      paths.src.packages.node_modules,
      paths.src.packages.bower_components
    ]
  },
  module: {
    rules: []
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    })
  ]
};

if (process.env.NODE_ENV === 'test') {
  // Make sure output plays nice with Istanbul
  config.module.rules = [{
    enforce: 'post',
    test: /\.(js|ts)$/,
    loader: 'istanbul-instrumenter-loader',
    include: root,
    exclude: [
      /\.(e2e-spec|spec|mock)\.ts$/,
      /bower_components/,
      /node_modules/
    ]
  }];
} else {
  // Set entry point and output if we're not testing
  config.entry = paths.src[scripting].entry;
  config.output = {
    filename: process.env.NODE_ENV === 'production' ? '[name]-[hash].js' : '[name].js',
    publicPath: path.join(publicPath, '/')
  };

  // Grab entry point names and determine if we need to dedupe
  var entry = [];

  for (var name in paths.src[scripting].entry) {
    if (paths.src[scripting].entry.hasOwnProperty(name)) {
      entry.push(name);
    }
  }

  // Dedupe if multiple entry points are being used
  if (entry.length > 1) {
    config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
      name: entry
    }));
  }
}

// Scripting specific options
if (settings.scripting === 'ts') {
  var atLoaderOpts;
  var exclude = [
    /bower_components/,
    /node_modules/
  ];

  if (process.env.NODE_ENV === 'test') {
    atLoaderOpts = 'awesome-typescript-loader?sourceMap=false,inlineSourceMap=true,module=commonjs';
    exclude.push(/\.e2e-spec\.ts$/);
  } else {
    atLoaderOpts = 'awesome-typescript-loader';
    exclude.push(/\.(e2e-spec|spec)\.ts$/);
  }

  if (settings.angular2) {
    config.plugins.push(
      new webpack.ContextReplacementPlugin(
        // The (\\|\/) piece accounts for path separators in *nix and Windows
        /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
        root
      )
    );
  }

  // Typescript loader
  config.module.rules.push({
    test: /\.ts$/,
    loaders: settings.angular2 ? [atLoaderOpts, 'angular2-template-loader', 'angular-router-loader'] : [atLoaderOpts],
    exclude: exclude
  });
} else if (settings.scripting === 'es6') {
  // Babel loader for ES6
  config.module.rules.push({
    test: /\.js$/,
    exclude: /(node_modules|bower_components)/,
    loader: 'babel-loader',
    query: {
      presets: ['es2015']
    }
  });
}

// Angular specific options
if (settings.angular1) {
  // ng-annotate + template loader for angular 1
  config.module.rules.push({
    test: /\.js$/,
    loader: 'ng-annotate-loader'
  });
  config.module.rules.push({
    test: /\.html$/,
    loader: 'ngtemplate-loader?relativeTo=' + root + '/!html'
  });
} else if (settings.angular2) {
  // Template loader for angular 2
  config.module.rules.push({
    test: /\.html$/,
    loader: 'html-loader',
    query: {
      caseSensitive: true,
      minimize: true,
      removeAttributeQuotes: false
    }
  });
}

// Environment options
if (process.env.NODE_ENV === 'development') {
  // Watch and add sourcemaps whilst developing
  config.watch = true;
  config.devtool = 'inline-source-map';
} else if (process.env.NODE_ENV === 'test') {
  // Configure for testing
  config.devtool = 'inline-source-map';
} else {
  // Replace references from the rev manifest
  // TODO: Wait for update or fork the code and fix it myself
  // config.module.rules.push({
  //   test: /\.html$/,
  //   exclude: [
  //     /bower_components/,
  //     /node_modules/
  //   ],
  //   loader: 'rev-replace-loader',
  //   query: {
  //     manifestPath: paths.src.templates.manifest
  //   }
  // });

  // Add to rev manifest
  config.plugins.push(
    new WebpackManifest({
      publicPath: publicPath
    })
  );

  // Uglify for production builds
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    mangle: {
      keep_fnames: true
    },
    comments: false
  }));

  // No errors
  config.plugins.push(new webpack.NoEmitOnErrorsPlugin());
}

module.exports = config;
