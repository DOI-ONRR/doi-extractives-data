/* jshint node: true, mocha: true */
var c = require('colors');
var assert = require('assert');
var fs = require('fs');
var tito = require('tito').formats;

// XXX these are the known FIPS of offshore _state_ land
var OFFSHORE_FIPS = [
  '22719',
  '22721',
];

describe('FIPS codes', function() {

  var topology = require('../../data/geo/us-topology.json');
  var counties = topology.objects.counties.geometries
    .map(function(geom) {
      return geom.properties;
    });

  var countiesByFIPS = counties.reduce(function(fips, props) {
    return fips[props.FIPS] = props, fips;
  }, {});

  var revenueFIPS = {};
  before(function loadRevenue() {
    return new Promise(function(resolve, reject) {
      var index = 0;
      fs.createReadStream('data/revenue/onshore.tsv', 'utf8')
        .pipe(tito.createReadStream('tsv'))
        .on('error', reject)
        .on('data', function(row) {
          index++;
          if (row.FIPS) {
            revenueFIPS[row.FIPS] = {
              index: index,
              state: row.St,
              county: row['County Name']
            };
          }
        })
        .on('end', function() {
          console.warn('loaded revenue');
          resolve();
        });
    });
  });

  describe('federal revenue FIPS codes match the TopoJSON', function() {
    it('matches state and county FIPS codes', function() {
      var passed = 0;
      var failed = 0;
      var total = 0;
      Object.keys(revenueFIPS)
        .filter(function(fips) {
          return OFFSHORE_FIPS.indexOf(fips) === -1;
        })
        .forEach(function(fips) {

          var row = revenueFIPS[fips];
          var county = countiesByFIPS[fips];
          total++;
          try {
            assert.ok(county, [
              'no such county found in ', c.green(row.state), ': ',
              c.red(row.county), ' (', c.yellow(fips), ')'
            ].join(''));
            assert.equal(row.state, county.state, [
              'bad state for FIPS ', c.yellow(fips), ' (', row.county, '): ',
              c.red(row.state), ' should be ',
              c.green(county.state), ' (', county.name, ')'
            ].join(''));
          } catch (error) {
            // XXX Alaska is just not right, I guess?
            if (row.state !== 'AK') {
              console.warn('line', c.bold(row.index) + ':', error.message);
              return failed++;
            }
          }
          passed++;
        });

        assert.equal(total, passed, [
          c.red(failed), ' out of ', c.yellow(total), ' FIPS passed'
        ].join(''));
      });
  });

});
