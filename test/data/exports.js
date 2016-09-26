/* jshint node: true, mocha: true, esnext: true */
/* -W083 */
/* -W089 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const EXTRACTIVES = 'Extractives';
const TOTAL = 'Total';

describe('exports', function() {
  var stateExports = yaml.safeLoad(
    fs.readFileSync(
      path.join(__dirname, '../../_data/state_exports.yml')
    )
  );

  it('has exports', function() {
    assert.ok(stateExports, 'no state exports!');
    assert.equal(typeof stateExports, 'object');
  });

  describe('sentinel state exports', function() {
    const ONE_MILL = 1e6;
    const getValue = function(state, commodity, year) {
      try {
        return stateExports[state].commodities[commodity][year];
      } catch (error) {
        assert.ok(false, [
          'no data for', commodity, 'in', state, '(' + year + ')'
        ].join(' '));
      }
    };
    it('New York exported gold in 2015', function() {
      assert.equal(getValue('NY', 'Gold', 2015), 6753.73 * ONE_MILL);
    });
    it('Florida exported gold in 2015', function() {
      assert.equal(getValue('FL', 'Gold', 2015), 1736.22 * ONE_MILL);
    });
    it('Nevada exported silver in 2015', function() {
      assert.equal(getValue('NV', 'Silver', 2015), 244.17 * ONE_MILL);
    });
    it('Idaho exported silver in 2015', function() {
      assert.equal(getValue('ID', 'Silver', 2015), 116.33 * ONE_MILL);
    });
    it('Rhode Island exported silver in 2015', function() {
      assert.equal(getValue('RI', 'Silver', 2015), 84.87 * ONE_MILL);
    });

    it('New Hampshire has no extractives', function() {
      assert.equal(stateExports.NH.Extractives, undefined);
    });
  });

  describe('state exports self-consistency', function() {
    it('all extractives add up to "Extractives" subtotal', function() {
      var counted = 0;
      Object.keys(stateExports).forEach(function(state) {
        var commodities = stateExports[state].commodities;
        var extractivesByYear = commodities[EXTRACTIVES];
        if (!extractivesByYear) {
          return;
        }

        var totalsByYear = Object.keys(extractivesByYear)
          .reduce(function(years, year) {
            years[year] = 0;
            return years;
          }, {});

        Object.keys(commodities).forEach(function(key) {
          if (key !== EXTRACTIVES && key !== TOTAL) {
            var commodityByYear = commodities[key];
            Object.keys(commodityByYear).forEach(function(year) {
              totalsByYear[year] += commodityByYear[year];
            });
          }
        });

        Object.keys(totalsByYear).forEach(function(year) {
          var value = totalsByYear[year];
          var expected = extractivesByYear[year];
          assert.equal(value, expected,
                        [
                          value, '!=', expected,
                          'for', state, 'in', year
                        ].join(' '));
        });

        counted++;
      });

      assert.ok(counted, 'no states counted');
    });
  });
});
