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

  describe('revenues by type', function() {

    var dataSource = path.join(__dirname, '../../_data/state_revenues_by_type.yml');
    var pivotSource = path.join(__dirname, '../../data/revenue/pivot.tsv');
    var stateRevenueByType = yaml.safeLoad(fs.readFileSync(dataSource, 'utf8'));

    it('match values in the pivot table', function(done) {
      var line = 1;
      load(pivotSource, 'tsv', function(error, rows) {
        rows.forEach(function(d) {
          var expected = +d.Total;
          try {
            var actual = stateRevenueByType[d.St][d.Commodity.trim()][d['Revenue Type']][d.CY];
          } catch (error) {
            assert.ok(false, 'no data for: ' + JSON.stringify(d));
          }
          var difference = expected - actual;
          assert.ok(Math.abs(difference) <= 1, actual, (actual + ' != ' + expected + ' @ ' + line));
          line++;
        });
        done();
      });
    });

    it('does not contain values that are not in the pivot table', function(done) {
      load(pivotSource, 'tsv', function(error, rows) {
        for (var state in stateRevenueByType) {
          for (var commodity in stateRevenueByType[state]) {
            if (commodity === 'All') {
              continue;
            }
            for (var type in stateRevenueByType[state][commodity]) {
              if (type === 'All') {
                continue;
              }
              for (var year in stateRevenueByType[state][commodity][type]) {
                var actual = stateRevenueByType[state][commodity][type][year];
                var row = rows.filter(function(d) {
                  return d.St === state &&
                         d.Commodity.trim() === commodity &&
                         d['Revenue Type'] === type &&
                         d.CY === year;
                });
                assert.equal(
                  row.length, 1,
                  'wrong row count: ' + row.length + ' for: ' + [state, commodity, type, year].join('/'));
                var expected = row[0].Total;
                var difference = expected - actual;
                assert.ok(Math.abs(difference) <= 1, actual, (actual + ' != ' + expected));
              }
            }
          }
        }
        done();
      });
    });

  });

  it('properly sums up "All" revenues (by commodity)', function() {
    var dataSource = path.join(__dirname, '../../_data/state_revenues.yml');
    var stateRevenuesByCommodity = yaml.safeLoad(fs.readFileSync(dataSource, 'utf8'));

    for (var state in stateRevenuesByCommodity) {
      var commodities = stateRevenuesByCommodity[state].commodities;
      var allByYear = {};
      var totalsByYear = {};
      var count = 0;
      for (var commodity in commodities) {
        for (var year in commodities[commodity]) {
          var revenue = commodities[commodity][year].revenue;
          if (commodity === 'All') {
            allByYear[year] = revenue;
          } else {
            totalsByYear[year] = (totalsByYear[year] || 0) + revenue;
            count++;
          }
        }
      }

      // compare yearly totals, using the number of commodities as a standin
      // for the acceptable rounding error (+/- 1 for each)
      for (var year in totalsByYear) {
        var difference = Math.abs(allByYear[year] - totalsByYear[year]);
        assert.ok(
          difference <= count,
          'abs(' + allByYear[year] + ' - ' + totalsByYear[year] + ' = ' + difference + ')'
        );
      }

      // now check the keys for allByYear just to be sure that we don't have
      // extra years in there
      for (year in allByYear) {
        var difference = Math.abs(allByYear[year] - totalsByYear[year]);
        assert.ok(
          difference <= count,
          'abs(' + allByYear[year] + ' - ' + totalsByYear[year] + ' = ' + difference + ')'
        );
      }
    }
  });

});
