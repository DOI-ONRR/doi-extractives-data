import React from 'react'
import { connect } from 'react-redux'

import utils from '../../../js/utils'

import { updateGraphDataSets as updateGraphDataSetsAction } from '../../../state/reducers/data-sets'
import { groupByMonth as groupDataSetsByMonthAction } from '../../../state/reducers/data-sets'
import { groupByYear as groupDataSetsByYearAction } from '../../../state/reducers/data-sets'
import { setDataSelectedById as setDataSelectedByIdAction } from '../../../state/reducers/data-sets'
import {
	PRODUCT_VOLUMES_FISCAL_YEAR,
  REVENUES_MONTHLY,
  REVENUES_FISCAL_YEAR,
  BY_ID, BY_COMMODITY,
  BY_STATE, BY_COUNTY,
  BY_OFFSHORE_REGION,
  BY_LAND_CATEGORY,
  BY_LAND_CLASS,
  BY_REVENUE_TYPE,
  BY_FISCAL_YEAR,
  BY_CALENDAR_YEAR
} from '../../../state/reducers/data-sets'

import CONSTANTS from '../../../js/constants'

import styles from './TotalRevenue.module.scss'

import { ExploreDataLink } from '../../layouts/icon-links/ExploreDataLink'
import Toggle from '../../selectors/Toggle'
import DropDown from '../../selectors/DropDown'
import { StackedBarChartLayout } from '../../layouts/charts/StackedBarChartLayout'

const TOGGLE_VALUES = {
  Year: 'year',
  Month: 'month'
}

const DROPDOWN_VALUES = {
  Recent: 'recent',
  Fiscal: 'fiscal',
  Calendar: 'calendar'
}

const YEARLY_DROPDOWN_VALUES = {
  Fiscal: 'fiscal_year',
  Calendar: 'calendar_year'
}

const CHART_LEGEND_TITLE = 'Source'

const CHART_SORT_ORDER = [CONSTANTS.FEDERAL_ONSHORE, CONSTANTS.FEDERAL_OFFSHORE, CONSTANTS.NATIVE_AMERICAN]

const CHART_STYLE_MAP = {
  'bar': styles.chartBar,
  [CONSTANTS.FEDERAL_OFFSHORE]: styles.federalOffshore,
  [CONSTANTS.FEDERAL_ONSHORE]: styles.federalOnshore,
  [CONSTANTS.NATIVE_AMERICAN]: styles.nativeAmerican,
  hover: {
    [CONSTANTS.FEDERAL_OFFSHORE]: styles.federalOffshoreHover,
    [CONSTANTS.FEDERAL_ONSHORE]: styles.federalOnshoreHover,
    [CONSTANTS.NATIVE_AMERICAN]: styles.nativeAmericanHover,
  }
}

// Define configs for filtering the data sets
const KEY_STATS_OIL_DATA_ID = 'KEY_STATS_OIL_DATA_ID'
const KEY_STATS_GAS_DATA_ID = 'KEY_STATS_GAS_DATA_ID'
const KEY_STATS_COAL_DATA_ID = 'KEY_STATS_COAL_DATA_ID'

const PRODUCTION_VOLUMES_BY_YEAR_CONFIG = {
  options: {
    includeDisplayNames: true,
    subGroupName: CONSTANTS.CALENDAR_YEAR,
    syncId: 'KEY_STATS_PROD_VOLUMES_YEAR',
    selectedDataKeyIndex: 'last',
  },
  filter: {
    sumBy: 'LandCategory_OnshoreOffshore',
    limit: 10,
  }
}

