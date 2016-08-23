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



var statesPath = path.join(
  __dirname,
  '../../_data/states_key.yml'
);

var states = yaml.safeLoad(
  fs.readFileSync(statesPath, 'utf8')
);

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


describe('state self employment', function() {

  describe('check if jobs data is the same as joined.tsv pivot', function() {

    var dataSource = path.join(
      __dirname,
      '../../_data/state_jobs.yml'
    );

    var pivotSourceParent = path.join(
      __dirname,
      '../../data/_input/bls'
    );

    var years = getDirectories(pivotSourceParent);
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

    it('match values in the pivot table', function(done) {
      var testRow = function(d, i) {
        // var expected = +d.Total;
        // console.log(d.State)
        console.log(states[d.State])
        console.log(selfEmployment[states[d.State]])
        // if (d.State == )
        var actual;
        try {
          // actual = selfEmployment[
          //   d.St
          // ][
          //   d.Commodity.trim()
          // ][
          //   d['Revenue Type']
          // ][
          //   d.CY
          // ];
          return
        } catch (error) {
          // assert.ok(false, 'no data for: ' + JSON.stringify(d));
        }
        var difference = expected - actual;
        // assert.ok(
        //   true,
        //   true,
        //   (actual + ' != ' + expected + ' @ ' + (i + 1))
        // );
        return
      };

      for (var i = 0; i < years.length; i++) {

        var year = years[i];
        load(pivotSource[year], 'tsv', function(error, rows) {
          rows.forEach(testRow);
          done();
        });
      }

    });
  });

  //   it("doesn't contain values that aren't in the pivot table", function(done) {
  //     load(pivotSource, 'tsv', function(error, rows) {
  //       var state;
  //       var commodity;
  //       var type;
  //       var year;
  //       var actual;
  //       var expected;
  //       var difference;
  //       var found;

  //       var filter = function(d) {
  //         return d.St === state &&
  //                d.Commodity.trim() === commodity &&
  //                d['Revenue Type'] === type &&
  //                d.CY === year;
  //       };

  //       for (state in stateRevenueByType) {
  //         for (commodity in stateRevenueByType[state]) {
  //           if (commodity === 'All') {
  //             continue;
  //           }
  //           for (type in stateRevenueByType[state][commodity]) {
  //             if (type === 'All') {
  //               continue;
  //             }
  //             for (year in stateRevenueByType[state][commodity][type]) {
  //               actual = stateRevenueByType[state][commodity][type][year];
  //               found = rows.filter(filter);

  //               assert.equal(
  //                 found.length, 1,
  //                 'wrong row count: ' + found.length +
  //                 ' for: ' + [state, commodity, type, year].join('/')
  //               );

  //               expected = found[0].Total;
  //               difference = expected - actual;

  //               assert.ok(
  //                 Math.abs(difference) <= 1,
  //                 actual,
  //                 (actual + ' != ' + expected)
  //               );
  //             }
  //           }
  //         }
  //       }

  //       done();
  //     });
  //   });

  // });

});
