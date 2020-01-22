import React from 'react'
import { connect } from 'react-redux'
import Link from '../../utils/temp-link'

import utils from '../../../js/utils'

import {
  updateGraphDataSets as updateGraphDataSetsAction,
  groupByMonth as groupDataSetsByMonthAction,
  groupByYear as groupDataSetsByYearAction,
  setDataSelectedById as setDataSelectedByIdAction,
  PRODUCT_VOLUMES_FISCAL_YEAR,
  BY_FISCAL_YEAR
} from '../../../state/reducers/data-sets'

import CONSTANTS from '../../../js/constants'

import styles from './TotalProduction.module.scss'

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
    groupBy: 'FiscalYear'
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
  { id: KEY_STATS_OIL_DATA_ID, sourceKey: CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY, ...PRODUCTION_VOLUMES_BY_FISCAL_YEAR_CONFIG },
  { id: KEY_STATS_GAS_DATA_ID, sourceKey: CONSTANTS.PRODUCTION_VOLUMES_GAS_KEY, ...PRODUCTION_VOLUMES_BY_FISCAL_YEAR_CONFIG },
  { id: KEY_STATS_COAL_DATA_ID, sourceKey: CONSTANTS.PRODUCTION_VOLUMES_COAL_KEY, ...PRODUCTION_VOLUMES_BY_FISCAL_YEAR_CONFIG },
]
/* const ALL_PRODUCTION_VOLUMES_BY_FISCAL_YEAR_CONFIGS = [
  { id: KEY_STATS_OIL_DATA_ID, sourceKey: PRODUCT_VOLUMES_FISCAL_YEAR, groupByKey: BY_FISCAL_YEAR + '_Oil', ...PRODUCTION_VOLUMES_BY_FISCAL_YEAR_CONFIG },
  { id: KEY_STATS_GAS_DATA_ID, sourceKey: PRODUCT_VOLUMES_FISCAL_YEAR, groupByKey: BY_FISCAL_YEAR + '_Gas', ...PRODUCTION_VOLUMES_BY_FISCAL_YEAR_CONFIG },
  { id: KEY_STATS_COAL_DATA_ID, sourceKey: PRODUCT_VOLUMES_FISCAL_YEAR, groupByKey: BY_FISCAL_YEAR + '_Coal', ...PRODUCTION_VOLUMES_BY_FISCAL_YEAR_CONFIG },
] */

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

const PRODUCTION_VOLUMES_FISCAL_YEAR = 'ProductionVolumesFiscalYear'
const PRODUCTION_VOLUMES_CALENDAR_YEAR = 'ProductionVolumesCalendarYear'

class TotalProductionDeprecated extends React.Component {
	state = {
	  productionToggle: TOGGLE_VALUES.Year,
	  productionPeriod: DROPDOWN_VALUES.Recent,
	  productionYearlyPeriod: YEARLY_DROPDOWN_VALUES.Fiscal,
	}

	componentWillReceiveProps (nextProps) {
	  this.setState({ ...nextProps })
	}

