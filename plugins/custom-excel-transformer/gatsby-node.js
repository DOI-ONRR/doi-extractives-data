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
  DISBURSEMENTS: 'disbursementsxlsx__data',
  MONTHLY_DISBURSEMENTS: 'monthlydisbursementsxlsx__data',
  MONTHLY_REVENUE: 'monthlyrevenuexlsx__data',
  CALENDAR_YEAR_REVENUE: 'calendaryearrevenuexlsx__data',
  FISCAL_YEAR_REVENUE: 'fiscalyearrevenuexlsx__data',
  FISCAL_YEAR_NATIVE_AMERICAN_REVENUE: 'nativeamericanrevenuexlsx__data',
  MONTHLY_PRODUCTION: 'monthlyproductionxlsx__data',
  CALENDAR_YEAR_PRODUCTION: 'calendaryearproductionxlsx__data',
  FISCAL_YEAR_PRODUCTION: 'fiscalyearproductionxlsx__data',
}

const TRANSFORMER_NODE_TYPES = [
  DATA_TRANSFORMER_CONSTANTS.DISBURSEMENTS,
  DATA_TRANSFORMER_CONSTANTS.MONTHLY_DISBURSEMENTS,
  DATA_TRANSFORMER_CONSTANTS.MONTHLY_REVENUE,
  DATA_TRANSFORMER_CONSTANTS.CALENDAR_YEAR_REVENUE,
  DATA_TRANSFORMER_CONSTANTS.FISCAL_YEAR_REVENUE,
  DATA_TRANSFORMER_CONSTANTS.FISCAL_YEAR_NATIVE_AMERICAN_REVENUE,
  DATA_TRANSFORMER_CONSTANTS.MONTHLY_PRODUCTION,
  DATA_TRANSFORMER_CONSTANTS.CALENDAR_YEAR_PRODUCTION,
  DATA_TRANSFORMER_CONSTANTS.FISCAL_YEAR_PRODUCTION
]

const productionVolumesTransformer = require('./data-transformers/production-volumes-transformer')
const revenuesTransformer = require('./data-transformers/revenues-transformer')
const federalDisbursementsTransformer = require('./data-transformers/federal-disbursements-transformer')

async function onCreateNode (
  { node, actions, createNodeId, createContentDigest },
  options = {}
) {
  const { createNode } = actions

  if (TRANSFORMER_NODE_TYPES.includes(node.internal.type.toLowerCase())) {
    let newNode

    switch (node.internal.type.toLowerCase()) {
    case DATA_TRANSFORMER_CONSTANTS.DISBURSEMENTS:
      newNode = federalDisbursementsTransformer(node, 'FederalDisbursements')
      break
    case DATA_TRANSFORMER_CONSTANTS.MONTHLY_DISBURSEMENTS:
      newNode = federalDisbursementsTransformer(node, 'DisbursementsMonthly')
      break
    case DATA_TRANSFORMER_CONSTANTS.MONTHLY_REVENUE:
      newNode = revenuesTransformer(node, 'ResourceRevenuesMonthly')
      break
    case DATA_TRANSFORMER_CONSTANTS.CALENDAR_YEAR_REVENUE:
      newNode = revenuesTransformer(node, 'ResourceRevenuesCalendarYear')
      break
    case DATA_TRANSFORMER_CONSTANTS.FISCAL_YEAR_REVENUE:
      newNode = revenuesTransformer(node, 'ResourceRevenuesFiscalYear')
      break
    case DATA_TRANSFORMER_CONSTANTS.FISCAL_YEAR_NATIVE_AMERICAN_REVENUE:
      newNode = revenuesTransformer(node, 'ResourceRevenuesFiscalYear')
      break
    case DATA_TRANSFORMER_CONSTANTS.MONTHLY_PRODUCTION:
      newNode = productionVolumesTransformer(node, 'ProductVolumesMonthly')
      break
    case DATA_TRANSFORMER_CONSTANTS.CALENDAR_YEAR_PRODUCTION:
      newNode = productionVolumesTransformer(node, 'ProductVolumesCalendarYear')
      break
    case DATA_TRANSFORMER_CONSTANTS.FISCAL_YEAR_PRODUCTION:
      newNode = productionVolumesTransformer(node, 'ProductVolumesFiscalYear')
      break
    }

    newNode.id = createNodeId(node.id)
    newNode.parent = node.id
    newNode.children = []
	  newNode.internal.contentDigest = createContentDigest(newNode)

    createNode(newNode)
  }
}

exports.onCreateNode = onCreateNode
