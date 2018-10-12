'use strict';
/* Use ES5 in order to be compatible with version 1.x of gatsby */
const crypto = require('crypto');

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

/* Map the source column name to the units used for that product */
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
		"Offshore": "Federal offshore",
		"Onshore": "Federal onshore",
	},
	"Indian":  {
		"Offshore": "Native American",
		"Onshore": "Native American",
	},
}

module.exports = (createNode, sourceData) => {
	sourceData.map((productVolumeData, index) => {
			createProductVolumeNode(createNode, productVolumeData, index);
		}
	);
}

const createProductVolumeNode = (createNode, productVolumeData, index) => {
  const productVolumeNode = {
	  LandCategory: LOCATION_CATEGORY_TO_DISPLAY_NAME[productVolumeData[SOURCE_COLUMNS.LandCategory]],
	  LocationType: LOCATION_TYPE_TO_DISPLAY_NAME[productVolumeData[SOURCE_COLUMNS.OnshoreOffshore]],
	  ProductionDate: productVolumeData[SOURCE_COLUMNS.ProductionDate],
	  ProductVolumes: getProductVolumes(productVolumeData),
	  
	  id: index+"-product-volumes",
	  parent: null,
	  children: [],
	  internal: {
	    type: `ProductVolumes`,
	  },
  }

  productVolumeNode.ProductionCategory = 
  	LOCATION_CATEGORY_TYPE_TO_PRODUCTION_CATEGORY[productVolumeNode.LandCategory][productVolumeNode.LocationType];

  productVolumeNode.internal.contentDigest = crypto
	      .createHash(`md5`)
	      .update(JSON.stringify(productVolumeNode))
	      .digest(`hex`)

	createNode(productVolumeNode);
}

const getProductVolumes = (productVolumeData) => {
	let productVolumes = [];

	SOURCE_COLUMNS_PRODUCTS.map((productKey, index) => {
		if(productVolumeData[productKey] !== undefined) {
			productVolumes.push({
				DisplayName : SOURCE_COLUMN_TO_PRODUCT_DISPLAY_NAME[productKey],
				Volume: productVolumeData[productKey],
				Units: SOURCE_COLUMN_TO_PRODUCT_UNITS[productKey],
				LongUnits: PRODUCT_UNITS_TO_LONG_UNITS[SOURCE_COLUMN_TO_PRODUCT_UNITS[productKey]],
			});
		}
	});


	return productVolumes;
}
const getProductionCategory = (locationCategory, locationType) => {}

