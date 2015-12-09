#!/usr/bin/env node
var yargs = require('yargs')
  .usage('$0 [options]')
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

      console.warn(data[commodity])

      var states = getStates(data, commodity, 'Mine State');

      // Reject states that non-complient statest
      states = _.filter(states, function(n){
        return n;
      });

      _.forEach(states, function(state) {
        years.forEach(function(year){

          // Get Production Numbers (only have data for 2013)
          var getProductionByState = function(product) {
            return _.pluck(_.where(data[commodity], {'Year': year, 'Mine State': state}), product);
          }
          // terrible hack because of inconsistencies in the data
          var productionByState = (year == '2012')
            ? getProductionByState('Coal Supply Region')
            : getProductionByState('Production (short tons)');

          productionByState = _.map(productionByState, trimCommas);

          productionByState = _.reduce(productionByState, function(total, n) {
            return total + n;
          });

          // console.warn(state, '->',productionByState, year)

          if (productionByState){

            var newResults = {};
            newResults.Region = state;
            newResults.Year = year;
            newResults.Volume = productionByState;
            newResults.Commodity = '';
            newResults.Product = 'Coal (short tons)';

            results.push(newResults)
          }
        });
      });

  });

  streamify(results)
    .pipe(tito.createWriteStream(options['of']))
    .pipe(process.stdout);

});