const PRODUCTION_VOLUMES_BY_FISCAL_YEAR_CONFIG = {
  options: {
    includeDisplayNames: true,
    subGroupName: CONSTANTS.FISCAL_YEAR,
    syncId: 'KEY_STATS_PROD_VOLUMES_YEAR',
    selectedDataKeyIndex: 'last',
  },
  filter: {
    sumBy: 'LandCategory_OnshoreOffshore',
    limit: 10,
  }
}
const ALL_PRODUCTION_VOLUMES_BY_YEAR_CONFIGS = [
  { id: KEY_STATS_OIL_DATA_ID, sourceKey: CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY, ...PRODUCTION_VOLUMES_BY_YEAR_CONFIG },
  { id: KEY_STATS_GAS_DATA_ID, sourceKey: CONSTANTS.PRODUCTION_VOLUMES_GAS_KEY, ...PRODUCTION_VOLUMES_BY_YEAR_CONFIG },
  { id: KEY_STATS_COAL_DATA_ID, sourceKey: CONSTANTS.PRODUCTION_VOLUMES_COAL_KEY, ...PRODUCTION_VOLUMES_BY_YEAR_CONFIG },
]
const ALL_PRODUCTION_VOLUMES_BY_FISCAL_YEAR_CONFIGS = [
  { id: KEY_STATS_OIL_DATA_ID, sourceKey: PRODUCT_VOLUMES_FISCAL_YEAR, groupByKey: BY_FISCAL_YEAR+"_Oil", ...PRODUCTION_VOLUMES_BY_FISCAL_YEAR_CONFIG },
  { id: KEY_STATS_GAS_DATA_ID, sourceKey: PRODUCT_VOLUMES_FISCAL_YEAR, groupByKey: BY_FISCAL_YEAR+"_Gas", ...PRODUCTION_VOLUMES_BY_FISCAL_YEAR_CONFIG },
  { id: KEY_STATS_COAL_DATA_ID, sourceKey: PRODUCT_VOLUMES_FISCAL_YEAR, groupByKey: BY_FISCAL_YEAR+"_Coal", ...PRODUCTION_VOLUMES_BY_FISCAL_YEAR_CONFIG },
]

const PRODUCTION_VOLUMES_BY_MONTH_CONFIG = {
  options: {
    includeDisplayNames: true,
    subGroup: 'ProductionYear',
    syncId: 'KeyStatsProdVolumes_Month',
    selectedDataKeyIndex: 'last',
  },
  filter: {
    sumBy: 'LandCategory_OnshoreOffshore',
    limit: 12,
  }
}

const KEY_STATS_REVENUES_DATA_ID = 'KEY_STATS_REVENUES_DATA_ID'
const REVENUES_BY_YEAR_CONFIG = {
  options: {
    includeDisplayNames: true,
    subGroupName: CONSTANTS.CALENDAR_YEAR,
    selectedDataKeyIndex: 'last',
  },
  filter: {
    sumBy: 'RevenueCategory',
    limit: 10,
  }
}
const REVENUES_BY_MONTH_CONFIG = {
  options: {
    includeDisplayNames: true,
    subGroup: 'RevenueYear',
    selectedDataKeyIndex: 'last',
  },
  filter: {
    sumBy: 'RevenueCategory',
    limit: 12,
  }
}
const REVENUES_BY_FISCALYEAR_CONFIG = {
  options: {
    includeDisplayNames: true,
    subGroupName: CONSTANTS.FISCAL_YEAR,
    selectedDataKeyIndex: 'last',
  },
  filter: {
    sumBy: 'RevenueCategory',
    limit: 10,
  }
}

const KEY_STATS_DISBURSEMENTS_DATA_ID = 'KEY_STATS_DISBURSEMENTS_DATA_ID'
const DISBURSEMENTS_BY_YEAR_CONFIG = {
  options: {
    includeDisplayNames: true,
    subGroupName: CONSTANTS.FISCAL_YEAR,
    selectedDataKeyIndex: 'last',
  },
  filter: {
    sumBy: 'DisbursementCategory',
    limit: 10,
  }
}

const PRODUCTION_VOLUMES_FISCAL_YEAR = 'ProductionVolumesFiscalYear'
const PRODUCTION_VOLUMES_CALENDAR_YEAR = 'ProductionVolumesCalendarYear'
const REVENUES_FISCAL_YEAR_OLD = 'RevenuesFiscalYear'
const REVENUES_CALENDAR_YEAR = 'RevenuesCalendarYear'

