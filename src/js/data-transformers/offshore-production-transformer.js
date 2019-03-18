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
	Month: "Month",
	CalendarYear: "Calendar Year",
  RevenueDate: "Date",
  LandCategory: "Land Category",
  LandClass: "Land Class",
  RevenueType: "Revenue Type",
  Commodity: "Commodity",
  Revenue: " Revenue ",
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

/* Use ES5 exports in order to be compatible with version 1.x of gatsby */
module.exports = (createNode, sourceData) => {
	Object.entries(sourceData).map((item) => {
			let regionId = item[0];
			Object.entries(item[1].products).map((product) => {
				let name = product[1].name;
				let units = product[1].units;
				Object.entries(product[1].volume).map((yearVolume, index) => {
						let year = yearVolume[0];
						let volume = yearVolume[1].volume || 0;
						createOffshoreProductionNode(createNode, index, regionId, name, units, year, volume);
					})
			})
		}
	);
}

const createOffshoreProductionNode = (createNode, index, regionId, name, units, year, volume) => {
  let node = {
  	id: index+"-"+regionId+"-"+name+"-offshore-production",
  	RegionId: regionId,
  	DisplayCategory: CONSTANTS.FEDERAL_OFFSHORE,
	  DisplayYear: "'"+year.toString().substr(2),
  	CalendarYear: year,
	  LandCategory: CONSTANTS.OFFSHORE,
	  LandClass: CONSTANTS.FEDERAL,
	  Commodity: name,
	  Volume: volume.toString(),
	  Units: (units === 'bbl')? 'barrels' : units,
	  parent: null,
	  children: [],
	  internal: {
	    type: 'OffshoreProduction',
	  },
  }

  node.Date = new Date(node.CalendarYear, 11);

  node.internal.contentDigest = crypto.createHash(`md5`)
																      .update(JSON.stringify(node))
																      .digest(`hex`);
	createNode(node);
}

