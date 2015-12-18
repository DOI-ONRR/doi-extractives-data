#!/usr/bin/env node
var yargs = require('yargs')
  .usage('$0 [options]')
  .describe('naturalgas', 'The path of the first dataset for naturalgas')
  .describe('naturalgas2', 'The path of the second dataset for naturalgas')
  .describe('oil', 'The path of the dataset for oil')
  .describe('coal', 'The path of the dataset for coal')
  .describe('countycoal', 'The path of the dataset for coal to be broken down by county')
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
  'Rhode Island': 'RI',
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
  countycoal: function readCountyCoal(done) {
    return read(
      options.countycoal,
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

  // toggle to parse data for county coal
  var shouldParseCountyCoal = data['countycoal'];
  console.warn(shouldParseCountyCoal)


  Object.keys(data).forEach(function(commodity) {

    var parseCountyCoal = function(commodity, data, years) {
      var commodity = 'countycoal';

      var getStates = function(data, commodity, column) {

        var allColumn = _.map(data[commodity], function(data) {
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
          var getMatches = function(product) {
            var volumes = _.pluck(_.where(data[commodity], {'Year': year, 'Mine State': state}), product);
            volumes = _.map(volumes, trimCommas);

            // volumes = _.reduce(volumes, function(total, n) {
            //   return total + n;
            // });

            var matches = {
              'county': _.pluck(_.where(data[commodity], {'Year': year, 'Mine State': state}), 'Mine County'),
              'volume': volumes
            }



            var zippedObj = _.zip(matches.county, matches.volume);

            zippedObj = _.reduce(zippedObj, function(total, n, i) {
              var total = total || {};
              if (typeof(total[n[0]]) === undefined || typeof(total[n[0]]) === 'undefined') {
                  total[n[0]] = n[1];
              } else {
                total[n[0]] += n[1];
              }
              return total;
            }, {});

            return zippedObj;
          }


          // terrible hack because of inconsistencies in the data
          var productionByState = (year == '2012')
            ? getMatches('Coal Supply Region')
            : getMatches('Production (short tons)');



          // console.warn(state, '->',productionByState, year)
          var countyKey = {
            'LA': 'Parish',
            'AK': {
              'Yukon-Koyukuk': 'Census Area',
              'Fairbanks North Star': 'Borough'
            }
          }

          function formatCounty(county) {
            return (county === 'Mclean')
              ? 'McLean'
              : county;
          }
          // console.warn(state, year, '==>', productionByState)
          // this conditional might need to be revisited
          if (productionByState){
            Object.keys(productionByState).forEach(function(county) {

              var volume = productionByState[county];
              // console.warn(state, year, '==>', county, volume)
              if (volume) {
                var newResults = {};
                newResults.State = state;
                newResults.County = formatCounty(county);
                // console.warn(state)
                newResults.County += !countyKey[state]
                  ? ' County'
                  : countyKey[state][county]
                    ? ' ' + countyKey[state][county]
                    : ' ' + countyKey[state]
                // console.warn(newResults.County)
                newResults.Year = year;
                newResults.Volume = volume;
                newResults.Commodity = '';
                newResults.Product = 'Coal (short tons)';
                // console.warn(newResults)
                results.push(newResults)
              }
            });
          }
        });
      });
    };

    var parseRenewables = function(commodity, data, years){

      var renewablesTotals = [];

      _.forEach(data[commodity], function(d) {

        var productKey = {
          'Conventional Hydroelectric': 'Conventional Hydroelectric',
          'All Other Renewables': 'Other Renewables',
          'Wind': 'Wind',
          'Other biomass': 'Other Biomass',
          'Biomass (total)': 'Total Biomass',
          'Wood and wood-derived fuels': 'Wood and wood-derived fuels',
          'Solar': 'Solar',
          'Geothermal': 'Geothermal'
        }

        if (stateKey[d.State]){
          years.forEach(function(year){
            var volume = d[year];
            if (volume == '' || volume == '--'){ return; }
            var newResults = {};
            newResults.Region = stateKey[d.State];
            newResults.Year = year;
            newResults.Volume = volume * 1000;
            newResults.Commodity = '';
            newResults.Product = productKey[d.Source]
            newResults.Product += ' (Mwh)';
            if (shouldParseCountyCoal) {
              newResults.County = '';
              newResults.State = stateKey[d.State];
            }
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

          var newResults = {};
          newResults.Region = region;
          newResults.Year = year;
          newResults.Volume = volume;
          newResults.Commodity = '';
          newResults.Product = 'All Renewables (Mwh)';
          if (shouldParseCountyCoal) {
            newResults.County = '';
            newResults.State = region;
          }

          results.push(newResults);

        });
      });

      _.forEach(data[commodity],function(d) {


        if (stateKey[d.State]){
          years.forEach(function(year){
            var matches = _.where(renewablesTotals, { Region: stateKey[d.State], Year: year});

            var stateYearMatch = {};
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

      // console.warn(data[commodity])

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
            if (shouldParseCountyCoal) {
              newResults.County = '';
              newResults.State = state;
            } else {
              newResults.Region = state;
            }
            newResults.Year = year;
            newResults.Volume = productionByState;
            newResults.Commodity = '';
            newResults.Product = 'Coal (short tons)';

            results.push(newResults);
          }
        });
      });
    }

    var parseOther = function(commodity, data, years){
      data[commodity].forEach(function(d, index) {

        if (index === 0) {

          keys = _.keys(d, function(key){
            return key;
          });
        }

        _.forEach(keys, function(val, i){
          var inYearRange = years.indexOf(d['Year']) >= 0;

          // console.warn(index,val,'->', d['Year'], '=====', inYearRange)

          var newResults = {};

          var invalidRow = (val === 'Year'),
            emptyRow = !val,
            firstRow = (i === 0),
            regionIsUS = (val === 'US');

          if (invalidRow || emptyRow || firstRow || !inYearRange || regionIsUS){ return; }
          newResults.Year = d['Year'];
          newResults.Commodity = commodity;
          newResults.Volume = d[val] ? d[val] : 0;
          if (shouldParseCountyCoal) {
            newResults.County = '';
            newResults.State = val;
          } else {
            newResults.Region = val;
          }


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
        if (!shouldParseCountyCoal) {
          parseCoal(commodity, data, years);
        }
        break;
      case 'countycoal':
        if (shouldParseCountyCoal) {
          parseCountyCoal(commodity, data, years);
        }
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
