'use strict'
/**
 *
 * This takes the input of the production volume spreadsheet and transforms the data to
 * application friendly graphql node. This will allow the app to easily filter, sort and
 * group the data using graphql queries and have it ready to be displayed on our site.
 *
 **/

/* Use ES5 require in order to be compatible with version 1.x of gatsby */
const crypto = require('crypto')

const CONSTANTS = require('../../js/constants')

/* Define the column names found in the excel file */
const SOURCE_COLUMNS = {
  Month: 'Month',
  CalendarYear: 'Calendar Year',
  ProductionDate: 'Production Date',
  LandCategory: 'Land Class',
  OnshoreOffshore: 'Land Category',
  Commodity: 'Commodity',
  Volume: 'Volume',
}

/* List of all the products in the excel file and the corresponding column name */
const SOURCE_COMMODITIES = {
  OilProductionVolume: 'Oil Prod Vol (bbl)',
  GasProductionVolume: 'Gas Prod Vol (mcf)',
  CoalProductionVolume: 'Coal Prod Vol (ton)',
}

/* Map the source column name to the display name we want to use for that product */
const SOURCE_COLUMN_TO_PRODUCT_DISPLAY_NAME = {
  [SOURCE_COMMODITIES.OilProductionVolume]: 'Oil',
  [SOURCE_COMMODITIES.GasProductionVolume]: 'Gas',
  [SOURCE_COMMODITIES.CoalProductionVolume]: 'Coal',
}

/* Map the source column name to the units used for that product */
const SOURCE_COLUMN_TO_PRODUCT_UNITS = {
  [SOURCE_COMMODITIES.OilProductionVolume]: 'bbl',
  [SOURCE_COMMODITIES.GasProductionVolume]: 'mcf',
  [SOURCE_COMMODITIES.CoalProductionVolume]: 'tons',
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
}

/* Use ES5 exports in order to be compatible with version 1.x of gatsby */
module.exports = (createNode, sourceData) => {
  console.log('Production Volumes ', sourceData)
  sourceData.map((productVolumeData, index) => {
    createProductVolumeNodeByProduct(createNode, productVolumeData, index)
  }
  )
}

const createProductVolumeNodeByProduct = (createNode, productVolumeData, index) => {
  if (productVolumeData[SOURCE_COLUMNS.Commodity] === undefined) return

  let node = {
  	id: index + '-productvolume',
	  ProductionMonth: productVolumeData[SOURCE_COLUMNS.Month],
	  ProductionYear: productVolumeData[SOURCE_COLUMNS.CalendarYear],
	  LandCategory: productVolumeData[SOURCE_COLUMNS.LandCategory],
	  OnshoreOffshore: productVolumeData[SOURCE_COLUMNS.OnshoreOffshore],
	  ProductName: SOURCE_COLUMN_TO_PRODUCT_DISPLAY_NAME[productVolumeData[SOURCE_COLUMNS.Commodity]],
	  Volume: productVolumeData[SOURCE_COLUMNS.Volume],
	  parent: null,
	  children: [],
	  internal: {
	    type: `ProductVolumes`,
	  },
  }

  node.ProductionDate = new Date(node.ProductionYear, getMonthFromString(node.ProductionMonth))

  node.Units = SOURCE_COLUMN_TO_PRODUCT_UNITS[productVolumeData[SOURCE_COLUMNS.Commodity]]
  node.LongUnits = PRODUCT_UNITS_TO_LONG_UNITS[node.Units]
  node.LandCategory_OnshoreOffshore =
		node.LandCategory + ((node.OnshoreOffshore && node.LandCategory !== 'Native American') ? ' ' + node.OnshoreOffshore.toLowerCase() : '')
  node.DisplayMonth = node.ProductionMonth && node.ProductionMonth.substring(0, 3)
  node.DisplayYear = node.ProductionYear && ("'" + node.ProductionYear.toString().substring(2))

  node.internal.contentDigest = crypto.createHash(`md5`)
																      .update(JSON.stringify(node))
																      .digest(`hex`)

  createNode(node)
}

function getMonthFromString (month) {
  let d = Date.parse(month + '1, 2012')
  if (!isNaN(d)) {
    return new Date(d).getMonth() + 1
  }
  return -1
}