class TotalRevenueDeprecated extends React.Component {
  constructor (props) {
    super(props)

    props.updateBarChartDataSets([
  		{id: KEY_STATS_REVENUES_DATA_ID, sourceKey: REVENUES_FISCAL_YEAR, groupByKey: BY_FISCAL_YEAR, ...REVENUES_BY_FISCALYEAR_CONFIG },
  		...ALL_PRODUCTION_VOLUMES_BY_FISCAL_YEAR_CONFIGS
  	])
    //console.log(this.props)

    // Filter Data Sets by Year initially
    props.groupDataSetsByYear([
      { id: KEY_STATS_DISBURSEMENTS_DATA_ID, sourceKey: CONSTANTS.DISBURSEMENTS_ALL_KEY, ...DISBURSEMENTS_BY_YEAR_CONFIG },
    ])
  }

	state = {
	  productionToggle: TOGGLE_VALUES.Year,
	  productionPeriod: DROPDOWN_VALUES.Recent,
	  productionYearlyPeriod: YEARLY_DROPDOWN_VALUES.Fiscal,
	  revenueToggle: TOGGLE_VALUES.Year,
	  revenuePeriod: DROPDOWN_VALUES.Recent,
	  revenueYearlyPeriod: YEARLY_DROPDOWN_VALUES.Fiscal,
	}

	componentWillReceiveProps (nextProps) {
	  this.setState({ ...nextProps })
	}

	componentDidUpdate() {
		//console.log(this.state)
	}

	productionToggleClicked (value) {
	  if (value !== this.state.productionToggle) {
	    this.setStateForProductionVolumes(value, this.state.productionPeriod, this.state.productionYearlyPeriod)
	  }
	}

	productionPeriodSelected (value) {
	  if (value !== this.state.productionPeriod) {
	    this.setStateForProductionVolumes(this.state.productionToggle, value, this.state.productionYearlyPeriod)
	  }
	}

	productionYearlyPeriodSelected(value){
	  if (value !== this.state.productionPeriod) {
	    this.setStateForProductionVolumes(this.state.productionToggle, this.state.productionPeriod, value)
	  }
	}

	setStateForProductionVolumes (toggleValue, productionPeriod, productionYearlyPeriod) {
	  if (toggleValue === TOGGLE_VALUES.Year) {
	  	if(productionYearlyPeriod === YEARLY_DROPDOWN_VALUES.Fiscal){
	  		this.props.updateBarChartDataSets([...ALL_PRODUCTION_VOLUMES_BY_FISCAL_YEAR_CONFIGS]);
	  	}
	  	else {
	  		this.props.groupDataSetsByYear([...ALL_PRODUCTION_VOLUMES_BY_YEAR_CONFIGS])
	  	}

	    this.setState({
	      ...this.state,
	      productionToggle: toggleValue,
	      productionYearlyPeriod: productionYearlyPeriod,

	    })
	  }
	  else {
	    let filter = { ...PRODUCTION_VOLUMES_BY_MONTH_CONFIG.filter, period: productionPeriod }
	    this.props.groupDataSetsByMonth([
	      { id: KEY_STATS_OIL_DATA_ID, sourceKey: CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY, filter: filter, options: PRODUCTION_VOLUMES_BY_MONTH_CONFIG.options },
	      { id: KEY_STATS_GAS_DATA_ID, sourceKey: CONSTANTS.PRODUCTION_VOLUMES_GAS_KEY, filter: filter, options: PRODUCTION_VOLUMES_BY_MONTH_CONFIG.options },
	      { id: KEY_STATS_COAL_DATA_ID, sourceKey: CONSTANTS.PRODUCTION_VOLUMES_COAL_KEY, filter: filter, options: PRODUCTION_VOLUMES_BY_MONTH_CONFIG.options },
	    ])

	    this.setState({
	    	...this.state,
	      productionToggle: toggleValue,
	      productionPeriod: productionPeriod
	    })
	  }
	}

	revenueToggleClicked (value) {
	  if (value !== this.state.revenueToggle) {
	    this.setStateForRevenues(value, this.state.revenueYearlyPeriod, this.state.revenuePeriod)
	  }
	}

	revenuePeriodSelected (value) {
	  if (value !== this.state.revenuePeriod) {
	    this.setStateForRevenues(this.state.revenueToggle, this.state.revenueYearlyPeriod, value)
	  }
	}

	revenueYearlyPeriodSelected (value) {
	  if (value !== this.state.revenueYearlyPeriod) {
	    this.setStateForRevenues(this.state.revenueToggle, value, this.state.revenuePeriod)
	  }
	}