	componentDidMount () {
	  this.setStateForProductionVolumes(this.state.productionToggle, this.state.productionPeriod, this.state.productionYearlyPeriod)
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

	productionYearlyPeriodSelected (value) {
	  if (value !== this.state.productionPeriod) {
	    this.setStateForProductionVolumes(this.state.productionToggle, this.state.productionPeriod, value)
	  }
	}

	setStateForProductionVolumes (toggleValue, productionPeriod, productionYearlyPeriod) {
	  if (toggleValue === TOGGLE_VALUES.Year) {
	    if (productionYearlyPeriod === YEARLY_DROPDOWN_VALUES.Fiscal) {
        //this.props.updateBarChartDataSets([...ALL_PRODUCTION_VOLUMES_BY_FISCAL_YEAR_CONFIGS])
        this.props.groupDataSetsByYear([...ALL_PRODUCTION_VOLUMES_BY_FISCAL_YEAR_CONFIGS])
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

	        showUnits={ ((this.state.productionYearlyPeriod === YEARLY_DROPDOWN_VALUES.Fiscal) && (this.state.productionToggle === TOGGLE_VALUES.Year)) }

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
		  <section className={styles.production} >
		  <h3 className={styles.title + ' h3-bar'}>Total production<span className={styles.titleRight}>
		  <ExploreDataLink
		    to="/query-data/?dataType=Production"
	            icon="filter"
		    >Filter production data
			    </ExploreDataLink></span></h3>
		  <div className={styles.content}>
	          <div className={styles.itemToggle}>

		  <div className={styles.toggle}>
									Show:
	                <Toggle action={this.productionToggleClicked.bind(this)} buttons={[{ key: TOGGLE_VALUES.Year, name: 'Yearly', default: true },
								  { key: TOGGLE_VALUES.Month, name: 'Monthly' }]}></Toggle>
	              </div>

	              {(this.state.productionToggle === TOGGLE_VALUES.Month)
	            ? <div className={styles.dropdown}>
										Period:
									  <DropDown
	                    key={'ProductionPeriod'}
	                    label={'Period'}
									    action={this.productionPeriodSelected.bind(this)}
									    options={[
									      { key: DROPDOWN_VALUES.Recent,
									        name: 'Most recent 12 months',
									        default: (this.state.productionPeriod === DROPDOWN_VALUES.Recent) },
									      { key: DROPDOWN_VALUES.Fiscal,
									        name: 'Fiscal year ' + this.state[PRODUCTION_VOLUMES_FISCAL_YEAR],
									        default: (this.state.productionPeriod === DROPDOWN_VALUES.Fiscal) },
									      { key: DROPDOWN_VALUES.Calendar,
									        name: 'Calendar year ' + this.state[PRODUCTION_VOLUMES_CALENDAR_YEAR],
									        default: (this.state.productionPeriod === DROPDOWN_VALUES.Calendar) }]}></DropDown>
	            </div>
	            : <div className={styles.dropdown}>Period:
	              <DropDown
	                label={'Period'}
	                key={'ProductionYearlyPeriod'}
	                action={this.productionYearlyPeriodSelected.bind(this)}
	                options={[
									      { key: YEARLY_DROPDOWN_VALUES.Fiscal,
									        name: 'Fiscal year',
									        default: (this.state.productionYearlyPeriod === YEARLY_DROPDOWN_VALUES.Fiscal) },
									      { key: YEARLY_DROPDOWN_VALUES.Calendar,
									        name: 'Calendar year',
									        default: (this.state.productionYearlyPeriod === YEARLY_DROPDOWN_VALUES.Calendar) }]}>

	              </DropDown>
	            </div>
	              }
	        </div>

	        <div className={styles.productChartContainer}>
	          {this.getStackedBarChartLayout(KEY_STATS_OIL_DATA_ID, CONSTANTS.OIL)}

		  {this.getStackedBarChartLayout(KEY_STATS_GAS_DATA_ID, CONSTANTS.GAS)}

		  {this.getStackedBarChartLayout(KEY_STATS_COAL_DATA_ID, CONSTANTS.COAL)}
	        </div>
	        <div className={styles.sourceLink}>
	          <Link to='./downloads/federal-production-by-month/'>Source file</Link>
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
    [PRODUCTION_VOLUMES_FISCAL_YEAR]: state[CONSTANTS.DATA_SETS_STATE_KEY][CONSTANTS.FISCAL_YEAR_KEY][CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY],
    [PRODUCTION_VOLUMES_CALENDAR_YEAR]: state[CONSTANTS.DATA_SETS_STATE_KEY][CONSTANTS.CALENDAR_YEAR_KEY][CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY]
  }),
  dispatch => ({
    updateBarChartDataSets: dataSets => dispatch(updateGraphDataSetsAction(dataSets)),
    groupDataSetsByMonth: configs => dispatch(groupDataSetsByMonthAction(configs)),
    groupDataSetsByYear: configs => dispatch(groupDataSetsByYearAction(configs)),
    setDataSelectedById: configs => dispatch(setDataSelectedByIdAction(configs)),
  })

)(TotalProductionDeprecated)
