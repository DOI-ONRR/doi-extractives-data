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
	"Indian": CONSTANTS.NATIVE_AMERICAN,
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
	sourceData.map((revenueData, index) => {
			createRevenueNode(createNode, revenueData, index);
		}
	);
}
const createRevenueNode = (createNode, revenueData, index) => {
  let revenueNode = {
  	id: index+"-revenue",
	  LandCategory: LAND_CATEGORY_TO_DISPLAY_NAME[revenueData[SOURCE_COLUMNS.LandCategory]],
	  LandClass: LAND_CLASS_TO_DISPLAY_NAME[revenueData[SOURCE_COLUMNS.LandClass]],
	  RevenueDate: revenueData[SOURCE_COLUMNS.RevenueDate],
	  RevenueType: revenueData[SOURCE_COLUMNS.RevenueType],
	  Commodity: revenueData[SOURCE_COLUMNS.Commodity],
	  Revenue: revenueData[SOURCE_COLUMNS.Revenue],
	  parent: null,
	  children: [],
	  internal: {
	    type: 'ResourcesRevenues',
	  },
  }

  revenueNode.RevenueCategory = LAND_CLASS_CATEGORY_TO_REVENUE_CATEGORY[revenueNode.LandClass] && LAND_CLASS_CATEGORY_TO_REVENUE_CATEGORY[revenueNode.LandClass][revenueNode.LandCategory];

  revenueNode.internal.contentDigest = crypto.createHash(`md5`)
																      .update(JSON.stringify(revenueNode))
																      .digest(`hex`);
	createNode(revenueNode);
}