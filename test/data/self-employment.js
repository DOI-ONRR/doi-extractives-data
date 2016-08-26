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


describe('self employment data', function() {

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
    it(year + ' – state rollups', function(done) {
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


    it(year + ' – county data', function(done) {

      load(pivotSource[year], 'tsv', function(error, rows) {

        var actual = {}
        actual.count = {};
        actual.percent = {};

        var expected = {}
        expected.count = {};
        expected.percent = {};

        var round = 1;

        rows.forEach(function(d) {
          var state = states[d.State];

          var expectedByState = countySelfEmployment[state]

          if (expectedByState) {
            try {
              if (d.County) {
                expectedByCounty = expectedByState[d.FIPS]
                if (+d.Jobs) {
                  if (actual.count[d.FIPS]) {
                    actual.count[d.FIPS] += +d.Jobs;
                  } else {
                    actual.count[d.FIPS] = +d.Jobs;
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
                expected.count[d.FIPS] = expectedByCounty.employment[year].count;
                expected.percent[d.FIPS] = expectedByCounty.employment[year].percent;
              }
            } catch (error) {
              assert.ok(false, 'no data for: ' + JSON.stringify(d));
            }
          }
        });

        for (metric in actual) {
          for (fips in actual[metric]) {

            var difference = Math.abs(+actual[metric][fips] - +expected[metric][fips])

            if (metric === 'percent') {
              round = .01;
            } else {
              round = 1;
            }
            assert.ok(
              difference <= round,
              (metric + ' ' + actual[metric][fips] + ' != ' + expected[metric][fips] +
                ' for: ' + [fips, year].join('/')
                )
            )
          }
        }

        done();
      });
    });

    it(year + " – data doesn't contain values that aren't in the pivot table", function(done) {
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
