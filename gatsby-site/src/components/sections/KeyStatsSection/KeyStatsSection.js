import React from 'react';
import { connect } from 'react-redux';

import utils from "../../../js/utils";


import { groupByMonth as groupDataSetsByMonthAction } from '../../../state/reducers/data-sets';
import { groupByYear as groupDataSetsByYearAction } from '../../../state/reducers/data-sets';
import { setDataSelectedById as setDataSelectedByIdAction } from '../../../state/reducers/data-sets';

import CONSTANTS from '../../../js/constants';

import styles from "./KeyStatsSection.module.css";

import {ExploreDataLink} from '../../layouts/icon-links/ExploreDataLink';
import {Toggle} from '../../selectors/Toggle';
import {DropDown} from '../../selectors/DropDown';
import {StackedBarChartLayout} from '../../layouts/charts/StackedBarChartLayout';

const TOGGLE_VALUES ={
	Year: "year",
	Month: "month"
}

const DROPDOWN_VALUES ={
	Recent: "recent",
	Fiscal: "fiscal",
	Calendar: "calendar"
}

const CHART_LEGEND_TITLE = "Source";

const CHART_SORT_ORDER = [CONSTANTS.FEDERAL_ONSHORE, CONSTANTS.FEDERAL_OFFSHORE, CONSTANTS.NATIVE_AMERICAN];

const CHART_STYLE_MAP = {
	"bar": styles.chartBar,
	[CONSTANTS.FEDERAL_OFFSHORE]: styles.federalOffshore,
	[CONSTANTS.FEDERAL_ONSHORE]: styles.federalOnshore,
	[CONSTANTS.NATIVE_AMERICAN]: styles.nativeAmerican,
	hover : {
		[CONSTANTS.FEDERAL_OFFSHORE]: styles.federalOffshoreHover,
		[CONSTANTS.FEDERAL_ONSHORE]: styles.federalOnshoreHover,
		[CONSTANTS.NATIVE_AMERICAN]: styles.nativeAmericanHover,
	}
};

// Define configs for filtering the data sets
const KEY_STATS_OIL_DATA_ID = "KEY_STATS_OIL_DATA_ID";
const KEY_STATS_GAS_DATA_ID = "KEY_STATS_GAS_DATA_ID";
const KEY_STATS_COAL_DATA_ID = "KEY_STATS_COAL_DATA_ID";

const PRODUCTION_VOLUMES_BY_YEAR_CONFIG = {
	options: {
		includeDisplayNames: true,
		subGroupName: CONSTANTS.CALENDAR_YEAR,
		syncId: "KEY_STATS_PROD_VOLUMES_YEAR",
		selectedDataKeyIndex: "last", 
	},
	filter: {
		sumBy:"ProductionCategory",
		limit: 10,
	}
};

const ALL_PRODUCTION_VOLUMES_BY_YEAR_CONFIGS = [
	{id: KEY_STATS_OIL_DATA_ID, sourceKey:  CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY, ...PRODUCTION_VOLUMES_BY_YEAR_CONFIG},
	{id: KEY_STATS_GAS_DATA_ID, sourceKey:  CONSTANTS.PRODUCTION_VOLUMES_GAS_KEY, ...PRODUCTION_VOLUMES_BY_YEAR_CONFIG},
	{id: KEY_STATS_COAL_DATA_ID, sourceKey:  CONSTANTS.PRODUCTION_VOLUMES_COAL_KEY, ...PRODUCTION_VOLUMES_BY_YEAR_CONFIG},
];

const PRODUCTION_VOLUMES_BY_MONTH_CONFIG = {
	options: {
		includeDisplayNames: true,
		subGroup: "ProductionYear",
		syncId: "KeyStatsProdVolumes_Month",
		selectedDataKeyIndex: "last",
	},
	filter: {
		sumBy:"ProductionCategory",
		limit: 12,
	}
};

