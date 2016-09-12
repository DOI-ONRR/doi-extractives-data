/* jshint node: true, mocha: true */
/* jshint -W089 */
/* jshint -W110 */
var tito = require('tito');
var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var assert = require('assert');
var async = require('async');



var OUT_PATH = path.join(__dirname, '../../_data');

var load = function(filename, format, done) {
  var rows = [];
  fs.createReadStream(filename, 'utf8')
    .pipe(tito.formats.createReadStream(format))
    .on('data', function(d) {
      rows.push(d);
    })
    .on('error', done)
    .on('end', function() {
      done(null, rows);
    });
};

var loadAll = function(dir, done) {
  fs.readdir(dir, function(error, files) {
    if (error) {
      return done(error);
    }
    async.mapSeries(files, function(filename, next) {
      filename = path.join(dir, filename);
      var ext = filename.split('.').pop();
      load(filename, ext, next);
    }, function(error, files) {
      done(error, (files || []).reduce(function(rows, data) {
        return rows.concat(data);
      }, []));
    });
  });
};


describe('federal production (ONRR)', function() {

  describe('national values', function() {

    var nationalValues = yaml.safeLoad(
      fs.readFileSync(
        path.join(OUT_PATH, 'national_federal_production.yml'),
        'utf8'
      )
    );
    var products = nationalValues.US.products;

    var assertSentinelMatch = function (product, year, value) {
      var expected = Math.round(value);
      var actual = products[product].volume[year];
      assert.equal(
        expected, actual,
        'expected ' + value + ' for: ' + [product, year].join(' | ')
      );
    }

    it('check sentinel values', function(done) {

      var sentinels = [
        {
          product: 'Salt (tons)',
          year: 2015,
          value: 764801
        },
        {
          product: 'Salt (tons)',
          year: 2006,
          value: 512832
        },
        {
          product: 'Oil (bbl)',
          year: 2013,
          value: 623103681.09
        },
        {
          product: 'Gas (mcf)',
          year: 2013,
          value: 4941408110
        }
      ];

      sentinels.forEach(function(sentinel) {
        assertSentinelMatch(
          sentinel.product,
          sentinel.year,
          sentinel.value
        );
      });

      done();
    });
  });

});
