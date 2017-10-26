/* jshint node: true, mocha: true */
/* jshint -W089 */
/* jshint -W110 */
var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var assert = require('assert');
var _ = require('lodash');


var OUT_PATH = path.join(__dirname, '../../_data');

describe('federal production (ONRR) sentinels', function() {

  describe('national values', function() {

    var nationalValues = yaml.safeLoad(
      fs.readFileSync(
        path.join(OUT_PATH, 'national_federal_production.yml'),
        'utf8'
      )
    );
    var products = nationalValues.US.products;

    var assertSentinelMatch = function (product, year, value) {
      var expected = Math.round(value);
      var actual = products[product].volume[year];

      var difference = expected - actual;
      assert.ok(
        Math.abs(difference) < 10,
        'expected ' + expected +
        ', got: ' + actual +
        ' for: ' + [product, year].join(' | ')
      );
    };

    it('check sentinel values', function(done) {

      var sentinels = [
        {
          product: 'Salt (tons)',
          year: 2015,
          value: 834645
        },
        {
          product: 'Oil (bbl)',
          year: 2013,
          value: 622678698
        },
        {
          product: 'Oil (bbl)',
          year: 2015,
          value: 755859023
        },
        // actual: 4952368580
        {
          product: 'Gas (mcf)',
          year: 2013,
          value: 4952368582
        }
      ];

      sentinels.forEach(function(sentinel) {
        assertSentinelMatch(
          sentinel.product,
          sentinel.year,
          sentinel.value
        );
      });

      done();
    });
  });

  describe('state values', function() {

    var stateProduction = yaml.safeLoad(
      fs.readFileSync(
        path.join(OUT_PATH, 'state_federal_production.yml'),
        'utf8'
      )
    );

    var assertSentinelMatch = function (products, product, year, value) {
      var expected = Math.round(value);
      var actual = products[product].volume[year].volume;
      assert.equal(
        expected, actual,
        'expected ' + value + ' for: ' + [product, year].join(' | ')
      );
    };

    it('check sentinel values', function(done) {

      var sentinels = [
        {
          state: 'AK',
          product: 'Oil (bbl)',
          year: 2014,
          value: 894025
        }
      ];

      sentinels.forEach(function(sentinel) {

        var products = stateProduction[sentinel.state].products;
        assertSentinelMatch(
          products,
          sentinel.product,
          sentinel.year,
          sentinel.value
        );
      });

      done();
    });
  });

  describe('county values', function() {
    var countyPath = '_data/federal_county_production';
    var counties = fs.readdirSync(countyPath);

    var regionProductionByArea = {};

    _.each(counties, function(region) {
      var areaProduction = path.join(countyPath, region);
      regionProductionByArea[region.split('.')[0]] = yaml.safeLoad(
        fs.readFileSync(areaProduction, 'utf8')
      );
    });

    var assertSentinelMatch = function (products, product, year, value) {
      var expected = Math.round(value),
        actual;
      try {
        actual = products[product].volume[year];
      } catch (error) {
        assert.ok(false, "product doesn't exist" + error);
      }

      assert.equal(
        expected, actual,
        'expected ' + value + ' for: ' + [product, year].join(' | ')
      );
    };

    it('check sentinels', function(done) {

      var sentinels = [
        {
          state: 'AK',
          county: 'North Slope Borough',
          fips: '02185',
          product: 'Oil (bbl)',
          year: 2014,
          value: 7693
        },
        {
          state: 'MS',
          county: 'Monroe County',
          fips: '28095',
          product: 'Gas (mcf)',
          year: 2012,
          value: 28554
        },
        {
          state: 'OH',
          county: 'Monroe County',
          fips: '39111',
          product: 'Oil (bbl)',
          year: 2012,
          value: 1350
        }

      ];

      sentinels.forEach(function(sentinel) {
        var products = regionProductionByArea[sentinel.state][sentinel.fips].products;
        assertSentinelMatch(
          products,
          sentinel.product,
          sentinel.year,
          sentinel.value
        );
      });

      done();
    });

  });

  describe('offshore values values', function() {
    var offshoreRegionsData = yaml.safeLoad(
      fs.readFileSync(
        path.join(OUT_PATH, 'offshore_federal_production_regions.yml'),
        'utf8'
      )
    );

    var offshoreAreaPath = '_data/offshore_federal_production_areas';
    var offshoreAreas = fs.readdirSync(offshoreAreaPath);

    var regionProductionByArea = {};

    _.each(offshoreAreas, function(region) {
      var areaProduction = path.join(offshoreAreaPath, region);
      regionProductionByArea[region.split('.')[0]] = yaml.safeLoad(
        fs.readFileSync(areaProduction, 'utf8')
      );
    });

    var assertSentinelMatch = function (products, product, year, value) {

      var expected = Math.round(value),
        actual;
      try {
        actual = Math.round(products[product].volume[year]);
      } catch (error) {
        assert.ok(false, "product doesn't exist" + error);
      }

      assert.equal(
        expected, actual,
        'expected ' + value + ' for: ' + [product, year].join(' | ')
      );
    };

    var offshoreRegions = Object.keys(offshoreRegionsData);
    var acceptedProducts = ['Salt (tons)', 'Oil (bbl)', 'Gas (mcf)'];

    var assertProductExists = function (products) {

      products.forEach(function(product) {
        var productExists = acceptedProducts.indexOf(product) > -1;

        assert.ok(
          productExists,
          product,
          ['product', product, 'doesn\'t exist'].join(' ')
        );
      });
    };

    var assertOnlyProducts = function (products) {
      var allProducts = _.union(products, acceptedProducts);
      var correctNumProducts = allProducts.length === acceptedProducts.length;
      assert.ok(
        correctNumProducts,
        products,
        ('products: ' + products.join(' | '))
      );
    };

    it('only has Oil, Gas, Salt', function(done) {

      offshoreRegions.forEach(function(region) {
        var products = offshoreRegionsData[region].products;
        var keys = Object.keys(products);
        assertProductExists(keys);
        assertOnlyProducts(keys);
      });

      done();
    });

    it('checks offshore areas', function(done){
       var sentinels = [
        {
          product: 'Salt (tons)',
          year: 2015,
          area: 'CGM',
          region: 'Gulf',
          value: null
        },
        {
          product: 'Gas (mcf)',
          year: 2011,
          area: 'EGM',
          region: 'Gulf',
          value: 107917419
        }
      ];

      sentinels.forEach(function(sentinel) {
        var products = regionProductionByArea
          [sentinel.region]
          [sentinel.area]
          .products;

        assertSentinelMatch(
          products,
          sentinel.product,
          sentinel.year,
          sentinel.value
        );
      });

      done();
    });

  });

});
