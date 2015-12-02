#!/usr/bin/env node
var yargs = require('yargs')
  .usage('$0 [options]')
  // .describe('natgas', 'The path of the onshore (state) data')
  .describe('naturalgas', 'The path of the offshore area data')
  .describe('sample', 'The path of the offshore area data')
  .describe('if', 'input format')
  .default('if', 'tsv')
  .describe('of', 'output format')
  .default('of', 'tsv')
  .alias('h', 'help')
  .wrap(120);
var options = yargs.argv;

if (options.help) {
  return yargs.showHelp();
}

var fs = require('fs');
var tito = require('tito').formats;
var async = require('async');
var d3 = require('d3');
var _ = require('lodash');
var util = require('../../lib/util');
var read = util.readData;
var streamify = require('stream-array');

async.parallel({
  // naturalgas: function readNaturalGas(done) {
  //   return read(
  //     options.naturalgas,
  //     tito.createReadStream(options['if']),
  //     done
  //   );
  // },
  sample: function readSample(done) {
    return read(
      options.sample,
      tito.createReadStream(options['if']),
      done
    );
  }
}, function(error, data) {
  if (error) return console.error(error);

  var results = [];
  var keys = [];
  Object.keys(data).forEach(function(commodity) {
    data[commodity].forEach(function(d, index) {
      var newResults = {};
      if (index === 0) {

        keys = _.keys(d, function(key,val){

          return key;

        })
      }

      // console.warn(d, '---', keys)

      console.warn('------------')
      _.forEach(keys, function(val, i){
        console.warn(index,val,'->', d[val], '=====')
        // console.warn(d[val], i)
        var newResults = {};
        if (index > 0) {
          if (val == 'Region' || !val){ return; }
          newResults.Year = d['Region'];
          newResults.Region = val;
          newResults.Commodity = commodity;
          newResults.Volume = d[val];
          results.push(newResults);
        } else {
          newResults.Production;
        }


      });

    });
  });

  streamify(results)
    .pipe(tito.createWriteStream(options['of']))
    .pipe(process.stdout);

});
