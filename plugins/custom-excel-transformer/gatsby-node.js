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
  PRODUCTION_VOLUMES_EXCEL: 'productionvolumesxlsx__sheet1',
  PRODUCTION_VOLUMES_FY: 'federalproductionfy2009201820190326xlsx__fyfederalproductionvolumes',
  REVENUES_MONTHLY_EXCEL: 'monthlyrevenuexlsx__data',
  FEDERAL_DISBURSEMENTS_EXCEL: 'disbursementsxlsx__data',
  FEDERAL_REVENUE_FY: 'fiscalyearrevenuexlsx__data',
  NATIVE_AMERICAN_REVNUE_FY: 'nativeamericanrevenuesxlsx__data',
  CALENDAR_YEAR_REVENUE: 'calendaryearrevenuexlsx__data',
  CALENDAR_YEAR_PRODUCTION: 'calendaryearproductionxlsx__data'
}

const TRANSFORMER_NODE_TYPES = [
  DATA_TRANSFORMER_CONSTANTS.PRODUCTION_VOLUMES_EXCEL,
  DATA_TRANSFORMER_CONSTANTS.PRODUCTION_VOLUMES_FY,
  DATA_TRANSFORMER_CONSTANTS.FEDERAL_DISBURSEMENTS_EXCEL,
  DATA_TRANSFORMER_CONSTANTS.REVENUES_MONTHLY_EXCEL,
  DATA_TRANSFORMER_CONSTANTS.FEDERAL_REVENUE_FY,
  DATA_TRANSFORMER_CONSTANTS.NATIVE_AMERICAN_REVNUE_FY,
  DATA_TRANSFORMER_CONSTANTS.CALENDAR_YEAR_REVENUE,
  DATA_TRANSFORMER_CONSTANTS.CALENDAR_YEAR_PRODUCTION
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
    case DATA_TRANSFORMER_CONSTANTS.PRODUCTION_VOLUMES_EXCEL:
      newNode = productionVolumesTransformer(node, 'ProductVolumes')
      break
    case DATA_TRANSFORMER_CONSTANTS.CALENDAR_YEAR_PRODUCTION:
      newNode = productionVolumesTransformer(node, 'ProductVolumesCalendarYear')
      break
    case DATA_TRANSFORMER_CONSTANTS.PRODUCTION_VOLUMES_FY:
      newNode = productionVolumesTransformer(node, 'ProductVolumesFiscalYear')
      break
    case DATA_TRANSFORMER_CONSTANTS.FEDERAL_DISBURSEMENTS_EXCEL:
      newNode = federalDisbursementsTransformer(node)
      break
    case DATA_TRANSFORMER_CONSTANTS.REVENUES_MONTHLY_EXCEL:
      newNode = revenuesTransformer(node, 'ResourceRevenuesMonthly')
      break
    case DATA_TRANSFORMER_CONSTANTS.FEDERAL_REVENUE_FY:
      newNode = revenuesTransformer(node, 'ResourceRevenuesFiscalYear')
      break
    case DATA_TRANSFORMER_CONSTANTS.NATIVE_AMERICAN_REVNUE_FY:
      newNode = revenuesTransformer(node, 'ResourceRevenuesFiscalYear')
      break
    case DATA_TRANSFORMER_CONSTANTS.CALENDAR_YEAR_REVENUE:
      newNode = revenuesTransformer(node, 'ResourceRevenuesCalendarYear')
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
