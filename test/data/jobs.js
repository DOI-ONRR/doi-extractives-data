/* jshint node: true, mocha: true */
/* jshint -W083 */
/* jshint -W089 */
/* jshint -W110 */
var tito = require('tito');
var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var assert = require('assert');
var _ = require('lodash');

var statesPath = path.join(
  __dirname,
  '../../_data/states_key.yml'
);

var states = yaml.safeLoad(
  fs.readFileSync(statesPath, 'utf8')
);

var statesInverted = _.invert(states);

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

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}


describe('wage and salary jobs data (BLS)', function() {

  var dataSource = path.join(
    __dirname,
    '../../_data/state_jobs.yml'
  );

  var pivotSourceParent = path.join(
    __dirname,
    '../../data/jobs/bls'
  );

  var countyJobsPath = path.join(
    __dirname,
    '../../_data/county_jobs'
  );

  var years = getDirectories(pivotSourceParent)
    .filter(function(dirname) {
      return dirname.match(/^20\d\d$/);
    });

  var countyJobs = fs.readdirSync(countyJobsPath)
    .filter(function(filename) {
      return filename.match(/^[A-Z]{2}\.yml$/);
    });

  var pivotSource = years.reduce(function(acc, year) {
    acc[year] = path.join(
      __dirname,
      '../../data/jobs/bls/',
      year,
      'joined.tsv'
    );
    return acc;
  }, {});

  var selfEmployment = yaml.safeLoad(
    fs.readFileSync(dataSource, 'utf8')
  );

  var countySelfEmployment = {};

  countyJobs.forEach(function(region) {
    var regionEmployment = path.join(countyJobsPath, region);
    countySelfEmployment[region.split('.')[0]] = yaml.safeLoad(
      fs.readFileSync(regionEmployment, 'utf8')
    );
  });

  years.forEach(function(year) {

    describe(year, function() {

      xit('state rollups', function(done) {
        load(pivotSource[year], 'tsv', function(error, rows) {

          var actual = {};
          var expected = {};

          rows
            .filter(function(d) {
              return !d.county;
            })
            .forEach(function(d) {
              var state = states[d.state];

              var expectedByState = selfEmployment[state];

              if (expectedByState) {
                if (+d.jobs) {
                  if (actual[state]) {
                    actual[state] += +d.jobs;
                  } else {
                    actual[state] = +d.jobs;
                  }
                }
                if (expectedByState[d.year]) {
                  expected[state] = expectedByState[d.year].count;
                } else {
                  console.warn('no data for:', d.state);
                }
              }
            });

          for (var state in actual) {
            var difference = Math.abs(+actual[state] - +expected[state]);
            assert.ok(
              difference <= 0,
              state + ': ' + actual[state] + ' != ' + expected[state]
                + ' (' + JSON.stringify(expected) + ')'
            );
          }

          done();
        });
      });

      xit('county data', function(done) {

        load(pivotSource[year], 'tsv', function(error, rows) {

          var actual = {};
          actual.count = {};
          actual.percent = {};

          var expected = {};
          expected.count = {};
          expected.percent = {};

          var round = 1;

          rows.forEach(function(d) {
            var state = states[d.state];

            var expectedByState = countySelfEmployment[state];

            if (expectedByState) {
              try {
                if (d.County) {
                  var expectedByCounty = expectedByState[d.FIPS];
                  if (+d.jobs) {
                    if (actual.count[d.FIPS]) {
                      actual.count[d.FIPS] += +d.jobs;
                    } else {
                      actual.count[d.FIPS] = +d.jobs;
                    }
                  }

                  if (+d.Share) {
                    if (actual.percent[d.FIPS]) {
                      actual.percent[d.FIPS] += +d.Share * 100;
                    } else {
                      actual.percent[d.FIPS] = +d.Share * 100;
                    }
                  }
                  // console.log(expectedByCounty)
                  expected.count[d.FIPS] = expectedByCounty
                    .employment[year].count;
                  expected.percent[d.FIPS] = expectedByCounty
                    .employment[year].percent;
                }
              } catch (error) {
                assert.ok(false, 'no data for: ' + JSON.stringify(d));
              }
            }
          });

          for (var metric in actual) {
            for (var fips in actual[metric]) {

              var difference = Math.abs(
                +actual[metric][fips] - +expected[metric][fips]
              );

              if (metric === 'percent') {
                round = 0.01;
              } else {
                round = 1;
              }
              assert.ok(
                difference <= round,
                [
                  metric, actual[metric][fips], '!=', expected[metric][fips],
                  'for:', [fips, year].join('/')
                ].join(' ')
              );
            }
          }

          done();
        });
      });

      var test = (
        "data doesn't contain values that aren't in the pivot table"
      );

      xit(test, function(done) {
        var actualCount;
        var actualPercent;
        var found;
        var state;
        var fips;

        var filter = function(d) {
          return d.state === statesInverted[state] &&
                d.year === year &&
                d.fips === fips;
        };

        load(pivotSource[year], 'tsv', function(error, rows) {
          for (state in countySelfEmployment) {
            for (fips in countySelfEmployment[state]) {
              if (countySelfEmployment[state][fips].employment[year]) {
                actualCount = countySelfEmployment[state][fips]
                  .employment[year]
                  .count;
                actualPercent = countySelfEmployment[state][fips]
                  .employment[year]
                  .percent;
                found = rows.filter(filter);
              }
              assert.equal(
                found.length, 1,
                'wrong row count: ' + found.length +
                ' for: ' + [state, fips, year].join('/')
              );

              var expectedCount = found[0].jobs;
              var differenceCount = expectedCount - actualCount;
              assert.ok(
                Math.abs(differenceCount) <= 1,
                [
                  'wrong count:', actualCount, '!=', expectedCount,
                  '\n' + [state, fips, year].join('/')
                ].join(' ')
              );
            }
          }

          done();
        });
      });

    });

  });

});
