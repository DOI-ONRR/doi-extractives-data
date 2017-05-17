#!/usr/bin/env node
'use strict';
/* jshint node: true, esnext: true */

var glob = require('glob');
var path = require('path');
var yaml = require('js-yaml');
var utils = require('./utils');

var yargs = require('yargs')
  .describe('config', 'YAML configuration file')
  .describe('in', 'input directory of unzipped BLS data')
  .describe('year', 'the data year')
  .describe('out', 'output directory for commoditized data files');

var options = yargs.argv;
if (options.help) {
  return yargs.showHelp();
}

var YEAR = options.year || options.out;
if (!YEAR) {
  throw new Error('Expected --year or --out');
}

const fields = {
  code:     'own_code',
  fips:     'area_fips',
  aggLevel: 'agglvl_code',
  area:     'area_title',
  jobs:     'annual_avg_emplvl'
};

const validRow = (d, type) => {
  var code = +d[fields.code];
  if (type === 'All' && code !== 0) {
    return false;
  }
  var fips = d[fields.fips];
  return utils.validFips(fips);
};

const mapRow = (d, commodity) => {
  var state;
  var county;
  var area = d[fields.area];
  if (area.indexOf('--') > -1) {
    area = area.split(' -- ');
    state = area[0];
  } else {
    area = area.split(', ');
    state = area[1];
    county = area[0];
  }
  return {
    year:   YEAR,
    commodity: commodity,
    state:  state,
    county: county,
    fips:   d[fields.fips],
    jobs:   +d[fields.jobs],
  };
};

utils.readFile(options.config)
  .then(buffer => yaml.safeLoad(buffer))
  .then(config => {
    var naicsByName = config.naics;
    // console.warn('loaded NAICS codes:', naicsByName);
    return Object.keys(naicsByName).map(name => {
      var naics = naicsByName[name];
      var pattern = path.join(
        String(options.in), `${YEAR}.annual ${naics} *.csv`
      );
      var input = glob.sync(pattern);
      if (!input.length) {
        console.warn('no input file found for "%s"', pattern);
        return;
      } else if (input.length > 1) {
        throw new Error(
          'Multiple input files found for "' + pattern + '": ' +
          input.join(', ')
        );
      }
      var slug = utils.slugify(name);
      return {
        name: name,
        slug: slug,
        naics: naics,
        input: input[0],
        output: path.join(
          String(options.out), `commodity/${slug}.tsv`
        ),
      };
    })
    // remove tasks with no files
    .filter(task => task);
  })
  .then(tasks => {
    return Promise.all(tasks.map(task => {
      return utils.readData(task.input)
        .then(data => {
          task.data = data
            .filter(d => validRow(d, task.name))
            .map(d => mapRow(d, task.name))
            .filter(d => d.jobs > 0);
          console.warn('read %d rows (%d filtered) from %s',
                       data.length, task.data.length, task.input);
          return task;
        });
    }));
  })
  .then(tasks => {
    return Promise.all(tasks.map(task => {
      console.warn('writing %d rows to %s', task.data.length, task.output);
      return utils.writeData(task.output, task.data)
        .then(() => task);
    }));
  })
  .then(tasks => {
    var out = path.join(String(YEAR), 'joined.tsv');
    var data = tasks.reduce((acc, task) => {
      return acc.concat(task.data);
    }, []);
    console.warn('writing %d rows to %s', data.length, out);
    return utils.writeData(out, data);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
