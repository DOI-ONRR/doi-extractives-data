/* jshint node: true, mocha: true */
/* jshint -W089 */
/* jshint -W110 */
var tito = require('tito');
var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var assert = require('assert');

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

describe('disbursements', function() {

  describe('state rollups', function() {

    var dataSource = path.join(
      __dirname,
      '../../_data/federal_disbursements.yml'
    );

    var pivotSource = path.join(
      __dirname,
      '../../data/disbursements/pivot.tsv'
    );

    var stateDisbursements = yaml.safeLoad(
      fs.readFileSync(dataSource, 'utf8')
    );

    it('match values in the pivot table', function(done) {
      var testRow = function(d, i) {
        var expected = +d.Total;
        var actual;

        if (expected === 0 || d.State === '(blank)') { return; }

        try {
          actual = stateDisbursements[
            d.State
          ][
            d.Source
          ][
            d.FY
          ];
        } catch (error) {
          assert.ok(false, 'no data for: ' + JSON.stringify(d));
        }
        var difference = expected - actual;
        assert.ok(
          Math.abs(difference) <= 1,
          actual,
          (actual + ' != ' + expected + ' @ ' + (i + 1))
        );
      };

      load(pivotSource, 'tsv', function(error, rows) {
        rows.forEach(testRow);
        done();
      });
    });

    it("doesn't contain values that aren't in the pivot table", function(done) {
      load(pivotSource, 'tsv', function(error, rows) {
        var state;
        var source;
        var year;
        var actual;
        var expected;
        var difference;
        var found;

        var filter = function(d) {
          return d.State === state &&
                 d.Source === source &&
                 d.FY=== year;
        };

        for (state in stateDisbursements) {
          for (source in stateDisbursements[state]) {
            if (source === 'All') {
              continue;
            }
            for (year in stateDisbursements[state][source]) {
              actual = stateDisbursements[state][source][year];
              found = rows.filter(filter);

              assert.equal(
                found.length, 1,
                'wrong row count: ' + found.length +
                ' for: ' + [state, source, year].join('/')
              );

              expected = found[0].Total;
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


    it('properly sums up "All" disbursements by source', function() {
      for (var state in stateDisbursements) {
        var sources = stateDisbursements[state];
        var allByYear = {};
        var totalsByYear = {};
        var count = 0;

        var source;
        var year;
        var difference;

        for (source in sources) {
          for (year in sources[source]) {
            var revenue = sources[source][year];
            if (source === 'All') {
              allByYear[year] = revenue;
            } else {
              totalsByYear[year] = (totalsByYear[year] || 0) + revenue;
              count++;
            }
          }
        }

        // compare yearly totals, using the number of sources as a standin
        // for the acceptable rounding error (+/- 1 for each)
        for (year in totalsByYear) {
          difference = Math.abs(allByYear[year] - totalsByYear[year]);
          assert.ok(
            difference <= count,
            'abs(' + allByYear[year] + ' - ' +
              totalsByYear[year] + ' = ' + difference + ')'
          );
        }

        // now check the keys for allByYear just to be sure that we don't have
        // extra years in there
        for (year in allByYear) {
          difference = Math.abs(allByYear[year] - totalsByYear[year]);
          assert.ok(
            difference <= count,
            'abs(' + allByYear[year] + ' - ' +
              totalsByYear[year] + ' = ' + difference + ')'
          );
        }
      }
    });

  });

});