const KEY_STATS_REVENUES_DATA_ID = "KEY_STATS_REVENUES_DATA_ID";
const REVENUES_BY_YEAR_CONFIG = {
	options :{
		includeDisplayNames: true,
		subGroupName: CONSTANTS.CALENDAR_YEAR,
		selectedDataKeyIndex: "last",
	},
	filter: {
		sumBy:"RevenueCategory",
		limit: 10,
	}
};
const REVENUES_BY_MONTH_CONFIG = {
	options :{
		includeDisplayNames: true,
		subGroup: "RevenueYear",
		selectedDataKeyIndex: "last",
	},
	filter: {
		sumBy:"RevenueCategory",
		limit: 12,
	}
};

const KEY_STATS_DISBURSEMENTS_DATA_ID = "KEY_STATS_DISBURSEMENTS_DATA_ID";
const DISBURSEMENTS_BY_YEAR_CONFIG = {
	options: {
		includeDisplayNames: true,
		subGroupName: CONSTANTS.FISCAL_YEAR,
		selectedDataKeyIndex: "last",
	},
	filter: {
		sumBy:"DisbursementCategory",
		limit: 10,
	}
};

const PRODUCTION_VOLUMES_FISCAL_YEAR = "ProductionVolumesFiscalYear";
const PRODUCTION_VOLUMES_CALENDAR_YEAR = "ProductionVolumesCalendarYear";
const REVENUES_FISCAL_YEAR = "RevenuesFiscalYear";
const REVENUES_CALENDAR_YEAR = "RevenuesCalendarYear";


class KeyStatsSection extends React.Component{

	constructor(props){
		super(props);

		// Filter Data Sets by Year initially
		props.groupDataSetsByYear([
			...ALL_PRODUCTION_VOLUMES_BY_YEAR_CONFIGS,
			{id: KEY_STATS_REVENUES_DATA_ID, sourceKey: CONSTANTS.REVENUES_ALL_KEY, ...REVENUES_BY_YEAR_CONFIG},
			{id: KEY_STATS_DISBURSEMENTS_DATA_ID, sourceKey: CONSTANTS.DISBURSEMENTS_ALL_KEY, ...DISBURSEMENTS_BY_YEAR_CONFIG},
		]);

	}

	state = {
		productionToggle: TOGGLE_VALUES.Year,
		productionPeriod: DROPDOWN_VALUES.Recent,
		revenueToggle: TOGGLE_VALUES.Year,
		revenuePeriod: DROPDOWN_VALUES.Recent,
	}

	componentWillReceiveProps(nextProps) {
    this.setState({...nextProps});
  }

	productionToggleClicked(value) {
		if(value !== this.state.productionToggle) {
			this.setStateForProductionVolumes(value, this.state.productionPeriod);
		}
	}

	productionPeriodSelected(value) {
		if(value !== this.state.productionPeriod) {
			this.setStateForProductionVolumes(this.state.productionToggle, value);
		}
	}

	setStateForProductionVolumes(toggleValue, dropDownValue) {
		if(toggleValue === TOGGLE_VALUES.Year) {
			this.props.groupDataSetsByYear([...ALL_PRODUCTION_VOLUMES_BY_YEAR_CONFIGS]);
				
			this.setState({
				productionToggle: toggleValue, 
				productionPeriod: dropDownValue,
			});

		}
		else {
			let filter = {...PRODUCTION_VOLUMES_BY_MONTH_CONFIG.filter, period: dropDownValue};
			this.props.groupDataSetsByMonth([
				{id: KEY_STATS_OIL_DATA_ID, sourceKey: CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY, filter: filter, options: PRODUCTION_VOLUMES_BY_MONTH_CONFIG.options},
				{id: KEY_STATS_GAS_DATA_ID, sourceKey: CONSTANTS.PRODUCTION_VOLUMES_GAS_KEY, filter: filter, options: PRODUCTION_VOLUMES_BY_MONTH_CONFIG.options},
				{id: KEY_STATS_COAL_DATA_ID, sourceKey: CONSTANTS.PRODUCTION_VOLUMES_COAL_KEY, filter: filter, options: PRODUCTION_VOLUMES_BY_MONTH_CONFIG.options},
			]);
			
			this.setState({
				productionToggle: toggleValue, 
				productionPeriod: dropDownValue,
			});

		}
	}

