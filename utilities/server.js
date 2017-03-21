/* eslint-disable no-console */

'use strict';

const express = require('express');
const compression = require('compression');
const livereload = require('connect-livereload');
const {address} = require('ip');
const morgan = require('morgan');
const chalk = require('chalk');
const underline = require('./underline');
const settings = require('../config/settings');
const paths = require('../config/paths');
const app = require(paths.server.app);

const colours = new chalk.constructor({
  enabled: true
});

const urls = {
  'Local': `localhost:${settings.port}`,
  'External': `${address()}:${settings.port}`
};

const line = underline(urls);

const server = express();


if (process.env.NODE_ENV === 'development') {
  server.use(livereload());
} else if (process.env.NODE_ENV === 'production') {
  server.use(compression());
}

server
  .use(morgan('dev'))
  .use(app)
  .set('port', settings.port)
  .listen(settings.port, () => console.log(`
${colours.bold.black('Access URLs:')}
${colours.gray(line)}
   Local: ${colours.magenta(urls['Local'])}
External: ${colours.magenta(urls['External'])}
${colours.gray(line)}
`));
