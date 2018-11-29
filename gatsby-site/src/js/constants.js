/**
 * Constants that are used by the application
 **/
module.exports = Object.freeze({
	// Redux Store keys for reducers
	REVENUES_KEY: 'revenues',
	PRODUCTION_VOLUMES_KEY: 'productionVolumes',
  DISBURSEMENTS_KEY: 'federalDisbursements',

  // Disbursements data keys for redux store
  DISBURSEMENTS_ALL_KEY: 'disbursementsAll',

	// Revenues data keys for redux store
	REVENUES_ALL_KEY: 'revenuesAll',

	// Production Volume data keys for redux store
  PRODUCTION_VOLUMES_OIL_KEY: 'productVolumesOil',
  PRODUCTION_VOLUMES_GAS_KEY: 'productVolumesGas',
  PRODUCTION_VOLUMES_COAL_KEY: 'productVolumesCoal',

  FEDERAL_OFFSHORE: 'Federal offshore',
  FEDERAL_ONSHORE: 'Federal onshore',
  NATIVE_AMERICAN: 'Native American',
  OFFSHORE: 'Offshore',
  ONSHORE: 'Onshore',
  FEDERAL: 'Federal',

  CALENDAR_YEAR: "Calendar year",
  FISCAL_YEAR: "Fiscal year",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
  REVENUE: "Revenue",
  DISBURSEMENTS: "Disbursements",

});
