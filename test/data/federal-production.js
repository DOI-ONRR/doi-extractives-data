/* jshint node: true, mocha: true */
/* jshint -W089 */
/* jshint -W110 */
var tito = require('tito');
var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var assert = require('assert');
var async = require('async');
var _ = require('lodash');


var OUT_PATH = path.join(__dirname, '../../_data');

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

var loadAll = function(dir, done) {
  fs.readdir(dir, function(error, files) {
    if (error) {
      return done(error);
    }
    async.mapSeries(files, function(filename, next) {
      filename = path.join(dir, filename);
      var ext = filename.split('.').pop();
      load(filename, ext, next);
    }, function(error, files) {
      done(error, (files || []).reduce(function(rows, data) {
        return rows.concat(data);
      }, []));
    });
  });
};


describe('federal production (ONRR)', function() {

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
      assert.equal(
        expected, actual,
        'expected ' + value + ' for: ' + [product, year].join(' | ')
      );
    }

    xit('check sentinel values', function(done) {

      var sentinels = [
        {
          product: 'Salt (tons)',
          year: 2015,
          value: 764801
        },
        {
          product: 'Salt (tons)',
          year: 2006,
          value: 512832
        },
        {
          product: 'Oil (bbl)',
          year: 2013,
          value: 623103687.09
        },
        {
          product: 'Oil (bbl)',
          year: 2015,
          value: 755158058.14
        },
        {
          product: 'Gas (mcf)',
          year: 2013,
          value: 4941408110
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

  describe('offshore values values', function() {



    var offshoreRegionsData = yaml.safeLoad(
      fs.readFileSync(
        path.join(OUT_PATH, 'offshore_federal_production_regions.yml'),
        'utf8'
      )
    );

    var offshoreAreaPath = '_data/offshore_federal_production_areas';
    var offshoreAreas = fs.readdirSync(offshoreAreaPath);

    regionProductionByArea = {}

    _.each(offshoreAreas, function(region) {
      var areaProduction = path.join(offshoreAreaPath, region);
      regionProductionByArea[region.split('.')[0]] = yaml.safeLoad(
        fs.readFileSync(areaProduction, 'utf8')
      );
    });

    var assertSentinelMatch = function (products, product, year, value) {
      var expected = Math.round(value);
      try {
        var actual = products[product].volume[year];
      } catch (error) {
        assert.ok(false, "product doesn't exist" + error);
      }

      assert.equal(
        expected, actual,
        'expected ' + value + ' for: ' + [product, year].join(' | ')
      );
    }

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
    }

    var assertOnlyProducts = function (products) {
      var allProducts = _.union(products, acceptedProducts);
      var correctNumberProducts = allProducts.length === acceptedProducts.length;
      assert.ok(
        correctNumberProducts,
        products,
        ('products: ' + products.join(' | '))
      );
    }

    it('only has Oil, Gas, Salt', function(done) {

      offshoreRegions.forEach(function(region) {
        var products = offshoreRegionsData[region].products;
        var keys = Object.keys(products)
        assertProductExists(keys);
        assertOnlyProducts(keys);
      })

      done();
    });

    // [pending] until issue with Withheld Salt data
    // is sorted out.
    xit('checks offshore areas', function(done){
       var sentinels = [
        {
          product: 'Salt (tons)',
          year: 2015,
          area: 'CGM',
          region: 'Gulf',
          value: 'Withheld'
        }
      ];

      sentinels.forEach(function(sentinel) {
        var products = regionProductionByArea[sentinel.region][sentinel.area].products;

        assertSentinelMatch(
          products,
          sentinel.product,
          sentinel.year,
          sentinel.value
        );
      });

      done()
    })

  });

});
