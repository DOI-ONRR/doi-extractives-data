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

describe('state rollups', function() {

  describe('federal onshore production', function() {

    var dataSource = path.join(
      __dirname,
      '../../_data/state_federal_production.yml'
    );

    var pivotSource = path.join(
      __dirname,
      '../../data/federal-production/pivot-onshore.tsv'
    );

    var federalProduction = yaml.safeLoad(
      fs.readFileSync(dataSource, 'utf8')
    );

    it('match values in the pivot table', function(done) {
      var testRow = function(d, i) {
        console.log(d['Production Volume'])
        if (+d['Production Volume'] !== 0 && d.Region !== 'Withheld') {
          var expected = +d['Production Volume'];
          var actual;
          try {
            actual = federalProduction[
              d.Region
            ][
              'products'
            ][
              d.Product
            ][
              'volume'
            ][
              d['Year']
            ][
              'volume'
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
      }

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
            for (year in federalProduction[state].products[product].volume) {
              try {
                actual = federalProduction[state].products[product].volume[year].volume;
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

});

  // it('properly sums up "All" revenues (by commodity)', function() {
  //   var dataSource = path.join(
  //     __dirname,
  //     '../../_data/state_revenues.yml'
  //   );

  //   var stateRevenuesByCommodity = yaml.safeLoad(
  //     fs.readFileSync(dataSource, 'utf8')
  //   );

  //   for (var state in stateRevenuesByCommodity) {
  //     var commodities = stateRevenuesByCommodity[state].commodities;
  //     var allByYear = {};
  //     var totalsByYear = {};
  //     var count = 0;

  //     var commodity;
  //     var year;
  //     var difference;

  //     for (commodity in commodities) {
  //       for (year in commodities[commodity]) {
  //         var revenue = commodities[commodity][year].revenue;
  //         if (commodity === 'All') {
  //           allByYear[year] = revenue;
  //         } else {
  //           totalsByYear[year] = (totalsByYear[year] || 0) + revenue;
  //           count++;
  //         }
  //       }
  //     }

  //     // compare yearly totals, using the number of commodities as a standin
  //     // for the acceptable rounding error (+/- 1 for each)
  //     for (year in totalsByYear) {
  //       difference = Math.abs(allByYear[year] - totalsByYear[year]);
  //       assert.ok(
  //         difference <= count,
  //         'abs(' + allByYear[year] + ' - ' +
  //           totalsByYear[year] + ' = ' + difference + ')'
  //       );
  //     }

  //     // now check the keys for allByYear just to be sure that we don't have
  //     // extra years in there
  //     for (year in allByYear) {
  //       difference = Math.abs(allByYear[year] - totalsByYear[year]);
  //       assert.ok(
  //         difference <= count,
  //         'abs(' + allByYear[year] + ' - ' +
  //           totalsByYear[year] + ' = ' + difference + ')'
  //       );
  //     }
  //   }
  // });
