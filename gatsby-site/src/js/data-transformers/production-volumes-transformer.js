'use strict';
/**
 *
 * This takes the input of the production volume spreadsheet and transforms the data to 
 * application friendly graphql node. This will allow the app to easily filter, sort and
 * group the data using graphql queries and have it ready to be displayed on our site.
 * 
 **/

/* Use ES5 require in order to be compatible with version 1.x of gatsby */
const crypto = require('crypto');

const CONSTANTS = require('../../js/constants');

/* Define the column names found in the excel file */
const SOURCE_COLUMNS = {
  ProductionDate: "Production Date",
  LandCategory: "Land Category",
  OnshoreOffshore: "Onshore/Offshore",
  OilProductionVolume: " Oil Prod Vol (bbl) ",
  GasProductionVolume: " Gas Prod Vol (Mcf) ",
  CoalProductionVolume: " Coal Prod Vol (ton) ",
};

/* List of all the products in the excel file and the corresponding column name */
const SOURCE_COLUMNS_PRODUCTS = [
  SOURCE_COLUMNS.OilProductionVolume,
  SOURCE_COLUMNS.GasProductionVolume,
  SOURCE_COLUMNS.CoalProductionVolume,
];

/* Map the source column name to the display name we want to use for that product */
const SOURCE_COLUMN_TO_PRODUCT_DISPLAY_NAME = {
	[SOURCE_COLUMNS.OilProductionVolume]: "Oil",
	[SOURCE_COLUMNS.GasProductionVolume]: "Gas",
	[SOURCE_COLUMNS.CoalProductionVolume]: "Coal",
};

/* Map the source column name to the units used for that product */
const SOURCE_COLUMN_TO_PRODUCT_UNITS = {
	[SOURCE_COLUMNS.OilProductionVolume]: "bbl",
	[SOURCE_COLUMNS.GasProductionVolume]: "mcf",
	[SOURCE_COLUMNS.CoalProductionVolume]: "tons",
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

const LOCATION_CATEGORY_TO_DISPLAY_NAME ={
	"FED - FEDERAL": "Federal",
	"Federal": "Federal",
	"IND - INDIAN": "Indian",
	"Indian": "Indian",
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
}

/* Use ES5 exports in order to be compatible with version 1.x of gatsby */
module.exports = (createNode, sourceData) => {
	sourceData.map((productVolumeData, index) => {
			createProductVolumeNodeByProduct(createNode, productVolumeData, index);
		}
	);
}

const createProductVolumeNodeByProduct = (createNode, productVolumeData, index) => {
  let productVolumeNode = {
	  LandCategory: LOCATION_CATEGORY_TO_DISPLAY_NAME[productVolumeData[SOURCE_COLUMNS.LandCategory]],
	  LocationType: LOCATION_TYPE_TO_DISPLAY_NAME[productVolumeData[SOURCE_COLUMNS.OnshoreOffshore]],
	  ProductionDate: productVolumeData[SOURCE_COLUMNS.ProductionDate],
	  parent: null,
	  children: [],
	  internal: {
	    type: `ProductVolumes`,
	  },
  }

  productVolumeNode.ProductionCategory = 
  	LOCATION_CATEGORY_TYPE_TO_PRODUCTION_CATEGORY[productVolumeNode.LandCategory][productVolumeNode.LocationType];

	assignByProduct(productVolumeNode, productVolumeData, index).map(node => createNode(node));
}

/**
 * The current excel spreadsheet has multiple products per line so here we break them out to
 * seperate nodes so we can filter and group by product using graphql.
 **/
const assignByProduct = (productVolumeNode, productVolumeData, index) => {
	let nodes = [];

	SOURCE_COLUMNS_PRODUCTS.map((productKey) => {
			if(productVolumeData[productKey] !== undefined) {
				// make a deep copy of object
				let node = JSON.parse(JSON.stringify(productVolumeNode));


				node.id = index+"-"+SOURCE_COLUMN_TO_PRODUCT_DISPLAY_NAME[productKey]+"-product-volume",
				node.ProductName = SOURCE_COLUMN_TO_PRODUCT_DISPLAY_NAME[productKey],
				node.Volume = productVolumeData[productKey],
				node.Units = SOURCE_COLUMN_TO_PRODUCT_UNITS[productKey],
				node.LongUnits = PRODUCT_UNITS_TO_LONG_UNITS[SOURCE_COLUMN_TO_PRODUCT_UNITS[productKey]],

				node.internal.contentDigest = crypto.createHash(`md5`)
																      .update(JSON.stringify(node))
																      .digest(`hex`);
				nodes.push(node);
			}
		});

	return nodes;
}
