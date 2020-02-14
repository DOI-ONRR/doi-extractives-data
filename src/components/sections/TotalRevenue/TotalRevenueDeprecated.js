import React from 'react'
import Link from '../../utils/temp-link'
import { connect } from 'react-redux'

import utils from '../../../js/utils'

import { updateGraphDataSets as updateGraphDataSetsAction, groupByMonth as groupDataSetsByMonthAction, groupByYear as groupDataSetsByYearAction, setDataSelectedById as setDataSelectedByIdAction,
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

const CHART_SORT_ORDER = [CONSTANTS.FEDERAL_ONSHORE, CONSTANTS.FEDERAL_OFFSHORE, CONSTANTS.NATIVE_AMERICAN, CONSTANTS.NOT_TIED_TO_A_LEASE]

const CHART_DISPLAY_NAMES = {}
CHART_DISPLAY_NAMES[CONSTANTS.NOT_TIED_TO_A_LEASE] = { displayName: 'Federal - not tied to a lease' }

const CHART_STYLE_MAP = {
  'bar': styles.chartBar,
  [CONSTANTS.FEDERAL_OFFSHORE]: styles.federalOffshore,
  [CONSTANTS.FEDERAL_ONSHORE]: styles.federalOnshore,
  [CONSTANTS.NATIVE_AMERICAN]: styles.nativeAmerican,
  [CONSTANTS.NOT_TIED_TO_A_LEASE]: styles.notTiedToALease,
  hover: {
    [CONSTANTS.FEDERAL_OFFSHORE]: styles.federalOffshoreHover,
    [CONSTANTS.FEDERAL_ONSHORE]: styles.federalOnshoreHover,
    [CONSTANTS.NATIVE_AMERICAN]: styles.nativeAmericanHover,
    [CONSTANTS.NOT_TIED_TO_A_LEASE]: styles.notTiedToALeaseHover
  }
}

// Define configs for filtering the data sets
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
    onlyFullFiscalYears: true,
    limit: 10,
  }
}

const REVENUES_FISCAL_YEAR_OLD = 'RevenuesFiscalYear'
const REVENUES_CALENDAR_YEAR = 'RevenuesCalendarYear'

class TotalRevenueDeprecated extends React.Component {
  constructor (props) {
    super(props)
    props.updateBarChartDataSets([{ id: KEY_STATS_REVENUES_DATA_ID, sourceKey: REVENUES_FISCAL_YEAR, groupByKey: BY_FISCAL_YEAR, ...REVENUES_BY_FISCALYEAR_CONFIG }])
  }

	state = {
	  revenueToggle: TOGGLE_VALUES.Year,
	  revenuePeriod: DROPDOWN_VALUES.Recent,
	  revenueYearlyPeriod: YEARLY_DROPDOWN_VALUES.Fiscal,
	}

	componentWillReceiveProps (nextProps) {
	  this.setState({ ...nextProps })
	}

	componentDidUpdate () {
	  // console.log(this.state)
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
	  	if (revenueYearlyPeriod === YEARLY_DROPDOWN_VALUES.Fiscal) {
		    this.props.updateBarChartDataSets([
		  		{ id: KEY_STATS_REVENUES_DATA_ID, sourceKey: REVENUES_FISCAL_YEAR, groupByKey: BY_FISCAL_YEAR, ...REVENUES_BY_FISCALYEAR_CONFIG }
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

	        displayNames= {CHART_DISPLAY_NAMES}

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

		  <h3 className={styles.title + ' h3-bar'}>Total revenue<span className={styles.titleRight}>
		  <ExploreDataLink
		    to="/query-data/?dataType=Revenue"
	            icon="filter"
		    >Filter revenue data
			    </ExploreDataLink></span> </h3>
		  <div className={styles.content}>
		  <div className={styles.itemToggle}>

		  <div className={styles.toggle}>
		  Show:
	            <Toggle action={this.revenueToggleClicked.bind(this)} buttons={[{ key: TOGGLE_VALUES.Year, name: CONSTANTS.YEARLY, default: true },
										    { key: TOGGLE_VALUES.Month, name: CONSTANTS.MONTHLY }]} ></Toggle>
		  </div>
		  {(this.state.revenueToggle === TOGGLE_VALUES.Month)
		      ? <div className={styles.dropdown}>
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
			  : <div className={styles.dropdown}>
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
	        <div className={styles.sourceLink}>
	          <Link to='./downloads/revenue/'>Source file</Link>
	        </div>
		  </div>
	      </section>

	  )
	}
}

export default connect(
  state => ({
    [KEY_STATS_REVENUES_DATA_ID]: state[CONSTANTS.DATA_SETS_STATE_KEY][KEY_STATS_REVENUES_DATA_ID],
    [REVENUES_FISCAL_YEAR_OLD]: state[CONSTANTS.DATA_SETS_STATE_KEY][CONSTANTS.FISCAL_YEAR_KEY][CONSTANTS.REVENUES_ALL_KEY],
    [REVENUES_CALENDAR_YEAR]: state[CONSTANTS.DATA_SETS_STATE_KEY][CONSTANTS.CALENDAR_YEAR_KEY][CONSTANTS.REVENUES_ALL_KEY],
    [REVENUES_FISCAL_YEAR]: state[CONSTANTS.DATA_SETS_STATE_KEY][REVENUES_FISCAL_YEAR]
  }),
  dispatch => ({
    updateBarChartDataSets: dataSets => dispatch(updateGraphDataSetsAction(dataSets)),
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
