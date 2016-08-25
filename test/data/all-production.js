'use strict';
/* jshint node: true, mocha: true */
/* jshint -W089 */
/* jshint -W110 */
const tito = require('tito');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const assert = require('assert');
const async = require('async');

const UNIT_MAP = {
  'thousand megawatthours': 'mmwh'
};

const load = function(filename, format, done) {
  const rows = [];
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

const round = function(num, precision) {
  return (+num).toFixed(precision || 3);
};

const loadAll = function(dir, done) {
  fs.readdir(dir, function(error, files) {
    if (error) {
      return done(error);
    }
    async.mapSeries(files, function(filename, next) {
      filename = path.join(dir, filename);
      const ext = filename.split('.').pop();
      load(filename, ext, next);
    }, function(error, files) {
      done(error, (files || []).reduce(function(rows, data) {
        return rows.concat(data);
      }, []));
    });
  });
};

const assertVolumeMatch = function(
  inputVolume, inputUnits, outputVolume, outputUnits
) {
  inputUnits = UNIT_MAP[inputUnits.toLowerCase()]
    || inputUnits.toLowerCase();

  const precision = 3;
  const reason = [
    inputVolume, '(' + inputUnits + ')',
    'to',
    outputVolume, '(' + outputUnits + ')'
  ].join(' ');

  if (inputUnits === outputUnits) {
    assert.equal(
      inputVolume,
      outputVolume,
      reason
    );
  } else if (inputUnits === ('m' + outputUnits.toLowerCase())) {
    assert.equal(
      round(inputVolume, precision),
      round(outputVolume / 1000, precision),
      reason
    );
  } else {
    assert.ok(false, 'unrecognized unit conversion: ' + reason);
  }
};

describe('all production (EIA)', function() {

  const inputPath = path.join(
    __dirname,
    '../../data/all-production/product'
  );

  describe('national values', function() {

    const outputPath = path.join(__dirname, '../../_data');
    const nationalValues = yaml.safeLoad(
      fs.readFileSync(
        path.join(outputPath, 'national_all_production.yml'),
        'utf8'
      )
    );
    const products = nationalValues.US.products;

    it('YAML matches all national rows in input', function(done) {
      loadAll(inputPath, function(error, rows) {
        if (error) {
          return done(error);
        }
        var product;
        var year;
        var volume;
        var units;
        var matches;
        var match;
        const filter = function(d) {
          return d.region === 'US'
              && d.product === product
              && d.year === year
        };
        for (product in products) {
          for (year in products[product].volume) {
            volume = products[product].volume[year];
            units = products[product].units;
            matches = rows.filter(filter);
            assert.equal(matches.length, 1);
            match = matches[0];
            assertVolumeMatch(
              match.volume,
              match.units,
              volume,
              units
            );
          }
        }
        done();
      });
    });

    it('all national input rows exist in YAML', function(done) {
      loadAll(inputPath, function(error, rows) {
        if (error) {
          return done(error);
        }

        var volume;
        var units;
        var matchUnits;

        rows
          .filter(function(d) { return d.region === 'US'; })
          .forEach(function(d) {
            try {
              volume = products[d.product].volume[d.year];
            } catch (error) {
              throw new Error('no YAML data for row: ' + JSON.stringify(d));
            }

            units = products[d.product].units;
            assertVolumeMatch(
              d.volume,
              d.units,
              volume,
              units
            );
            matchUnits = UNIT_MAP[d.units.toLowerCase()]
              || d.units.toLowerCase();
            if (units === d.units) {
              assert.equal(volume, d.volume);
            } else if (matchUnits === ('m' + units.toLowerCase())) {
              assert.equal(round(volume / 1000, 3), round(d.volume, 3));
            } else {
              console.warn('unrecognized unit conversion:', matchUnits, '->', units);
            }
          });

        done();
      });
    });

  });

  describe('state values', function(done) {
  });

  xdescribe('offshore values', function(done) {
  });

});
