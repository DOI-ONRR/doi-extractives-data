import React from 'react';
import { connect } from 'react-redux';

import utils from "../../../js/utils";


import { groupByMonth as groupDataSetsByMonthAction } from '../../../state/reducers/data-sets';
import { groupByYear as groupDataSetsByYearAction } from '../../../state/reducers/data-sets';

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

const CHART_SORT_ORDER = [CONSTANTS.FEDERAL_ONSHORE, CONSTANTS.FEDERAL_OFFSHORE,CONSTANTS.NATIVE_AMERICAN];

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

const MAX_CHART_BAR_SIZE = 15;

// Define configs for filtering the data sets
const PRODUCTION_VOLUMES_BY_YEAR_CONFIG = {
	options: {
		includeDisplayNames: true,
		subGroupName: CONSTANTS.CALENDAR_YEAR,
		syncId: "KeyStatsProdVolumes_Year",
	},
	filter: {
		sumBy:"ProductionCategory",
		limit: 10,
	}
};
const PRODUCTION_VOLUMES_BY_MONTH_CONFIG = {
	options: {
		includeDisplayNames: true,
		subGroup: "ProductionYear",
		syncId: "KeyStatsProdVolumes_Month",
	},
	filter: {
		sumBy:"ProductionCategory",
		limit: 12,
	}
};

const REVENUES_BY_YEAR_CONFIG = {
	options :{
		includeDisplayNames: true,
		subGroupName: CONSTANTS.CALENDAR_YEAR,
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
	},
	filter: {
		sumBy:"RevenueCategory",
		limit: 12,
	}
};

const DISBURSEMENTS_BY_YEAR_CONFIG = {
	options: {
		includeDisplayNames: true,
		subGroupName: CONSTANTS.FISCAL_YEAR,
	},
	filter: {
		sumBy:"DisbursementCategory",
		limit: 10,
	}
};


class KeyStatsSection extends React.Component{

	constructor(props){
		super(props);

		// Filter Data Sets by Year initially
		props.groupDataSetsByYear([
			{key: CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY, ...PRODUCTION_VOLUMES_BY_YEAR_CONFIG},
			{key: CONSTANTS.PRODUCTION_VOLUMES_GAS_KEY, ...PRODUCTION_VOLUMES_BY_YEAR_CONFIG},
			{key: CONSTANTS.PRODUCTION_VOLUMES_COAL_KEY, ...PRODUCTION_VOLUMES_BY_YEAR_CONFIG},
			{key: CONSTANTS.REVENUES_ALL_KEY, ...REVENUES_BY_YEAR_CONFIG},
			{key: CONSTANTS.DISBURSEMENTS_ALL_KEY, ...DISBURSEMENTS_BY_YEAR_CONFIG},
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
			this.props.groupDataSetsByYear([
				{key: CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY, ...PRODUCTION_VOLUMES_BY_YEAR_CONFIG},
				{key: CONSTANTS.PRODUCTION_VOLUMES_GAS_KEY, ...PRODUCTION_VOLUMES_BY_YEAR_CONFIG},
				{key: CONSTANTS.PRODUCTION_VOLUMES_COAL_KEY, ...PRODUCTION_VOLUMES_BY_YEAR_CONFIG},
			]);
				
			this.setState({
				productionToggle: toggleValue, 
				productionPeriod: dropDownValue,
			});

		}
		else {
			let filter = {...PRODUCTION_VOLUMES_BY_MONTH_CONFIG.filter, period: dropDownValue};
			this.props.groupDataSetsByMonth([
				{key: CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY, filter: filter, options: PRODUCTION_VOLUMES_BY_MONTH_CONFIG.options},
				{key: CONSTANTS.PRODUCTION_VOLUMES_GAS_KEY, filter: filter, options: PRODUCTION_VOLUMES_BY_MONTH_CONFIG.options},
				{key: CONSTANTS.PRODUCTION_VOLUMES_COAL_KEY, filter: filter, options: PRODUCTION_VOLUMES_BY_MONTH_CONFIG.options},
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
				{key: CONSTANTS.REVENUES_ALL_KEY, ...REVENUES_BY_YEAR_CONFIG},
			]);

			this.setState({
				revenueToggle: toggleValue, 
				revenuePeriod: dropDownValue,
			});
		}
		else {
			this.props.groupDataSetsByMonth([
				{key: CONSTANTS.REVENUES_ALL_KEY, filter: {...REVENUES_BY_MONTH_CONFIG.filter, period: dropDownValue}, options: REVENUES_BY_MONTH_CONFIG.options}
			]);

			this.setState({
				revenueToggle: toggleValue, 
				revenuePeriod: dropDownValue,
			});
		}
	}


	getStackedBarChartLayout(dataKey, title, dataFormatFunc) {

		if(this.state[dataKey] === undefined) {
			return;
		}

		return (
			<div is="chart">
				<StackedBarChartLayout 

					dataSet = {this.state[dataKey]}

					chartTitle = {title}

					styleMap = {CHART_STYLE_MAP}

					sortOrder = {CHART_SORT_ORDER}

					chartLegendTitle = {CHART_LEGEND_TITLE}

					chartLegendDataFormatFunc = {dataFormatFunc || utils.formatToCommaInt}

					maxBarSize = {MAX_CHART_BAR_SIZE}

				>
				</StackedBarChartLayout>
			</div>
		);
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
													name:"Fiscal year 2017",
													default: (this.state.productionPeriod === DROPDOWN_VALUES.Fiscal)}, 
												{key:DROPDOWN_VALUES.Calendar,
													name:"Calendar year 2017",
													default: (this.state.productionPeriod === DROPDOWN_VALUES.Calendar)}]}></DropDown>
									</div>
								}

							</div>

							<div className={styles.productChartContainer}>
								{this.getStackedBarChartLayout(CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY, CONSTANTS.OIL )}

								{this.getStackedBarChartLayout(CONSTANTS.PRODUCTION_VOLUMES_GAS_KEY, CONSTANTS.GAS )}

								{this.getStackedBarChartLayout(CONSTANTS.PRODUCTION_VOLUMES_COAL_KEY, CONSTANTS.COAL )}
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
													name:"Fiscal year 2017",
													default: (this.state.revenuePeriod === DROPDOWN_VALUES.Fiscal)}, 
												{key:DROPDOWN_VALUES.Calendar,
													name:"Calendar year 2017",
													default: (this.state.revenuePeriod === DROPDOWN_VALUES.Calendar)}]}></DropDown>
									</div>
								}
							</div>

							<div className={styles.itemChart}> 
								{this.getStackedBarChartLayout(CONSTANTS.REVENUES_ALL_KEY, CONSTANTS.REVENUE, utils.formatToDollarInt)}
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
								{this.getStackedBarChartLayout(CONSTANTS.DISBURSEMENTS_ALL_KEY, CONSTANTS.DISBURSEMENTS, utils.formatToDollarInt)}
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
  	[CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY]: state[CONSTANTS.DATA_SETS_STATE_KEY][CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY]
  }),
  dispatch => ({	
		groupDataSetsByMonth: (configs) => dispatch( groupDataSetsByMonthAction(configs) ),
		groupDataSetsByYear: (configs) => dispatch( groupDataSetsByYearAction(configs) ),
	})
)(KeyStatsSection);

const getDefaultChartData = (dataSet) => {
	let key = Object.keys(dataSet[dataSet.length-1])[0];
	let data = dataSet[dataSet.length-1][key];
	return {chartLegendData: data, chartDataKeySelected: key }
};