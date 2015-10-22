#!/usr/bin/env node
var options = require('../../lib/args')({
  usage: '$0 [--geo us|state|county] [options] [-o file]',
  wrap: 100,
  key: {
    desc: 'your BEA API key',
    default: process.env.BEA_API_KEY
  },
  geo: {
    desc: 'the geographical context: "us", "state", or "county"',
    default: 'us'
  },
  years: {
    desc: 'years for which to get data',
    default: '2004-2013'
  },
  industry: {
    desc: 'industries to list',
    // BEA industry codes; see input/bea/industries.json
    default: '21',
    alias: 'I'
  },
  of: {
    desc: 'output format (tito-compatible)',
    default: 'tsv'
  },
  o: {
    desc: 'write results to this filename'
  }
});

if (!options.key) {
  console.warn('You must provide the --key option or set $BEA_API_KEY');
  process.exit(1);
}

require('epipebomb')();

var tito = require('tito').formats;
var request = require('request');
var qs = require('querystring');
var _url = require('url');
var util = require('../../lib/util');
var thru = require('through2').obj;
var fs = require('fs');

var years = util.range(options.years);

// see: <http://www.bea.gov/API/bea_web_service_api_user_guide.htm>
var params = {
  UserID:       options.key,
  method:       'GetData',
  DataSetName:  null,
  Industry:     options.industry,
  Year:         years.join(',')
};

switch (options.geo) {
  case 'state':
    params.DataSetName = 'RegionalData';
    params.GeoFips = 'STATE';
    // see input/bea/key-codes.json for possible values:
    // "GDP_SP" = "GDP in current dollars (state annual product)"
    params.KeyCode = 'GDP_SP';
    break;
  case 'county':
    params.DataSetName = 'RegionalData';
    params.GeoFips = 'COUNTY';
    params.KeyCode = 'GDP_SP';
    break;
  default:
    params.DataSetName = 'GDPbyIndustry';
    // see input/bea/tables.json for possible values:
    // 5 = "Value Added by Industry as a Percentage of Gross Domestic Product (A) (Q)"
    params.TableID = 5;
    // A = Annual, Q = Quarterly
    params.Frequency = 'A';
}

var url = [
  'http://www.bea.gov/api/data/',
  qs.stringify(params)
].join('?');

console.warn('getting %s data...', options.geo);
console.warn('data URL:', url);

var parse = tito.createReadStream('json', {path: '.BEAAPI.Results.Data.*'});
var out = options.o ? fs.createWriteStream(options.o) : process.stdout;

request(url)
  .pipe(parse)
  .pipe(thru(options.geo === 'us' ? mapRow : mapGeo))
  .pipe(tito.createWriteStream(options.of))
  .pipe(out);

function mapRow(row, enc, next) {
  return next(null, {
    Year:     row.Year,
    Code:     row.Industry,
    // nice typo, guys
    Industry: row.IndustryDescription || row.IndustrYDescription,
    GDP:      row.DataValue
  });
}

function mapGeo(row, enc, next) {
  return next(null, {
    Year:     row.TimePeriod,
    Region:   row.GeoName,
    FIPS:     row.GeoFips.substr(0, 2),
    GDP:      row.DataValue
  });
}
