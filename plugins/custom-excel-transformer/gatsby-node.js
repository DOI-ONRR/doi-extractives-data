/**
 *
 * This plugin is called from the gatsby api after the initial node creation and  
 * before the queries are run on the pages. This is where we add application ready nodes
 * created from the raw graphql nodes that get created from our source data files.
 * This is run during the build process and provides the application graphql nodes that
 * are easily filtered, sorted and/or grouped. They also contain display ready names to be used
 * on the site.
 *
 * @TODO Now that are data sources are more standardized we may only want to add custom fields vs new nodes or a schema?.
 *
 **/

// Custom Data Transformers
/**
 * Constants that are only used by this plugin
 **/
const DATA_TRANSFORMER_CONSTANTS = {
  PRODUCTION_VOLUMES_EXCEL :'ProductionVolumesXlsx__Sheet1',
  PRODUCTION_VOLUMES_FY:'FederalProductionFy2009201820190326Xlsx__FyFederalProductionVolumes',
  REVENUES_MONTHLY_EXCEL :'MonthlyRevenueXlsx__MontlyRev',
  FEDERAL_DISBURSEMENTS_EXCEL:'DisbursementsXlsx__Data',
  FEDERAL_REVENUE_FY:'FederalRevenueAcctYearFy061820181213Xlsx__FederalRevenuesFy06Fy18',
  NATIVE_AMERICAN_REVNUE_FY: 'NativeAmericanRevenuesXlsx__NativeAmericanRevenues'
}

const TRANSFORMER_NODE_TYPES = [
	DATA_TRANSFORMER_CONSTANTS.PRODUCTION_VOLUMES_EXCEL,
	DATA_TRANSFORMER_CONSTANTS.PRODUCTION_VOLUMES_FY,
	DATA_TRANSFORMER_CONSTANTS.FEDERAL_DISBURSEMENTS_EXCEL,
	DATA_TRANSFORMER_CONSTANTS.REVENUES_MONTHLY_EXCEL,
	DATA_TRANSFORMER_CONSTANTS.FEDERAL_REVENUE_FY,
	DATA_TRANSFORMER_CONSTANTS.NATIVE_AMERICAN_REVNUE_FY
];

const productionVolumesTransformer = require('./data-transformers/production-volumes-transformer');
const revenuesTransformer = require('./data-transformers/revenues-transformer');
const federalDisbursementsTransformer = require('./data-transformers/federal-disbursements-transformer');

async function onCreateNode(
	{ node, actions, createNodeId, createContentDigest},
  options = {}
) {
	const { createNode } = actions;

	if(TRANSFORMER_NODE_TYPES.includes(node.internal.type)) {
		let newNode;
		switch(node.internal.type) {
			case DATA_TRANSFORMER_CONSTANTS.PRODUCTION_VOLUMES_EXCEL:
				newNode = productionVolumesTransformer(node, 'ProductVolumes');
				break;
			case DATA_TRANSFORMER_CONSTANTS.PRODUCTION_VOLUMES_FY:
				newNode = productionVolumesTransformer(node, 'ProductVolumesFiscalYear');
				break;
			case DATA_TRANSFORMER_CONSTANTS.FEDERAL_DISBURSEMENTS_EXCEL:
				newNode = federalDisbursementsTransformer(node);
				break;
			case DATA_TRANSFORMER_CONSTANTS.REVENUES_MONTHLY_EXCEL:
				newNode = revenuesTransformer(node, 'ResourceRevenuesMonthly');
				break;
			case DATA_TRANSFORMER_CONSTANTS.FEDERAL_REVENUE_FY:
				newNode = revenuesTransformer(node, 'ResourceRevenuesFiscalYear');
				break;
			case DATA_TRANSFORMER_CONSTANTS.NATIVE_AMERICAN_REVNUE_FY:
				newNode = revenuesTransformer(node, 'ResourceRevenuesFiscalYear');
				break;
		}

		newNode.id = createNodeId(node.id);
		newNode.parent = node.id;
		newNode.children = [];
	  newNode.internal.contentDigest = createContentDigest(newNode);

		createNode(newNode);
	}
}

exports.onCreateNode = onCreateNode 