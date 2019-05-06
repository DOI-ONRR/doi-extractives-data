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
	Month: "Month",
	CalendarYear: "Calendar Year",
	FiscalYear: "Fiscal Year",
  ProductionDate: "Production Date",
  LandCategory: "Land Class",
  OnshoreOffshore: "Land Category",
  Commodity: "Commodity",
  Product: "Product",
  Volume: "Volume",
};

/* List of all the products in the excel file and the corresponding column name */
const SOURCE_COMMODITIES = {
  OilProductionVolume: "Oil Prod Vol (bbl)",
  GasProductionVolume: "Gas Prod Vol (mcf)",
  CoalProductionVolume: "Coal Prod Vol (ton)",
};
/* List of all the products in the excel file and the corresponding column name */
const SOURCE_COMMODITIES_FISCAL_YEAR = {
  OilProductionVolume: "Oil (bbl)",
  GasProductionVolume: "Gas (mcf)",
  CoalProductionVolume: "Coal (tons)",
  CoalTonProductionVolume: "Coal (ton)",
};

/* Map the source column name to the display name we want to use for that product */
const SOURCE_COLUMN_TO_PRODUCT_DISPLAY_NAME = {
	[SOURCE_COMMODITIES.OilProductionVolume]: "Oil",
	[SOURCE_COMMODITIES.GasProductionVolume]: "Gas",
	[SOURCE_COMMODITIES.CoalProductionVolume]: "Coal",
	[SOURCE_COMMODITIES_FISCAL_YEAR.OilProductionVolume]: "Oil",
	[SOURCE_COMMODITIES_FISCAL_YEAR.GasProductionVolume]: "Gas",
	[SOURCE_COMMODITIES_FISCAL_YEAR.CoalProductionVolume]: "Coal",
	[SOURCE_COMMODITIES_FISCAL_YEAR.CoalTonProductionVolume]: "Coal",
};

/* Map the source column name to the units used for that product */
const SOURCE_COLUMN_TO_PRODUCT_UNITS = {
	[SOURCE_COMMODITIES.OilProductionVolume]: "bbl",
	[SOURCE_COMMODITIES.GasProductionVolume]: "mcf",
	[SOURCE_COMMODITIES.CoalProductionVolume]: "tons",
	[SOURCE_COMMODITIES_FISCAL_YEAR.OilProductionVolume]: "bbl",
	[SOURCE_COMMODITIES_FISCAL_YEAR.GasProductionVolume]: "mcf",
	[SOURCE_COMMODITIES_FISCAL_YEAR.CoalProductionVolume]: "tons",
	[SOURCE_COMMODITIES_FISCAL_YEAR.CoalTonProductionVolume]: "tons",
};

const PRODUCT_UNITS_TO_LONG_UNITS = {
	"bbl": "barrels",
	"mcf": "mcf",
	"tons": "tons",
};

const LOCATION_TYPE_TO_DISPLAY_NAME ={
	"OFFSHORE": "Offshore",
	"ONSHORE": "Onshore",
}


const LOCATION_CATEGORY_TYPE_TO_PRODUCTION_CATEGORY ={
	"Federal": {
		"Offshore": CONSTANTS.FEDERAL_OFFSHORE,
		"Onshore": CONSTANTS.FEDERAL_ONSHORE,
	},
	"Indian":  {
		"Offshore": CONSTANTS.NATIVE_AMERICAN,
		"Onshore": CONSTANTS.NATIVE_AMERICAN,
	},
	"Native American":  {
		"Offshore": CONSTANTS.NATIVE_AMERICAN,
		"Onshore": CONSTANTS.NATIVE_AMERICAN,
	},
}

/* Use ES5 exports in order to be compatible with version 1.x of gatsby */
module.exports = (node, type) => {
	return createProductVolumeNodeByProduct(node, type);
}

const createProductVolumeNodeByProduct = (productVolumeData, type) => {
	if(productVolumeData[SOURCE_COLUMNS.Commodity] === undefined && productVolumeData[SOURCE_COLUMNS.Product] === undefined) return;

  let node = {
	  ProductionMonth: productVolumeData[SOURCE_COLUMNS.Month],
	  ProductionYear: productVolumeData[SOURCE_COLUMNS.CalendarYear],
	  FiscalYear: productVolumeData[SOURCE_COLUMNS.FiscalYear],
	  LandClass: productVolumeData[SOURCE_COLUMNS.CalendarYear],
	  LandCategory: productVolumeData[SOURCE_COLUMNS.LandCategory].trim(),
	  OnshoreOffshore: productVolumeData[SOURCE_COLUMNS.OnshoreOffshore],
	  ProductName: SOURCE_COLUMN_TO_PRODUCT_DISPLAY_NAME[productVolumeData[SOURCE_COLUMNS.Commodity]] || SOURCE_COLUMN_TO_PRODUCT_DISPLAY_NAME[productVolumeData[SOURCE_COLUMNS.Product]],
	  Volume: productVolumeData[SOURCE_COLUMNS.Volume],
	  internal: {
	    type: type,
	  }
  }

	node.ProductionDate = (node.ProductionYear) ? 
		new Date(node.ProductionYear, getMonthFromString(node.ProductionMonth))
		:
		new Date(node.FiscalYear, 0);

	node.Units = SOURCE_COLUMN_TO_PRODUCT_UNITS[productVolumeData[SOURCE_COLUMNS.Commodity]] || SOURCE_COLUMN_TO_PRODUCT_UNITS[productVolumeData[SOURCE_COLUMNS.Product]];
	node.LongUnits = PRODUCT_UNITS_TO_LONG_UNITS[node.Units];
	node.LandCategory_OnshoreOffshore = 
		node.LandCategory+( (node.OnshoreOffshore && node.LandCategory !== "Native American" )? " "+node.OnshoreOffshore.toLowerCase() : "" ) ;
	node.DisplayMonth = node.ProductionMonth && node.ProductionMonth.substring(0, 3);
	node.DisplayYear = node.ProductionYear && ("'"+node.ProductionYear.toString().substring(2));

	return node;
}

function getMonthFromString(month){

   var d = Date.parse(month + "1, 2012");
   if(!isNaN(d)){
      return new Date(d).getMonth() + 1;
   }
   return -1;
 }
