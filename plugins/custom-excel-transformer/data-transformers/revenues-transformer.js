'use strict';
/**
 *
 * This takes the input of the production volume spreadsheet and transforms the data to 
 * application friendly graphql node. This will allow the app to easily filter, sort and
 * group the data using graphql queries and have it ready to be displayed on our site.
 * 
 **/

/* Use ES5 require in order to be compatible with version 1.x of gatsby */

const CONSTANTS = require('../../../src/js/constants');

/* Define the column names found in the excel file */
const SOURCE_COLUMNS = {
	Month: "month",
	CalendarYear: "calendar year",
  RevenueDate: "date",
  LandCategory: "land category",
  LandClass: "land class",
  RevenueType: "revenue type",
  Commodity: "commodity",
  Revenue: "revenue",
  State: "state",
  County: "county",
	FiscalYear: "fiscal year",
	OffshoreRegion: "offshore region"
};

const LAND_CATEGORY_TO_DISPLAY_NAME ={
	"Offshore": CONSTANTS.OFFSHORE,
	"Onshore": CONSTANTS.ONSHORE,
}

const LAND_CLASS_TO_DISPLAY_NAME ={
	"Federal": CONSTANTS.FEDERAL,
	"Native American": CONSTANTS.NATIVE_AMERICAN,
}

const LAND_CLASS_CATEGORY_TO_REVENUE_CATEGORY ={
	[CONSTANTS.FEDERAL]: {
		[CONSTANTS.OFFSHORE]: CONSTANTS.FEDERAL_OFFSHORE,
		[CONSTANTS.ONSHORE]: CONSTANTS.FEDERAL_ONSHORE,
	},
	[CONSTANTS.NATIVE_AMERICAN]:  {
		[CONSTANTS.OFFSHORE]: CONSTANTS.NATIVE_AMERICAN,
		[CONSTANTS.ONSHORE]: CONSTANTS.NATIVE_AMERICAN,
	},
}

const COMMODITY_MAP = {
  'Oil & Gas (Non Royalty)' : 'Oil & Gas (Non-Royalty)',
  'Oil & Gas (Non-Royalty)' : 'Oil & Gas (Non-Royalty)'
}

/* Use ES5 exports in order to be compatible with version 1.x of gatsby */
module.exports = (node, type) => {
	return createRevenueNode(node, type);
}

const createRevenueNode = (revenueData, type) => {
	const data = Object.keys(revenueData).reduce((c, k) => (c[k.toLowerCase().trim()] = revenueData[k], c), {});

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
	  OffshoreRegion: (data[SOURCE_COLUMNS.OffshoreRegion] === "" || data[SOURCE_COLUMNS.OffshoreRegion] === undefined) ?
	  	data[SOURCE_COLUMNS.OffshoreRegion] : "Offshore "+data[SOURCE_COLUMNS.OffshoreRegion],
	  internal: {
	    type: type || 'ResourceRevenues',
	  },
  }

  let year = revenueNode.CalendarYear || revenueNode.FiscalYear;
  let month = (revenueNode.Month)? getMonthFromString(revenueNode.Month) : 0;

  revenueNode.RevenueDate = new Date(year, month);
  
  if(revenueNode.LandClass === CONSTANTS.NATIVE_AMERICAN) {
    revenueNode.LandCategory = CONSTANTS.ONSHORE;
    revenueNode.State = 'withheld';
  }

  revenueNode.RevenueCategory = LAND_CLASS_CATEGORY_TO_REVENUE_CATEGORY[revenueNode.LandClass] && LAND_CLASS_CATEGORY_TO_REVENUE_CATEGORY[revenueNode.LandClass][revenueNode.LandCategory];

  if(revenueNode.RevenueCategory === undefined) {
  	if(revenueNode.LandClass === CONSTANTS.NATIVE_AMERICAN) {
  		revenueNode.RevenueCategory = CONSTANTS.NATIVE_AMERICAN;
  	}
  	else {
  		revenueNode.RevenueCategory = 'Not tied to a lease';  	
  	}
  }

  if(revenueNode.Commodity === undefined){
    revenueNode.Commodity = 'Not tied to a commodity';  
  }

  if(revenueNode.FiscalYear === undefined) {
  	revenueNode.FiscalYear = (revenueNode.RevenueDate.getMonth() >= 9 ) ? 
  		(revenueNode.RevenueDate.getYear()+1901).toString()
  		:
  		(revenueNode.RevenueDate.getYear()+1900).toString();
  }

  let landCat = revenueNode.LandCategory && revenueNode.LandCategory.toLowerCase();

  if(landCat === "not tied to a lease" ||
     revenueNode.RevenueType === 'Civil Penalities' ||
     revenueNode.RevenueType === 'Other Revenues'){
    if(revenueNode.LandClass !== CONSTANTS.NATIVE_AMERICAN &&
        !revenueNode.OffshoreRegion){
      revenueNode.State = revenueNode.State || 'Not tied to a location';
    }
    
  }

	return revenueNode;
}

function getMonthFromString(month){

   var d = Date.parse(month + "1, 2012");
   if(!isNaN(d)){
      return new Date(d).getMonth();
   }
   return -1;
 }