	setStateForRevenues (toggleValue, revenueYearlyPeriod, revenuePeriod) {
	  if (toggleValue === TOGGLE_VALUES.Year) {
	  	if(revenueYearlyPeriod === YEARLY_DROPDOWN_VALUES.Fiscal){
		    this.props.updateBarChartDataSets([
		  		{id: KEY_STATS_REVENUES_DATA_ID, sourceKey: REVENUES_FISCAL_YEAR, groupByKey: BY_FISCAL_YEAR, ...REVENUES_BY_FISCALYEAR_CONFIG }
		  	])
	  	}
	  	else {
		    this.props.groupDataSetsByYear([
		      { id: KEY_STATS_REVENUES_DATA_ID, sourceKey: CONSTANTS.REVENUES_ALL_KEY, ...REVENUES_BY_YEAR_CONFIG },
		    ])
	  	}

	    this.setState({
	      revenueToggle: toggleValue,
	      revenuePeriod: revenuePeriod,
	      revenueYearlyPeriod: revenueYearlyPeriod,
	    })
	  }
	  else {
	    this.props.groupDataSetsByMonth([
	      { id: KEY_STATS_REVENUES_DATA_ID, sourceKey: CONSTANTS.REVENUES_ALL_KEY, filter: { ...REVENUES_BY_MONTH_CONFIG.filter, period: revenuePeriod }, options: REVENUES_BY_MONTH_CONFIG.options }
	    ])

	    this.setState({
	      revenueToggle: toggleValue,
	      revenuePeriod: revenuePeriod,
	      revenueYearlyPeriod: revenueYearlyPeriod,
	    })
	  }
	}

	getStackedBarChartLayout (dataSetId, title, dataFormatFunc) {
	  if (this.state[dataSetId] === undefined) {
	    return
	  }

	  return (
	    <div is="chart">
	      <StackedBarChartLayout

	        dataSet= {this.state[dataSetId]}

	        title= {title}

	        styleMap= {CHART_STYLE_MAP}

	        sortOrder= {CHART_SORT_ORDER}

	        legendTitle= {CHART_LEGEND_TITLE}

	        legendDataFormatFunc= {dataFormatFunc || utils.formatToCommaInt}

	        barSelectedCallback= {this.dataKeySelectedHandler.bind(this, dataSetId, this.state[dataSetId].syncId)}

	      >
	      </StackedBarChartLayout>
	    </div>
	  )
	}

	// Callback for charts. Used to sync production volume charts
	dataKeySelectedHandler (dataSetId, syncId, data) {
	  this.props.setDataSelectedById([{ id: dataSetId, dataKey: Object.keys(data)[0], syncId: syncId }])
	}

	render () {
	  return (
		  <section className={styles.revenueDisbursementsSection} >
		  
		  <h3 className={styles.title+" h3-bar"}>Total revenue<span className={styles.titleRight}>
		  <ExploreDataLink
		    to="/explore/revenue"
	            icon="filter"      
		    >Filter revenue data
			    </ExploreDataLink></span> </h3>
		  <div className={styles.content}>
		  <div className={styles.itemToggle}>
		  
		  <div className={styles.toggle}>
		  Show:
	            <Toggle action={this.revenueToggleClicked.bind(this)} buttons={[{ key: TOGGLE_VALUES.Year, name: CONSTANTS.YEARLY, default: true },
			    { key: TOGGLE_VALUES.Month, name: CONSTANTS.MONTHLY }]}></Toggle>
		  </div>
		  {(this.state.revenueToggle === TOGGLE_VALUES.Month) ?
		      <div className={styles.dropdown}>
			    Period:
		            <DropDown
		                      label={'Period'}
				      key={'RevenuePeriod'}
				      action={this.revenuePeriodSelected.bind(this)}
				      options={[
					  { key: DROPDOWN_VALUES.Recent,
					    name: 'Most recent 12 months',
					    default: (this.state.revenuePeriod === DROPDOWN_VALUES.Recent) },
					  { key: DROPDOWN_VALUES.Fiscal,
					    name: 'Fiscal year ' + this.state[REVENUES_FISCAL_YEAR_OLD],
					    default: (this.state.revenuePeriod === DROPDOWN_VALUES.Fiscal) },
					  { key: DROPDOWN_VALUES.Calendar,
					    name: 'Calendar year ' + this.state[REVENUES_CALENDAR_YEAR],
					    default: (this.state.revenuePeriod === DROPDOWN_VALUES.Calendar) }]}></DropDown>
			  </div>
			  :
			  <div className={styles.dropdown}>
		                    Period:
				    <DropDown
		                          key={'RevenueYearlyPeriod'}
		                          label={'Period'}
					  action={this.revenueYearlyPeriodSelected.bind(this)}
					  options={[
					      { key: YEARLY_DROPDOWN_VALUES.Fiscal,
						name: 'Fiscal year',
						default: (this.state.revenueYearlyPeriod === YEARLY_DROPDOWN_VALUES.Fiscal) },
					      { key: YEARLY_DROPDOWN_VALUES.Calendar,
						name: 'Calendar year',
						default: (this.state.revenueYearlyPeriod === YEARLY_DROPDOWN_VALUES.Calendar) }]}></DropDown>
			      </div>
			  }                    
	          </div>

		  <div className={styles.itemChart}>
		    {this.getStackedBarChartLayout(KEY_STATS_REVENUES_DATA_ID, CONSTANTS.REVENUE, utils.formatToDollarInt)}
	          </div>
		  </div>
	      </section>
	
	  )
	}
}

