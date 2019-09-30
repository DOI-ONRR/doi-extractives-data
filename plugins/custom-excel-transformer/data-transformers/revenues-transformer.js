'use strict'
/**
 *
 * This takes the input of the spreadsheet and transforms the data to
 * application friendly graphql node. This will allow the app to easily filter, sort and
 * group the data using graphql queries and have it ready to be displayed on our site.
 *
 * We have added additional logic here to display the information correctly in our tables/charts
 *
 **/

/* Use ES5 require in order to be compatible with version 1.x of gatsby */

const CONSTANTS = require('../../../src/js/constants')

/* Define the column names found in the excel file */
const SOURCE_COLUMNS = {
  Month: 'month',
  CalendarYear: 'calendar year',
  RevenueDate: 'date',
  LandCategory: 'land category',
  LandClass: 'land class',
  RevenueType: 'revenue type',
  Commodity: 'commodity',
  Revenue: 'revenue',
  State: 'state',
  County: 'county',
  FiscalYear: 'fiscal year',
  OffshoreRegion: 'offshore region',
  FipsCode: 'fips code',
  OffshorePlanningArea: 'offshore planning area',
}

const LAND_CATEGORY_TO_DISPLAY_NAME = {
  'Offshore': CONSTANTS.OFFSHORE,
  'Onshore': CONSTANTS.ONSHORE,
}

const LAND_CLASS_TO_DISPLAY_NAME = {
  'Federal': CONSTANTS.FEDERAL,
  'Native American': CONSTANTS.NATIVE_AMERICAN,
}

const LAND_CLASS_CATEGORY_TO_REVENUE_CATEGORY = {
  [CONSTANTS.FEDERAL]: {
    [CONSTANTS.OFFSHORE]: CONSTANTS.FEDERAL_OFFSHORE,
    [CONSTANTS.ONSHORE]: CONSTANTS.FEDERAL_ONSHORE,
  },
  [CONSTANTS.NATIVE_AMERICAN]: {
    [CONSTANTS.OFFSHORE]: CONSTANTS.NATIVE_AMERICAN,
    [CONSTANTS.ONSHORE]: CONSTANTS.NATIVE_AMERICAN,
  },
}

const COMMODITY_MAP = {
  'Oil & Gas (Non Royalty)': 'Oil & Gas (Non-Royalty)',
  'Oil & Gas (Non-Royalty)': 'Oil & Gas (Non-Royalty)'
}

/* Use ES5 exports in order to be compatible with version 1.x of gatsby */
module.exports = (node, type) => {
  return createRevenueNode(node, type)
}

const createRevenueNode = (revenueData, type) => {
  // convert all keys to lower case and trim the spaces, this is done due to ongoing issues with the excel files being formatted differently
  // eslint-disable-next-line no-return-assign
  const data = Object.keys(revenueData).reduce((c, k) => (c[k.toLowerCase().trim()] = revenueData[k], c), {})

  let revenueNode = {
    Month: data[SOURCE_COLUMNS.Month],
    CalendarYear: data[SOURCE_COLUMNS.CalendarYear],
    LandCategory: LAND_CATEGORY_TO_DISPLAY_NAME[data[SOURCE_COLUMNS.LandCategory]],
    LandClass: LAND_CLASS_TO_DISPLAY_NAME[data[SOURCE_COLUMNS.LandClass]],
    RevenueType: data[SOURCE_COLUMNS.RevenueType],
    Commodity: COMMODITY_MAP[data[SOURCE_COLUMNS.Commodity]] || data[SOURCE_COLUMNS.Commodity],
    Revenue: data[SOURCE_COLUMNS.Revenue],
    State: data[SOURCE_COLUMNS.State],
    County: data[SOURCE_COLUMNS.County],
    FiscalYear: data[SOURCE_COLUMNS.FiscalYear],
    Units: '$',
    LongUnits: 'dollars',
    FipsCode: (data[SOURCE_COLUMNS.FipsCode]) ? data[SOURCE_COLUMNS.FipsCode].toString() : getFipsCode(data[SOURCE_COLUMNS.OffshorePlanningArea]),
    OffshorePlanningArea: data[SOURCE_COLUMNS.OffshorePlanningArea],
    OffshoreRegion: (data[SOURCE_COLUMNS.OffshoreRegion] === '' || data[SOURCE_COLUMNS.OffshoreRegion] === undefined)
      ? data[SOURCE_COLUMNS.OffshoreRegion] : 'Offshore ' + data[SOURCE_COLUMNS.OffshoreRegion],
    internal: {
      type: type || 'ResourceRevenues',
    },
  }

  let year = revenueNode.CalendarYear || revenueNode.FiscalYear
  let month = (revenueNode.Month) ? getMonthFromString(revenueNode.Month) : 0

  revenueNode.RevenueDate = new Date(year, month)

  if (revenueNode.LandClass === CONSTANTS.NATIVE_AMERICAN) {
    revenueNode.LandCategory = CONSTANTS.ONSHORE
    revenueNode.State = 'withheld'
  }

  revenueNode.RevenueCategory =
	LAND_CLASS_CATEGORY_TO_REVENUE_CATEGORY[revenueNode.LandClass] && LAND_CLASS_CATEGORY_TO_REVENUE_CATEGORY[revenueNode.LandClass][revenueNode.LandCategory]

  if (revenueNode.RevenueCategory === undefined) {
    if (revenueNode.LandClass === CONSTANTS.NATIVE_AMERICAN) {
      revenueNode.RevenueCategory = CONSTANTS.NATIVE_AMERICAN
    }
    else {
      revenueNode.RevenueCategory = 'Not tied to a lease'
    }
  }

  if (revenueNode.Commodity === undefined || revenueNode.Commodity === '') {
    revenueNode.Commodity = 'Not tied to a commodity'
  }

  if (revenueNode.FiscalYear === undefined) {
    revenueNode.FiscalYear = (revenueNode.RevenueDate.getMonth() >= 9)
      ? (revenueNode.RevenueDate.getYear() + 1901).toString()
      : (revenueNode.RevenueDate.getYear() + 1900).toString()
  }

  let landCat = revenueNode.LandCategory && revenueNode.LandCategory.toLowerCase().trim()
  let revType = revenueNode.RevenueType && revenueNode.RevenueType.toLowerCase().trim()

  if (landCat === 'not tied to a lease' ||
      revType === 'civil penalties' ||
      revType === 'other revenues') {
    if (revenueNode.LandClass !== CONSTANTS.NATIVE_AMERICAN &&
        !revenueNode.OffshoreRegion) {
      revenueNode.State = revenueNode.State || 'Not tied to a location'
    }
  }

  return revenueNode
}

function getMonthFromString (month) {
  let d = Date.parse(month + '1, 2012')
  if (!isNaN(d)) {
    return new Date(d).getMonth()
  }
  return -1
}

function getFipsCode (offshorePlanningArea) {
  switch (offshorePlanningArea && offshorePlanningArea.toLowerCase()) {
  case 'southern california':
    return 'SOC'
  case 'central gulf of mexico':
    return 'CGM'
  case 'eastern gulf of mexico':
    return 'EGM'
  case 'western gulf of mexico':
    return 'WGM'
  case 'beaufort sea':
    return 'BFT'
  case 'north atlantic':
    return 'NOA'
  case 'mid atlantic':
    return 'MDA'
  case 'cook inlet':
    return 'COK'
  case 'chukchi sea':
    return 'CHU'
  }


  return undefined
}