	revenueToggleClicked(value) {
		if(value !== this.state.revenueToggle) {
			this.setStateForRevenues(value, this.state.revenuePeriod);
		}
	}

	revenuePeriodSelected(value) {
		if(value !== this.state.revenuePeriod) {
			this.setStateForRevenues(this.state.revenueToggle, value);
		}
	}

	setStateForRevenues(toggleValue, dropDownValue) {
		if(toggleValue === TOGGLE_VALUES.Year) {
			this.props.groupDataSetsByYear([
				{id: KEY_STATS_REVENUES_DATA_ID, sourceKey: CONSTANTS.REVENUES_ALL_KEY, ...REVENUES_BY_YEAR_CONFIG},
			]);

			this.setState({
				revenueToggle: toggleValue, 
				revenuePeriod: dropDownValue,
			});
		}
		else {
			this.props.groupDataSetsByMonth([
				{id: KEY_STATS_REVENUES_DATA_ID, sourceKey: CONSTANTS.REVENUES_ALL_KEY, filter: {...REVENUES_BY_MONTH_CONFIG.filter, period: dropDownValue}, options: REVENUES_BY_MONTH_CONFIG.options}
			]);

			this.setState({
				revenueToggle: toggleValue, 
				revenuePeriod: dropDownValue,
			});
		}
	}


	getStackedBarChartLayout(dataSetId, title, dataFormatFunc) {

		if(this.state[dataSetId] === undefined) {
			return;
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
		);
	}

	// Callback for charts. Used to sync production volume charts 
	dataKeySelectedHandler(dataSetId, syncId, data) {
		this.props.setDataSelectedById([{id:dataSetId, dataKey: Object.keys(data)[0], syncId: syncId}])
	}