export default connect(
  state => ({
    [KEY_STATS_OIL_DATA_ID]: state[CONSTANTS.DATA_SETS_STATE_KEY][KEY_STATS_OIL_DATA_ID],
    [KEY_STATS_GAS_DATA_ID]: state[CONSTANTS.DATA_SETS_STATE_KEY][KEY_STATS_GAS_DATA_ID],
    [KEY_STATS_COAL_DATA_ID]: state[CONSTANTS.DATA_SETS_STATE_KEY][KEY_STATS_COAL_DATA_ID],
    [KEY_STATS_REVENUES_DATA_ID]: state[CONSTANTS.DATA_SETS_STATE_KEY][KEY_STATS_REVENUES_DATA_ID],
    [KEY_STATS_DISBURSEMENTS_DATA_ID]: state[CONSTANTS.DATA_SETS_STATE_KEY][KEY_STATS_DISBURSEMENTS_DATA_ID],
    [PRODUCTION_VOLUMES_FISCAL_YEAR]: state[CONSTANTS.DATA_SETS_STATE_KEY][CONSTANTS.FISCAL_YEAR_KEY][CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY],
    [PRODUCTION_VOLUMES_CALENDAR_YEAR]: state[CONSTANTS.DATA_SETS_STATE_KEY][CONSTANTS.CALENDAR_YEAR_KEY][CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY],
    [REVENUES_FISCAL_YEAR_OLD]: state[CONSTANTS.DATA_SETS_STATE_KEY][CONSTANTS.FISCAL_YEAR_KEY][CONSTANTS.REVENUES_ALL_KEY],
    [REVENUES_CALENDAR_YEAR]: state[CONSTANTS.DATA_SETS_STATE_KEY][CONSTANTS.CALENDAR_YEAR_KEY][CONSTANTS.REVENUES_ALL_KEY],
    [REVENUES_FISCAL_YEAR]: state[CONSTANTS.DATA_SETS_STATE_KEY][REVENUES_FISCAL_YEAR]
  }),
  dispatch => ({
  	updateBarChartDataSets: dataSets => dispatch(updateGraphDataSetsAction(dataSets)),
  	groupDataSetsByMonth: configs => dispatch(groupDataSetsByMonthAction(configs)),
  	groupDataSetsByMonth: configs => dispatch(groupDataSetsByMonthAction(configs)),
    groupDataSetsByYear: configs => dispatch(groupDataSetsByYearAction(configs)),
    setDataSelectedById: configs => dispatch(setDataSelectedByIdAction(configs)),

  })
    
)(TotalRevenueDeprecated)

const getDefaultChartData = dataSet => {
  let key = Object.keys(dataSet[dataSet.length - 1])[0]
  let data = dataSet[dataSet.length - 1][key]
  return { chartLegendData: data, chartDataKeySelected: key }
}
