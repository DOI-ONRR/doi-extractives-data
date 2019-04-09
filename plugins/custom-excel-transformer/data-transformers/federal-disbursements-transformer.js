'use strict';
/**
 *
 * This takes the input of the disbursements spreadsheet and transforms the data to 
 * application friendly graphql node. This will allow the app to easily filter, sort and
 * group the data using graphql queries and have it ready to be displayed on our site.
 * 
 **/

/* Use ES5 require in order to be compatible with version 1.x of gatsby */

const CONSTANTS = require('../../../src/js/constants');

/* Define the column names found in the excel file */
const SOURCE_COLUMNS = {
  Year: "Fiscal Year",
  Fund: "Fund Type",
  OnshoreOffshore: "Onshore/Offshore",
  Disbursement: " Total ",
  USState: "State",
  County: "County",
};

const FUND_TO_DISBURSEMENTS_CATEGORY ={
	"American Indian Tribes": CONSTANTS.NATIVE_AMERICAN,
}

const ONSHOREOFFSHORE_TO_DISBURSEMENTS_CATEGORY ={
	"onshore & offshore": CONSTANTS.FEDERAL_ONSHORE,
	"offshore": CONSTANTS.FEDERAL_OFFSHORE,
	"onshore": CONSTANTS.FEDERAL_ONSHORE,
}

/* Use ES5 exports in order to be compatible with version 1.x of gatsby */
module.exports = (node) => {
	return createDisbursementsNode(node);
}
const createDisbursementsNode = (disbursementsData) => {
  let disbursementNode = {
	  Year: disbursementsData[SOURCE_COLUMNS.Year],
	  DisplayYear: "'"+disbursementsData[SOURCE_COLUMNS.Year].toString().substr(2),
	  Fund: disbursementsData[SOURCE_COLUMNS.Fund],
	  Source: disbursementsData[SOURCE_COLUMNS.OnshoreOffshore],
	  Disbursement: disbursementsData[SOURCE_COLUMNS.Disbursement],
	  USState: disbursementsData[SOURCE_COLUMNS.USState],
	  County: disbursementsData[SOURCE_COLUMNS.County],
	  internal: {
	    type: `FederalDisbursements`,
	  },
  }

  disbursementNode.DisbursementCategory = FUND_TO_DISBURSEMENTS_CATEGORY[disbursementNode.Fund] || ONSHOREOFFSHORE_TO_DISBURSEMENTS_CATEGORY[disbursementNode.Source.toLowerCase()];


	return disbursementNode;
}