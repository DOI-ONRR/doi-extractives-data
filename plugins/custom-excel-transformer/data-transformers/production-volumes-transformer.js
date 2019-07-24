'use strict'
/**
 *
 * This takes the input of the production volume spreadsheet and transforms the data to
 * application friendly graphql node. This will allow the app to easily filter, sort and
 * group the data using graphql queries and have it ready to be displayed on our site.
 *
 **/

/* Use ES5 require in order to be compatible with version 1.x of gatsby */

const CONSTANTS = require('../../../src/js/constants')

/* Define the column names found in the excel file */
const SOURCE_COLUMNS = {
  Month: 'month',
  CalendarYear: 'calendar year',
  FiscalYear: 'fiscal year',
  ProductionDate: 'production date',
  LandCategory: 'land class',
  OnshoreOffshore: 'land category',
  Commodity: 'commodity',
  Product: 'product',
  Volume: 'volume',
  Withheld: 'withheld',
  County: 'county',
  FipsCode: 'fips code',
  State: 'state',
  OffshoreRegion: 'offshore region'
}

/* List of all the products in the excel file and the corresponding column name */
const SOURCE_COMMODITIES = {
  OilProductionVolume: 'Oil Prod Vol (bbl)',
  GasProductionVolume: 'Gas Prod Vol (mcf)',
  CoalProductionVolume: 'Coal Prod Vol (ton)',
}
/* List of all the products in the excel file and the corresponding column name */
const SOURCE_COMMODITIES_FISCAL_YEAR = {
  OilProductionVolume: 'Oil (bbl)',
  GasProductionVolume: 'Gas (mcf)',
  CoalProductionVolume: 'Coal (tons)',
  CoalTonProductionVolume: 'Coal (ton)',
}

/* Map the source column name to the display name we want to use for that product */
const SOURCE_COLUMN_TO_PRODUCT_DISPLAY_NAME = {
  [SOURCE_COMMODITIES.OilProductionVolume]: 'Oil',
  [SOURCE_COMMODITIES.GasProductionVolume]: 'Gas',
  [SOURCE_COMMODITIES.CoalProductionVolume]: 'Coal',
  [SOURCE_COMMODITIES_FISCAL_YEAR.OilProductionVolume]: 'Oil',
  [SOURCE_COMMODITIES_FISCAL_YEAR.GasProductionVolume]: 'Gas',
  [SOURCE_COMMODITIES_FISCAL_YEAR.CoalProductionVolume]: 'Coal',
  [SOURCE_COMMODITIES_FISCAL_YEAR.CoalTonProductionVolume]: 'Coal',
}

/* Map the source column name to the units used for that product */
const SOURCE_COLUMN_TO_PRODUCT_UNITS = {
  [SOURCE_COMMODITIES.OilProductionVolume]: 'bbl',
  [SOURCE_COMMODITIES.GasProductionVolume]: 'mcf',
  [SOURCE_COMMODITIES.CoalProductionVolume]: 'tons',
  [SOURCE_COMMODITIES_FISCAL_YEAR.OilProductionVolume]: 'bbl',
  [SOURCE_COMMODITIES_FISCAL_YEAR.GasProductionVolume]: 'mcf',
  [SOURCE_COMMODITIES_FISCAL_YEAR.CoalProductionVolume]: 'tons',
  [SOURCE_COMMODITIES_FISCAL_YEAR.CoalTonProductionVolume]: 'tons',
}

const PRODUCT_UNITS_TO_LONG_UNITS = {
  'bbl': 'barrels',
  'mcf': 'mcf',
  'tons': 'tons',
}

const LOCATION_TYPE_TO_DISPLAY_NAME = {
  'OFFSHORE': 'Offshore',
  'ONSHORE': 'Onshore',
}

const LOCATION_CATEGORY_TYPE_TO_PRODUCTION_CATEGORY = {
  'Federal': {
    'Offshore': CONSTANTS.FEDERAL_OFFSHORE,
    'Onshore': CONSTANTS.FEDERAL_ONSHORE,
  },
  'Indian': {
    'Offshore': CONSTANTS.NATIVE_AMERICAN,
    'Onshore': CONSTANTS.NATIVE_AMERICAN,
  },
  'Native American': {
    'Offshore': CONSTANTS.NATIVE_AMERICAN,
    'Onshore': CONSTANTS.NATIVE_AMERICAN,
  },
}

/* Use ES5 exports in order to be compatible with version 1.x of gatsby */
module.exports = (node, type) => {
  return createProductVolumeNodeByProduct(node, type)
}

const createProductVolumeNodeByProduct = (productVolumeData, type) => {
  // convert all keys to lower case and trim the spaces, this is done due to ongoing issues with the excel files being formatted differently
  // eslint-disable-next-line
  const data = Object.keys(productVolumeData).reduce((c, k) => (c[k.toLowerCase().trim()] = productVolumeData[k], c), {})

  if (data[SOURCE_COLUMNS.Commodity] === undefined && data[SOURCE_COLUMNS.Product] === undefined) return
  let product = data[SOURCE_COLUMNS.Commodity] || data[SOURCE_COLUMNS.Product]
  let matchProductNameRE = (product.includes('Geothermal')) ? /([^-]+)/ :  /([^(*)]+)/
  let result = product.split(matchProductNameRE)

  let units = result[3].trim()
  // @TODO - Geothermal has multiple sources/units need to use this to get unique product names for all geothermal, this should be refactored
  let productName = (product.includes('Geothermal')) ? result[1].trim()+'~'+units : result[1].trim()

  let node = {
	  ProductionMonth: data[SOURCE_COLUMNS.Month],
	  ProductionYear: data[SOURCE_COLUMNS.CalendarYear],
	  FiscalYear: data[SOURCE_COLUMNS.FiscalYear],
	  LandClass: data[SOURCE_COLUMNS.CalendarYear],
	  LandCategory: data[SOURCE_COLUMNS.LandCategory].trim(),
	  OnshoreOffshore: data[SOURCE_COLUMNS.OnshoreOffshore],
	  ProductName: SOURCE_COLUMN_TO_PRODUCT_DISPLAY_NAME[product] || productName,
	  Volume: data[SOURCE_COLUMNS.Volume],
    Withheld: data[SOURCE_COLUMNS.Withheld],
    County: data[SOURCE_COLUMNS.County],
    FipsCode: data[SOURCE_COLUMNS.FipsCode],
    State: data[SOURCE_COLUMNS.State],
    OffshoreRegion: data[SOURCE_COLUMNS.OffshoreRegion],
	  internal: {
	    type: type,
	  }
  }

  node.ProductionDate = (node.ProductionYear)
    ? new Date(node.ProductionYear, getMonthFromString(node.ProductionMonth))
    : new Date(node.FiscalYear, 0)

  node.Units = SOURCE_COLUMN_TO_PRODUCT_UNITS[product] || units
  node.LongUnits = PRODUCT_UNITS_TO_LONG_UNITS[node.Units]
  node.LandCategory_OnshoreOffshore =
		node.LandCategory + ((node.OnshoreOffshore && node.LandCategory !== 'Native American') ? ' ' + node.OnshoreOffshore.toLowerCase() : '')
  node.DisplayMonth = node.ProductionMonth && node.ProductionMonth.substring(0, 3)
  node.DisplayYear = node.ProductionYear && ("'" + node.ProductionYear.toString().substring(2))

  return node
}

function getMonthFromString (month) {
  let d = Date.parse(month + '1, 2012')
  if (!isNaN(d)) {
    return new Date(d).getMonth() + 1
  }
  return -1
}
