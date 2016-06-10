/* jshint node: true, mocha: true */
/* jshint -W089 */
/* jshint -W110 */
var tito = require('tito');
var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var assert = require('assert');
var async = require('async');

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

describe('state rollups – federal production', function() {

  var dataSource = path.join(
    __dirname,
    '../../_data/state_federal_production.yml'
  );

  var pivotSource = path.join(
    __dirname,
    '../../data/federal-production/pivot-states.tsv'
  );

  var federalProduction = yaml.safeLoad(
    fs.readFileSync(dataSource, 'utf8')
  );

  it('match values in the pivot table', function(done) {
    var testRow = function(d, i) {
      if (+d['Production Volume'] !== 0 && d.Region !== 'Withheld') {
        var expected = +d['Production Volume'];
        var actual;
        try {
          actual = federalProduction[
            d.Region
          ].products[
            d.Product
          ].volume[
            d.Year
          ].volume;
        } catch (error) {
          assert.ok(false, 'no data for: ' + JSON.stringify(d));

        }
        var difference = expected - actual;
        assert.ok(
          Math.abs(difference) <= 1,
          actual,
          (actual + ' != ' + expected + ' @ ' + (i + 1))
        );
      }
    };

    load(pivotSource, 'tsv', function(error, rows) {
      rows.forEach(testRow);
      done();
    });
  });


  it("doesn't contain values that aren't in the pivot table", function(done) {


    load(pivotSource, 'tsv', function(error, rows) {
      var state;
      var product;
      var year;
      var actual;
      var expected;
      var difference;
      var found;

      var filter = function(d) {
        return d.Region === state &&
               d.Product === product &&
               d.Year === year;
      };

      for (state in federalProduction) {
        if (state === 'Withheld') {
          continue;
        }
        for (product in federalProduction[state].products) {
          if (product === 'All') {
            continue;
          }
          for (year in federalProduction
            [state].products
            [product].volume) {
            try {
              actual = federalProduction
                [state].products
                [product].volume
                [year].volume;
            } catch (err) {
              assert.ok(false, 'no data for: ' + JSON.stringify(federalProduction));
            }
            found = rows.filter(filter);
            assert.equal(
              found.length, 1,
              'wrong row count: ' + found.length +
              ' for: ' + [state, product, year].join('/')
            );

            expected = found[0]['Production Volume'];

            difference = expected - actual;

            assert.ok(
              Math.abs(difference) <= 1,
              actual,
              (actual + ' != ' + expected)
            );
          }
        }
      }

      done();
    });
  });
});


describe('county rollups – federal production', function(done) {

  var counties;
  var dataByRegion = {};

  var statesPath = path.join(
    __dirname,
    '../../_data/states.csv'
  );

  var dataPath = path.join(
    __dirname,
    '../../_data/federal_county_production'
  );

  var pivotSource = path.join(
    __dirname,
    '../../data/federal-production/pivot-counties.tsv'
  );

  var testCountyData = function(county, next) {
    var volume = +county['Production Volume'];

    var stateData = dataByRegion[county.Region];
    assert.ok(stateData, 'no data for state: ' + county.Region + ' in: ' + Object.keys(dataByRegion).join(', '));
    var countyData = stateData[county.FIPS];
    assert.ok(countyData, 'no county data for: ' + county.Region + ' FIPS: ' + county.FIPS);

    next();
  };

  it('asdfadsf', function(done) {
    async.parallel([
      function loadPivotTable(next) {
        load(pivotSource, 'tsv', function(error, _counties) {
          counties = _counties.filter(function(row) {
            return row['Production Volume'] !== '0' && !row.Region.match(/^Offshore/);
          });
          next();
        });
      },
      function loadYAMLData(next) {
        fs.readdir(dataPath, function(error, filenames) {
          filenames.forEach(function(filename) {
            var region = path.basename(filename, '.yml');
            filename = path.join(dataPath, filename);
            dataByRegion[region] = yaml.safeLoad(fs.readFileSync(filename, 'utf8'));
          });
          next();
        });
      }
    ], function(error) {
      async.each(counties, function(county, next) {
        testCountyData(county, next);
      }, done);
    });
  });

  return;

  var pivotSource = path.join(
    __dirname,
    '../../data/federal-production/pivot-counties.tsv'
  );


  it('match values in the pivot table', function(done) {
    var testRow = function(d, i) {
      if (+d['Production Volume'] !== 0 && d.Region !== 'Withheld') {
        var expected = +d['Production Volume'];
        var actual;
        try {
          actual = federalProduction[
            d.Region
          ].products[
            d.Product
          ].volume[
            d.Year
          ].volume;
        } catch (error) {
          assert.ok(false, 'no data for: ' + JSON.stringify(d));

        }
        var difference = expected - actual;
        assert.ok(
          Math.abs(difference) <= 1,
          actual,
          (actual + ' != ' + expected + ' @ ' + (i + 1))
        );
      }
    };

    load(pivotSource, 'tsv', function(error, rows) {
      rows.forEach(testRow);
      done();
    });
  });


  it("doesn't contain values that aren't in the pivot table", function(done) {


    load(pivotSource, 'tsv', function(error, rows) {
      var state;
      var product;
      var year;
      var actual;
      var expected;
      var difference;
      var found;

      var filter = function(d) {
        return d.Region === state &&
               d.Product === product &&
               d.Year === year;
      };

      for (state in federalProduction) {
        if (state === 'Withheld') {
          continue;
        }
        for (product in federalProduction[state].products) {
          if (product === 'All') {
            continue;
          }
          for (year in federalProduction
            [state].products
            [product].volume) {
            try {
              actual = federalProduction
                [state].products
                [product].volume
                [year].volume;
            } catch (err) {
              assert.ok(false, 'no data for: ' + JSON.stringify(federalProduction));
            }
            found = rows.filter(filter);
            assert.equal(
              found.length, 1,
              'wrong row count: ' + found.length +
              ' for: ' + [state, product, year].join('/')
            );

            expected = found[0]['Production Volume'];

            difference = expected - actual;

            assert.ok(
              Math.abs(difference) <= 1,
              actual,
              (actual + ' != ' + expected)
            );
          }
        }
      }

      done();
    });
  });
});
