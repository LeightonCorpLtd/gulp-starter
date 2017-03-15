'use strict';

const settings = require('./settings');
const config = require('../utilities/config');
const conditional = require('../utilities/conditional');

const defaults = [
  'clean:dist',
  [
    'copy',
    'fonts',
    'icons',
    'images'
  ],
  conditional(
    process.env.NODE_ENV === 'production',
    [
      'copy:revision',
      'fonts:revision',
      'images:revision'
    ]
  ),
  [
    'styles:lint',
    conditional(
      settings.scripting === 'ts',
      'scripts:tslint',
      'scripts:eslint'
    )
  ],
  'clean:temp'
];

module.exports = config(defaults, 'build');