	render(){

		return(
	    <section className="slab-alpha ">
	    	<div className="container-page-wrapper">
					<section id="data-summary" className={styles.root}>
						<h2>Data summary</h2>
						<p>Summary of production, revenue, and disbursements for resources extracted on federal lands and waters and Native American lands.</p>
					
						<section id="key-stats-production"  className={styles.production}>
							<div className={styles.sectionTitle}>
								<h3>Production</h3>
								<div>Production data for major commodities</div>
								<div><ExploreDataLink to="/explore/#production" >Explore all production data</ExploreDataLink></div>
							</div>

							<div>
								<div className={styles.toggle}>
									Show:
									<Toggle action={this.productionToggleClicked.bind(this)} buttons={[{key:TOGGLE_VALUES.Year, name:"Yearly",default: true},
								  {key:TOGGLE_VALUES.Month, name:"Monthly"}]}></Toggle>
								</div>

								{(this.state.productionToggle === TOGGLE_VALUES.Month) &&
									<div className={styles.dropdown}>
										Period:
										<DropDown 
											action={this.productionPeriodSelected.bind(this)} 
											options={[
												{key:DROPDOWN_VALUES.Recent, 
													name:"Most recent 12 months",
													default: (this.state.productionPeriod === DROPDOWN_VALUES.Recent)},
												{key:DROPDOWN_VALUES.Fiscal,
													name:"Fiscal year "+this.state[PRODUCTION_VOLUMES_FISCAL_YEAR],
													default: (this.state.productionPeriod === DROPDOWN_VALUES.Fiscal)}, 
												{key:DROPDOWN_VALUES.Calendar,
													name:"Calendar year "+this.state[PRODUCTION_VOLUMES_CALENDAR_YEAR],
													default: (this.state.productionPeriod === DROPDOWN_VALUES.Calendar)}]}></DropDown>
									</div>
								}

							</div>

							<div className={styles.productChartContainer}>
								{this.getStackedBarChartLayout(KEY_STATS_OIL_DATA_ID, CONSTANTS.OIL )}

								{this.getStackedBarChartLayout(KEY_STATS_GAS_DATA_ID, CONSTANTS.GAS )}

								{this.getStackedBarChartLayout(KEY_STATS_COAL_DATA_ID, CONSTANTS.COAL )}
							</div>

						</section>
						<section className={styles.revenueDisbursementsSection} >
							<div className={styles.itemTitle}><h3>Revenue</h3></div>
							<div className={styles.itemDesc}>Federal revenue from bonuses, rent, and royalties paid by companies to extract natural resources</div>
							<div className={styles.itemLink}><ExploreDataLink to="/explore/#federal-revenue" >Explore all revenue data</ExploreDataLink></div>
							
							<div className={styles.itemToggle}>
								<div className={styles.toggle}>
									Show:
									<Toggle action={this.revenueToggleClicked.bind(this)} buttons={[{key:TOGGLE_VALUES.Year, name:CONSTANTS.YEARLY,default: true},
								  {key:TOGGLE_VALUES.Month,name:CONSTANTS.MONTHLY}]}></Toggle>
								</div>
								{(this.state.revenueToggle === TOGGLE_VALUES.Month) &&
									<div className={styles.dropdown}>
										Period:
										<DropDown 
											action={this.revenuePeriodSelected.bind(this)} 
											options={[
												{key:DROPDOWN_VALUES.Recent, 
													name:"Most recent 12 months",
													default: (this.state.revenuePeriod === DROPDOWN_VALUES.Recent)},
												{key:DROPDOWN_VALUES.Fiscal,
													name:"Fiscal year "+this.state[REVENUES_FISCAL_YEAR],
													default: (this.state.revenuePeriod === DROPDOWN_VALUES.Fiscal)}, 
												{key:DROPDOWN_VALUES.Calendar,
													name:"Calendar year "+this.state[REVENUES_CALENDAR_YEAR],
													default: (this.state.revenuePeriod === DROPDOWN_VALUES.Calendar)}]}></DropDown>
									</div>
								}
							</div>

							<div className={styles.itemChart}> 
								{this.getStackedBarChartLayout(KEY_STATS_REVENUES_DATA_ID, CONSTANTS.REVENUE, utils.formatToDollarInt)}
							</div>

							<div className={styles.itemTitle+" "+styles.itemDisbursements}>
								<h3>Disbursements</h3>
							</div>
							<div className={styles.itemDesc+" "+styles.itemDisbursements}>
								Distribution of federal revenue to local governments, the U.S. treasury, Native Americans, and designated funds
							</div>
							<div className={styles.itemLink+" "+styles.itemDisbursements}>
								<ExploreDataLink to="/explore/#federal-disbursements" >Explore all disbursements data</ExploreDataLink>
							</div>
							<div className={styles.itemChart+" "+styles.itemDisbursements}>
								{this.getStackedBarChartLayout(KEY_STATS_DISBURSEMENTS_DATA_ID, CONSTANTS.DISBURSEMENTS, utils.formatToDollarInt)}
							</div>
						</section>

					</section>
				</div>

			</section>
		);
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
		[REVENUES_FISCAL_YEAR]: state[CONSTANTS.DATA_SETS_STATE_KEY][CONSTANTS.FISCAL_YEAR_KEY][CONSTANTS.REVENUES_ALL_KEY],
		[REVENUES_CALENDAR_YEAR]: state[CONSTANTS.DATA_SETS_STATE_KEY][CONSTANTS.CALENDAR_YEAR_KEY][CONSTANTS.REVENUES_ALL_KEY],
	}),
  dispatch => ({			
  	groupDataSetsByMonth: (configs) => dispatch( groupDataSetsByMonthAction(configs) ),
		groupDataSetsByYear: (configs) => dispatch( groupDataSetsByYearAction(configs) ),
		setDataSelectedById: (configs) => dispatch( setDataSelectedByIdAction(configs) ),

  })

)(KeyStatsSection);

const getDefaultChartData = (dataSet) => {
	let key = Object.keys(dataSet[dataSet.length-1])[0];
	let data = dataSet[dataSet.length-1][key];
	return {chartLegendData: data, chartDataKeySelected: key }
};
