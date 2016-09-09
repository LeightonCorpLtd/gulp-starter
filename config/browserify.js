'use strict';

var paths = require('./paths');
var settings = require('./settings');

module.exports = {
  entries: settings.scripting === 'ts' ? paths.src.ts.entry : paths.src.js.entry,
  debug: process.env.NODE_ENV === 'development'
};
