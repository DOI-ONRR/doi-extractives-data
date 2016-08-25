/* jshint node: true, mocha: true */
/* jshint -W089 */
/* jshint -W110 */
var tito = require('tito');
var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var assert = require('assert');
var parse = require('csv-parse');
var async = require('async')

var _ = require('lodash');



var statesPath = path.join(
  __dirname,
  '../../_data/states_key.yml'
);

var states = yaml.safeLoad(
  fs.readFileSync(statesPath, 'utf8')
);

var statesInverted = _.invert(states)


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


describe('state self employment by state', function() {

  describe('check if jobs data is the same as joined.tsv pivot', function() {

    var dataSource = path.join(
      __dirname,
      '../../_data/state_jobs.yml'
    );

    var pivotSourceParent = path.join(
      __dirname,
      '../../data/_input/bls'
    );

    var countyJobsPath = path.join(
      __dirname,
      '../../_data/county_jobs'
    );

    var years = getDirectories(pivotSourceParent);
    var countyJobs = fs.readdirSync(countyJobsPath);
    var pivotSource = {};

    for (var i = 0; i < years.length; i++) {
      var year = years[i];
      pivotSource[year] = path.join(
        __dirname,
        '../../data/_input/bls/',
        year,
        'joined.tsv'
      );
    }

    // console.warn(pivotSource)

    var selfEmployment = yaml.safeLoad(
      fs.readFileSync(dataSource, 'utf8')
    );


    var countySelfEmployment = {};

    _.each(countyJobs, function(region) {
      var regionEmployment = path.join(countyJobsPath, region);

      countySelfEmployment[region.split('.')[0]] = yaml.safeLoad(
        fs.readFileSync(regionEmployment, 'utf8')
      );
    })


    for (var i = 0; i < years.length; i++) {
      var year = years[i];
      it('state rollups for ' + year, function(done) {
        load(pivotSource[year], 'tsv', function(error, rows) {

          var actual = {};
          var expected = {};

          rows.forEach(function(d) {
            var state = states[d.State];

            var expectedByState = selfEmployment[state]

            if (expectedByState) {

              if (+d.Jobs) {
                if (actual[state]) {
                  actual[state] += +d.Jobs;
                } else {
                  actual[state] = +d.Jobs;
                }
              }
              expected[state] = expectedByState[d.Year].count
            }
          });

          for (state in actual) {
            var difference = Math.abs(+actual[state] - +expected[state])
            assert.ok(
              difference <= 0,
              actual[state],
              (actual[state] + ' != ' + expected[state])
            )
          }

          done();
        });
      });

      it(year + " doesn't contain values that aren't in the pivot table", function(done) {
        var actualCount,
          actualPercent,
          found;

        var filter = function(d) {

          return d.State === statesInverted[state] &&
                 d.Year === year &&
                 d.FIPS === fips;
        };


        load(pivotSource[year], 'tsv', function(error, rows) {
            for (state in countySelfEmployment) {
              for (fips in countySelfEmployment[state]) {
                if (countySelfEmployment[state][fips].employment[year]) {
                  actualCount = countySelfEmployment[state][fips].employment[year].count;
                  actualPercent = countySelfEmployment[state][fips].employment[year].percent;
                  found = rows.filter(filter);
                }
                assert.equal(
                  found.length, 1,
                  'wrong row count: ' + found.length +
                  ' for: ' + [state, fips, year].join('/')

                );

                var expectedCount = found[0].Jobs;
                var expectedPercent = found[0].Share * 100;

                var differenceCount = expectedCount - actualCount;
                var differencePercent = expectedPercent - actualPercent;
                assert.ok(
                  Math.abs(differenceCount) <= 1,
                  'wrong count: ' + (actualCount + ' != ' + expectedCount + '\n' +
                    [state, fips, year].join('/')
                  )
                );

                assert.ok(
                  Math.abs(differencePercent) <= 1,
                  'wrong percent: ' + (actualPercent + ' != ' + expectedPercent + '\n' +
                    [state, fips, year].join('/')
                  )
                );
              }
            }

          done();
        });
      });

    }
  });

    // it("doesn't contain values that aren't in the pivot table", function(done) {
    //   load(pivotSource, 'tsv', function(error, rows) {
    //     var state;
    //     var commodity;
    //     var type;
    //     var year;
    //     var actual;
    //     var expected;
    //     var difference;
    //     var found;

    //     var filter = function(d) {
    //       return d.St === state &&
    //              d.Commodity.trim() === commodity &&
    //              d['Revenue Type'] === type &&
    //              d.CY === year;
    //     };

    //     for (state in stateRevenueByType) {
    //       for (commodity in stateRevenueByType[state]) {
    //         if (commodity === 'All') {
    //           continue;
    //         }
    //         for (type in stateRevenueByType[state][commodity]) {
    //           if (type === 'All') {
    //             continue;
    //           }
    //           for (year in stateRevenueByType[state][commodity][type]) {
    //             actual = stateRevenueByType[state][commodity][type][year];
    //             found = rows.filter(filter);

    //             assert.equal(
    //               found.length, 1,
    //               'wrong row count: ' + found.length +
    //               ' for: ' + [state, commodity, type, year].join('/')
    //             );

    //             expected = found[0].Total;
    //             difference = expected - actual;

    //             assert.ok(
    //               Math.abs(difference) <= 1,
    //               actual,
    //               (actual + ' != ' + expected)
    //             );
    //           }
    //         }
    //       }
    //     }

    //     done();
    //   });
    // });

  // });

});
