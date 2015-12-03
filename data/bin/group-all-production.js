#!/usr/bin/env node
var yargs = require('yargs')
  .usage('$0 [options]')
  .describe('naturalgas', 'The path of the first dataset for naturalgas')
  .describe('naturalgas2', 'The path of the second dataset for naturalgas')
  .describe('oil', 'The path of the dataset for oil')
  .describe('coal', 'The path of the dataset for coal')
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

var stateKey = {
  'Alabama': 'AL',
  'Alaska': 'AK',
  'Arizona': 'AZ',
  'Arkansas': 'AR',
  'Colorado': 'CO',
  'Illinois': 'IL',
  'Indiana': 'IN',
  'Kansas': 'KS',
  'Kentucky (East)': 'KY',
  'Kentucky (West)': 'KY',
  'Louisiana': 'LA',
  'Maryland': 'MD',
  'Mississippi': 'MS',
  'Missouri': 'MO',
  'Montana': 'MT',
  'New Mexico': 'NM',
  'North Dakota': 'ND',
  'Ohio': 'OH',
  'Oklahoma': 'OK',
  'Pennsylvania (Bituminous)': 'PA',
  'Pennsylvania (Anthracite)': 'PA',
  'Tennessee': 'TN',
  'Texas': 'TX',
  'Utah': 'UT',
  'Virginia': 'VA',
  'West Virginia (Northern)': 'WV',
  'West Virginia (Southern)': 'WV',
  'Wyoming': 'WY',
  'Refuse Recovery': false
}

async.parallel({
  naturalgas: function readNaturalGas(done) {
    return read(
      options.naturalgas,
      tito.createReadStream(options['if']),
      done
    );
  },
  naturalgas2: function readNaturalGas2(done) {
    return read(
      options.naturalgas2,
      tito.createReadStream(options['if']),
      done
    );
  },
  oil: function readOil(done) {
    return read(
      options.oil,
      tito.createReadStream(options['if']),
      done
    );
  },
  coal: function readCoal(done) {
    return read(
      options.coal,
      tito.createReadStream(options['if']),
      done
    );
  }
}, function(error, data) {
  if (error) return console.error(error);

  var results = [];
  var keys = [];
  var productionUnits;

  var trimCommas = function(str){
    if (typeof(str) == 'number') {
      return str;
    } else {
      str = str.replace(/\,/g, '');
      var num = parseInt(str, 10);
      return num;
    }
  }

  Object.keys(data).forEach(function(commodity) {

      var parseCoal = function(commodity, data){

        // console.warn(data[commodity])
        var getUniqueColumn = function(data, commodity, column) {

          var allColumn = _.map(data[commodity], function(data, n) {
            return data[column]
          })
          return _.unique(allColumn);
        }

        // Abbreviate States
        data[commodity] = _.forEach(data[commodity], function(d){
          d['Mine State'] = stateKey[d['Mine State']];
        });

        var states = getUniqueColumn(data, commodity, 'Mine State');
        // var years = getUniqueColumn(data, commodity, 'Year');

        // Reject states that non-complient statest
        states = _.filter(states, function(n){
          return n;
        });

        _.forEach(states, function(state) {

          // Get Production Numbers (only have data for 2013)
          var productionByState = _.pluck(_.where(data[commodity], {'Year': '2013', 'Mine State': state}), 'Production (short tons)');

          productionByState = _.map(productionByState, trimCommas);

          productionByState = _.reduce(productionByState, function(total, n) {
            return total + n;
          });
          console.warn(state, productionByState)

          // console.warn(state, '->',productionByState)

          var newResults = {};
          newResults.Region = state;
          newResults.Year = '2013';
          newResults.Volume = productionByState;
          newResults.Commodity = 'Coal';
          newResults.Product = 'short tons';

          // console.warn(newResults)
          results.push(newResults)

        });
      }

      var parseOther = function(commodity, data){
        data[commodity].forEach(function(d, index) {
          var newResults = {};
          if (index === 0) {

            keys = _.keys(d, function(key,val){
              return key;
            });
            productionUnits = d[keys[1]];
          }

          // console.warn('------------')
          _.forEach(keys, function(val, i){
            // console.warn(index,val,'->', d[val], '=====')
            var newResults = {};
            if (val == 'Year' || !val || index === 0){ return; }
            newResults.Year = d['Year'];
            newResults.Region = val;
            newResults.Commodity = commodity;
            switch(commodity) {
              case 'naturalgas':
                  newResults.Commodity = 'Natural Gas';
                  break;
              case 'naturalgas2':
                  newResults.Commodity = 'Natural Gas';
                  break;
              case 'oil':
                  newResults.Commodity = 'Crude Oil';
                  break;
              default:
                  newResults.Commodity = commodity;
            }
            newResults.Volume = d[val] ? d[val] : 0;
            newResults.Product = productionUnits;
            results.push(newResults);
          });
        });
      }

      switch(commodity) {

        case 'coal':
          parseCoal(commodity, data);
          break;
        default:
          parseOther(commodity, data);
          break;
      }
  });

  streamify(results)
    .pipe(tito.createWriteStream(options['of']))
    .pipe(process.stdout);

});
