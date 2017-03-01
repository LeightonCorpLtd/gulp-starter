'use strict';

var paths = require('../config/paths');
var path = require('path');
var fs = require('fs');

function WebpackManifest (opts) {
  this.opts = opts;
}

WebpackManifest.prototype.apply = function (compiler) {
  var opts = this.opts;

  compiler.plugin('done', function (stats) {
    var statsJson = stats.toJson();
    var chunks = statsJson.assetsByChunkName;
    var manifest = {};

    for (var key in chunks) {
      if (chunks.hasOwnProperty(key)) {
        manifest[path.join(opts.publicPath, key + '.js')] = path.join(opts.publicPath, chunks[key]);
      }
    }

    fs.writeFileSync(
      paths.src.templates.manifest,
      JSON.stringify(manifest)
    );
  });
};

module.exports = WebpackManifest;
