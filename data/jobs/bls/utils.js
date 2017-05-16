'use strict';
var fs = require('fs');
var streamify = require('stream-array');
var tito = require('tito').formats;

module.exports.readFile = filename => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (error, buffer) => {
      return error ? reject(error) : resolve(buffer);
    });
  });
};

module.exports.readData = (filename, format) => {
  if (!format) {
    format = filename.split('.').pop();
  }
  return new Promise((resolve, reject) => {
    var data = [];
    fs.createReadStream(filename)
      .pipe(tito.createReadStream(format))
      .on('error', reject)
      .on('data', d => data.push(d))
      .on('end', () => resolve(data));
  });
};

module.exports.writeData = (filename, data, format) => {
  if (!format) {
    format = filename.split('.').pop();
  }
  return new Promise((resolve, reject) => {
    streamify(data)
      .pipe(tito.createWriteStream(format))
      .pipe(fs.createWriteStream(filename))
      .on('error', reject)
      .on('close', resolve);
  });
};

module.exports.slugify = str => str.replace(/\W+/g, '-');

module.exports.validFips = fips => {
  return fips.match(/^\d\d/) && fips.substr(-2) !== '99';
};
