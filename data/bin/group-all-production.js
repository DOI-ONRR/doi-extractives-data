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
  'California': 'CA',
  'Colorado': 'CO',
  'Connecticut': 'CT',
  'Delaware': 'DE',
  'District of Columbia': 'DC',
  'Florida': 'FL',
  'Georgia': 'GA',
  'Hawaii': 'HI',
  'Idaho': 'ID',
  'Illinois': 'IL',
  'Indiana': 'IN',
  'Iowa': 'IA',
  'Kansas': 'KS',
  'Kentucky (East)': 'KY',
  'Kentucky (West)': 'KY',
  'Kentucky': 'KY',
  'Louisiana': 'LA',
  'Maine': 'ME',
  'Maryland': 'MD',
  'Massachusetts': 'MA',
  'Michigan': 'MI',
  'Minnesota': 'MN',
  'Mississippi': 'MS',
  'Missouri': 'MO',
  'Montana': 'MT',
  'Nebraska': 'NE',
  'Nevada': 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  'Ohio': 'OH',
  'Oklahoma': 'OK',
  'Oregon': 'OR',
  'Pennsylvania (Bituminous)': 'PA',
  'Pennsylvania (Anthracite)': 'PA',
  'Pennsylvania': 'PA',
  'Rhode Island': 'RD',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  'Tennessee': 'TN',
  'Texas': 'TX',
  'Utah': 'UT',
  'Vermont': 'VT',
  'Virginia': 'VA',
  'Washington': 'WA',
  'West Virginia (Northern)': 'WV',
  'West Virginia (Southern)': 'WV',
  'West Virginia': 'WV',
  'Wisconsin': 'WI',
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
  },
  renewables: function readRenewables(done) {
    return read(
      options.renewables,
      tito.createReadStream(options['if']),
      done
    );
  }
}, function(error, data) {
  if (error) return console.error(error);

  var results = [];
  var keys = [];

  var trimCommas = function(str){
    if (typeof(str) == 'number') {
      return str;
    } else {
      str = str.replace(/\,/g, '');
      var num = parseInt(str, 10);
      return num;
    }
  }

  var years = [
    '2004',
    '2005',
    '2006',
    '2007',
    '2008',
    '2009',
    '2010',
    '2011',
    '2012',
    '2013'
  ];

  Object.keys(data).forEach(function(commodity) {

    var parseRenewables = function(commodity, data, years){

      var renewablesTotals = [];

      _.forEach(data[commodity], function(d, index) {

        if (stateKey[d.State]){
          years.forEach(function(year){
            var volume = d[year];
            if (volume == '' || volume == '--'){ return; }
            newResults = {};
            newResults.Region = stateKey[d.State];
            newResults.Year = year;
            newResults.Volume = volume;
            newResults.Commodity = '';
            newResults.Product = d.Source + ' (Kwh)';
            // console.warn(newResults, '=======')
            renewablesTotals.push(newResults);
            results.push(newResults);
          });
        }
      });

      var regionsUsed = _.unique(_.map(renewablesTotals, 'Region'));
      var yearsUsed = _.unique(_.map(renewablesTotals, 'Year'));

      _.forEach(regionsUsed, function(region){
        _.forEach(yearsUsed, function(year){
          var intersection = _.where(renewablesTotals, { Region: region, Year: year });

          var volume = _.map(intersection, function(val) {
            return +val.Volume;
          })

          volume = _.reduce(volume, function(total, n) {
            return total + n;
          });

          newResults = {};
          newResults.Region = region;
          newResults.Year = year;
          newResults.Volume = volume;
          newResults.Commodity = '';
          newResults.Product = 'Renewables Total (Kwh)';

          results.push(newResults);

        });
      });

      _.forEach(data[commodity],function(d, index) {


        if (stateKey[d.State]){
          years.forEach(function(year){
            var matches = _.where(renewablesTotals, { Region: stateKey[d.State], Year: year});

            stateYearMatch = {};
            stateYearMatch.Region = stateKey[d.State];
            stateYearMatch.Year = year;
            stateYearMatch.Volume = d[year];
            stateYearMatch.Commodity = '';
            stateYearMatch.Product = d.Source + ' (Kwh)';

          });
        }
      });
    }

    var parseCoal = function(commodity, data, years){

      var getStates = function(data, commodity, column) {

        var allColumn = _.map(data[commodity], function(data, n) {
          return data[column]
        })
        return _.unique(allColumn);
      }

      // Abbreviate States
      data[commodity] = _.forEach(data[commodity], function(d){
        d['Mine State'] = stateKey[d['Mine State']];
      });

      var states = getStates(data, commodity, 'Mine State');

      // Reject states that non-complient statest
      states = _.filter(states, function(n){
        return n;
      });

      _.forEach(states, function(state) {
        years.forEach(function(year){
          // Get Production Numbers (only have data for 2013)
          var productionByState = _.pluck(_.where(data[commodity], {'Year': year, 'Mine State': state}), 'Production (short tons)');

          productionByState = _.map(productionByState, trimCommas);

          productionByState = _.reduce(productionByState, function(total, n) {
            return total + n;
          });

          // console.warn(state, '->',productionByState)

          var newResults = {};
          newResults.Region = state;
          newResults.Year = year;
          newResults.Volume = productionByState;
          newResults.Commodity = '';
          newResults.Product = 'Coal (short tons)';

          results.push(newResults)
        });
      });
    }

    var parseOther = function(commodity, data, years){
      data[commodity].forEach(function(d, index) {


        var newResults = {};
        if (index === 0) {

          keys = _.keys(d, function(key,val){
            return key;
          });
        }

        _.forEach(keys, function(val, i){
          var inYearRange = years.indexOf(d['Year']) >= 0;

          // console.warn(index,val,'->', d['Year'], '=====', inYearRange)

          var newResults = {};

          if (val == 'Year' || !val || i === 0 || !inYearRange){ return; }
          newResults.Year = d['Year'];
          newResults.Region = val;
          newResults.Commodity = commodity;
          newResults.Volume = d[val] ? d[val] : 0;

          switch(commodity) {
            case 'naturalgas':
                newResults.Product = 'Natural Gas (MMcf)';
                newResults.Commodity = '';
                break;
            case 'naturalgas2':
                newResults.Product = 'Natural Gas (MMcf)';
                newResults.Commodity = '';
                break;
            case 'oil':
                newResults.Product = 'Crude Oil (bbl)';
                newResults.Commodity = '';
                newResults.Volume = newResults.Volume * 1000;
                break;
            default:
                newResults.Commodity = commodity;
          }
          results.push(newResults);
        });
      });
    }
    switch(commodity) {
      case 'coal':
        // console.warn(commodity, '--> done!')
        parseCoal(commodity, data, years);
        break;
      case 'renewables':
        // console.warn(commodity, '--> done!')
        parseRenewables(commodity, data, years);
        break;
      default:
        // console.warn(commodity, '--> done!')
        parseOther(commodity, data, years);
        break;
    }
  });

  streamify(results)
    .pipe(tito.createWriteStream(options['of']))
    .pipe(process.stdout);

});
