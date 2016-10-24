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
      '../../data/disbursements/federal-pivot.tsv'
    );

    var stateDisbursements = yaml.safeLoad(
      fs.readFileSync(dataSource, 'utf8')
    );

    it('match values in the pivot table', function(done) {
      var testRow = function(d, i) {
        var expected = +d.Total;
        var actual;

        if (expected === 0 || d.State === '(blank)') { return; }

        if (d.Fund === 'State') {
          d.Fund = 'States';
        }

        // exlude row where State is 'US' and Fund is 'States'
        // because this value was a rollup value and
        // a static value
        if (d.State !== 'US' && d.Fund !== 'States') {
          try {
            actual = stateDisbursements[
              d.State
            ][
              d.Fund
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
        var source;
        var year;
        var fund;
        var actual;
        var expected;
        var difference;
        var found;

        var filter = function(d) {
          if (d.Fund === 'State') {
            d.Fund = 'States';
          }
          return d.State === state &&
                 d.Source === source &&
                 d.Fund === fund &&
                 d.FY === year;
        };

        for (state in stateDisbursements) {
          if (state !== 'US') {


            for (fund in stateDisbursements[state]) {
              if (fund === 'All') {
                continue;
              }
              for (source in stateDisbursements[state][fund]) {
                if (source === 'All') {
                  continue;
                }
                for (year in stateDisbursements[state][fund][source]) {
                  actual = stateDisbursements[state][fund][source][year];
                  found = rows.filter(filter);

                  assert.equal(
                    found.length, 1,
                    'wrong row count: ' + found.length +
                    ' for: ' + [state, fund, source, year].join('/')
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
          }
        }

        done();
      });
    });

    // TODO: check sum states up properly


    it('properly sums up "All" disbursements by fund', function() {
      for (var state in stateDisbursements) {
        var funds = stateDisbursements[state];
        var allByYear = {};
        var totalsByYear = {};
        var count = 0;

        var source;
        var fund;
        var year;
        var difference;


        for (fund in funds) {
          for (source in funds[fund]) {
            for (year in funds[fund][source]) {
              var revenue = funds[fund][source][year];
              if (fund === 'All') {
                allByYear[source] = allByYear[source] || {};
                allByYear[source][year] = revenue;
              } else {
                totalsByYear[source] = totalsByYear[source] || {};
                totalsByYear[source][year] = (totalsByYear[source][year] || 0)
                  + revenue;
                count++;
              }
            }
          }
        }
        // compare yearly totals, using the number of sources as a standin
        // for the acceptable rounding error (+/- 1 for each)
        for (source in totalsByYear) {
          for (year in totalsByYear[source]) {

            difference = Math.abs(allByYear[source][year]
                                  - totalsByYear[source][year]);
            assert.ok(
              difference <= count,
              'yearly totals: abs(' + allByYear[source][year] + ' - ' +
                totalsByYear[source][year] + ' = ' + difference + ')'
            );
          }
        }


        // now check the keys for allByYear just to be sure that we don't have
        // extra years in there
        for (source in totalsByYear) {
          for (year in allByYear[source]) {
            difference = Math.abs(allByYear[source][year]
                                  - totalsByYear[source][year]);
            assert.ok(
              difference <= count,
              'keys: abs(' + allByYear[source][year] + ' - ' +
                totalsByYear[source][year] + ' = ' + difference + ')'
            );
          }
        }
      }
    });

  });

});
