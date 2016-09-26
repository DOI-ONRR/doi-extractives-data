/* jshint node: true, mocha: true, esnext: true */
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
    it('Florida exported gold in 2015', function() {
      assert.equal(stateExports.FL.commodities.Gold[2015], 1736.22 * 1e6);
    });
    it('Nevada exported silver in 2015', function() {
      assert.equal(stateExports.NV.commodities.Silver[2015], 244.17 * 1e6);
    });
  });

  describe('state exports self-consistency', function() {
    it('all extractives add up to "Extractives" subtotal', function() {
      var counted = 0;
      for (var state in stateExports) {
        var commodities = stateExports[state].commodities;
        var extractivesByYear = commodities[EXTRACTIVES];
        if (extractivesByYear) {
          var totalsByYear = Object.keys(extractivesByYear)
            .reduce(function(years, year) {
              years[year] = 0;
              return years;
            }, {});
          for (var key in commodities) {
            if (key !== EXTRACTIVES && key !== TOTAL) {
              var commodityByYear = commodities[key];
              Object.keys(commodityByYear).forEach(function(year) {
                totalsByYear[year] += commodityByYear[year];
              });
            }
          }
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
        }
      }
      assert.ok(counted, 'no states counted');
    });
  });
});
