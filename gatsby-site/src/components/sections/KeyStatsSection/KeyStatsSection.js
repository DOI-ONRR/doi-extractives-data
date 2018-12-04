import React from 'react';
import { connect } from 'react-redux';

import utils from "../../../js/utils";

import { byMonth as productionVolumesByMonthAction } from '../../../state/reducers/production-volumes';
import { byYear as productionVolumesByYearAction } from '../../../state/reducers/production-volumes';
import { byMonth as revenuesByMonthAction } from '../../../state/reducers/revenues';
import { byYear as revenuesByYearAction } from '../../../state/reducers/revenues';
import { byYear as disbursementsByYearAction } from '../../../state/reducers/federal-disbursements';

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

const CHART_HEADER_NAME = "Source";

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

// Define filter and options for data
const OPTIONS_PRODUCTION_VOLUMES_BY_YEAR = {
	includeDisplayNames: true,
	subGroupName: CONSTANTS.CALENDAR_YEAR,
};
const FILTER_PRODUCTION_VOLUMES_BY_YEAR = {
	sumBy:"ProductionCategory",
	limit: 10,
}
const OPTIONS_PRODUCTION_VOLUMES_BY_MONTH = {
	includeDisplayNames: true,
	subGroup: "ProductionYear",
};
const FILTER_PRODUCTION_VOLUMES_BY_MONTH = {
	sumBy:"ProductionCategory",
	limit: 12,
}
const REVENUES_BY_YEAR = {
	options :{
		includeDisplayNames: true,
		subGroupName: CONSTANTS.CALENDAR_YEAR,
	},
	filter: {
		sumBy:"RevenueCategory",
		limit: 10,
	}
};
const REVENUES_BY_MONTH = {
	options :{
		includeDisplayNames: true,
		subGroup: "RevenueYear",
	},
	filter: {
		sumBy:"RevenueCategory",
		limit: 12,
	}
};
const OPTIONS_DISBURSEMENTS_BY_YEAR = {
	includeDisplayNames: true,
	subGroupName: CONSTANTS.FISCAL_YEAR,
};
const FILTER_DISBURSEMENTS_BY_YEAR = {
	sumBy:"DisbursementCategory",
	limit: 10,
}

const PRODUCTION_VOLUMES_FISCAL_YEAR = "ProductionVolumesFiscalYear";
const PRODUCTION_VOLUMES_CALENDAR_YEAR = "ProductionVolumesCalendarYear";
const REVENUES_FISCAL_YEAR = "RevenuesFiscalYear";
const REVENUES_CALENDAR_YEAR = "RevenuesCalendarYear";


class KeyStatsSection extends React.Component{

	constructor(props){
		super(props);
	}

	componentWillMount() {
		this.setStateForProductionVolumes(TOGGLE_VALUES.Year, DROPDOWN_VALUES.Recent);
		this.setStateForRevenues(TOGGLE_VALUES.Year, DROPDOWN_VALUES.Recent);
		this.setStateForDisbursements();
	}

	state = {
		productionToggle: TOGGLE_VALUES.Year,
		productionPeriod: DROPDOWN_VALUES.Recent,
		revenueToggle: TOGGLE_VALUES.Year,
		revenuePeriod: DROPDOWN_VALUES.Recent,
		[CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY]: this.props[CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY],
		[CONSTANTS.PRODUCTION_VOLUMES_GAS_KEY]: this.props[CONSTANTS.PRODUCTION_VOLUMES_GAS_KEY],
		[CONSTANTS.PRODUCTION_VOLUMES_COAL_KEY]: this.props[CONSTANTS.PRODUCTION_VOLUMES_COAL_KEY],
		[CONSTANTS.REVENUES_ALL_KEY]: this.props[CONSTANTS.REVENUES_ALL_KEY],
		[CONSTANTS.DISBURSEMENTS_ALL_KEY]: this.props[CONSTANTS.DISBURSEMENTS_ALL_KEY],
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

			this.setState({
				productionToggle: toggleValue, 
				productionPeriod: dropDownValue,
				[CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY]: 
					this.props.productionVolumesByYear(CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY, FILTER_PRODUCTION_VOLUMES_BY_YEAR, OPTIONS_PRODUCTION_VOLUMES_BY_YEAR),
				[CONSTANTS.PRODUCTION_VOLUMES_GAS_KEY]: 
					this.props.productionVolumesByYear(CONSTANTS.PRODUCTION_VOLUMES_GAS_KEY, FILTER_PRODUCTION_VOLUMES_BY_YEAR, OPTIONS_PRODUCTION_VOLUMES_BY_YEAR),
				[CONSTANTS.PRODUCTION_VOLUMES_COAL_KEY]: 
					this.props.productionVolumesByYear(CONSTANTS.PRODUCTION_VOLUMES_COAL_KEY, FILTER_PRODUCTION_VOLUMES_BY_YEAR, OPTIONS_PRODUCTION_VOLUMES_BY_YEAR),
			});
		}
		else {
			this.setState({
				productionToggle: toggleValue, 
				productionPeriod: dropDownValue,
				[CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY]: 
					this.props.productionVolumesByMonth(CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY, {...FILTER_PRODUCTION_VOLUMES_BY_MONTH, period:dropDownValue }, OPTIONS_PRODUCTION_VOLUMES_BY_MONTH),
				[CONSTANTS.PRODUCTION_VOLUMES_GAS_KEY]: 
					this.props.productionVolumesByMonth(CONSTANTS.PRODUCTION_VOLUMES_GAS_KEY, {...FILTER_PRODUCTION_VOLUMES_BY_MONTH, period:dropDownValue }, OPTIONS_PRODUCTION_VOLUMES_BY_MONTH),
				[CONSTANTS.PRODUCTION_VOLUMES_COAL_KEY]: 
					this.props.productionVolumesByMonth(CONSTANTS.PRODUCTION_VOLUMES_COAL_KEY, {...FILTER_PRODUCTION_VOLUMES_BY_MONTH, period:dropDownValue }, OPTIONS_PRODUCTION_VOLUMES_BY_MONTH),

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
			this.setState({
				revenueToggle: toggleValue, 
				revenuePeriod: dropDownValue,
				[CONSTANTS.REVENUES_ALL_KEY]: this.props.revenuesByYear(CONSTANTS.REVENUES_ALL_KEY, REVENUES_BY_YEAR.filter, REVENUES_BY_YEAR.options),
			});
		}
		else {
			this.setState({
				revenueToggle: toggleValue, 
				revenuePeriod: dropDownValue,
				[CONSTANTS.REVENUES_ALL_KEY]: this.props.revenuesByMonth(CONSTANTS.REVENUES_ALL_KEY, {...REVENUES_BY_MONTH.filter, period:dropDownValue,}, REVENUES_BY_MONTH.options),

			});
		}
	}

	setStateForDisbursements() {
		this.setState({
			[CONSTANTS.DISBURSEMENTS_ALL_KEY]: this.props.disbursementsByYear(CONSTANTS.DISBURSEMENTS_ALL_KEY, FILTER_DISBURSEMENTS_BY_YEAR, OPTIONS_DISBURSEMENTS_BY_YEAR),
		});
	}

	getStackedBarChartLayout(dataKey, title, dataFormatFunc) {
		return (
			<div is="chart">
				<StackedBarChartLayout 
					chartDisplayConfig = {{
						xAxisLabels: this.state[dataKey].XAxisLabels,
						legendLabels: this.state[dataKey].LegendLabels,
						title: title,
						longUnits: this.state[dataKey].LongUnits,
						units: this.state[dataKey].Units,
						styleMap: CHART_STYLE_MAP,
						sortOrder: CHART_SORT_ORDER,
					}}

					chartLegendHeaderName={CHART_HEADER_NAME}

					chartData={this.state[dataKey].Data}

					chartLegendDataFormatFunc={dataFormatFunc || utils.formatToCommaInt}

					chartGroups={this.state[dataKey].GroupNames}

					maxBarSize={MAX_CHART_BAR_SIZE}

					{...getDefaultChartData(this.state[dataKey].Data)}
					>
				</StackedBarChartLayout>
			</div>
		);
	}

	getProductionVolumesChartTitle(dataKey) {
		return(this.state[dataKey].ProductName+" ("+this.state[dataKey].Units+")");
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
													name:"Fiscal year "+this.state[PRODUCTION_VOLUMES_FISCAL_YEAR][CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY],
													default: (this.state.productionPeriod === DROPDOWN_VALUES.Fiscal)}, 
												{key:DROPDOWN_VALUES.Calendar,
													name:"Calendar year "+this.state[PRODUCTION_VOLUMES_CALENDAR_YEAR][CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY],
													default: (this.state.productionPeriod === DROPDOWN_VALUES.Calendar)}]}></DropDown>
									</div>
								}

							</div>

							<div className={styles.productChartContainer}>
								{this.state[CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY].Data && 
									this.getStackedBarChartLayout(CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY, this.getProductionVolumesChartTitle(CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY))}

								{this.state[CONSTANTS.PRODUCTION_VOLUMES_GAS_KEY].Data &&
									this.getStackedBarChartLayout(CONSTANTS.PRODUCTION_VOLUMES_GAS_KEY, this.getProductionVolumesChartTitle(CONSTANTS.PRODUCTION_VOLUMES_GAS_KEY))}

								{this.state[CONSTANTS.PRODUCTION_VOLUMES_COAL_KEY].Data &&
									this.getStackedBarChartLayout(CONSTANTS.PRODUCTION_VOLUMES_COAL_KEY, this.getProductionVolumesChartTitle(CONSTANTS.PRODUCTION_VOLUMES_COAL_KEY))}
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
													name:"Fiscal year "+this.state[REVENUES_FISCAL_YEAR][CONSTANTS.REVENUES_ALL_KEY],
													default: (this.state.revenuePeriod === DROPDOWN_VALUES.Fiscal)}, 
												{key:DROPDOWN_VALUES.Calendar,
													name:"Calendar year "+this.state[REVENUES_CALENDAR_YEAR][CONSTANTS.REVENUES_ALL_KEY],
													default: (this.state.revenuePeriod === DROPDOWN_VALUES.Calendar)}]}></DropDown>
									</div>
								}
							</div>

							<div className={styles.itemChart}> 
								{this.state[CONSTANTS.REVENUES_ALL_KEY].Data &&
									this.getStackedBarChartLayout(CONSTANTS.REVENUES_ALL_KEY, CONSTANTS.REVENUE, utils.formatToDollarInt)}
							</div>

							<div className={styles.itemTitle+" "+styles.itemDisbursements} ><h3>Disbursements</h3></div>
							<div className={styles.itemDesc+" "+styles.itemDisbursements}>Distribution of federal revenue to local governments, the U.S. treasury, Native Americans, and designated funds</div>
							<div className={styles.itemLink+" "+styles.itemDisbursements}><ExploreDataLink to="/explore/#federal-disbursements" >Explore all disbursements data</ExploreDataLink></div>
							<div className={styles.itemChart+" "+styles.itemDisbursements}>
								{this.state[CONSTANTS.DISBURSEMENTS_ALL_KEY].Data &&
									this.getStackedBarChartLayout(CONSTANTS.DISBURSEMENTS_ALL_KEY, CONSTANTS.DISBURSEMENTS, utils.formatToDollarInt)}
							</div>
						</section>

					</section>
				</div>

			</section>
		);
	}

}

export default connect(
  state => ({	[CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY]: state[CONSTANTS.PRODUCTION_VOLUMES_KEY][CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY],
  						[CONSTANTS.PRODUCTION_VOLUMES_GAS_KEY]: state[CONSTANTS.PRODUCTION_VOLUMES_KEY][CONSTANTS.PRODUCTION_VOLUMES_GAS_KEY],
  						[CONSTANTS.PRODUCTION_VOLUMES_COAL_KEY]: state[CONSTANTS.PRODUCTION_VOLUMES_KEY][CONSTANTS.PRODUCTION_VOLUMES_COAL_KEY],
  						[CONSTANTS.REVENUES_ALL_KEY]: state[CONSTANTS.REVENUES_KEY][CONSTANTS.REVENUES_ALL_KEY],
  						[CONSTANTS.DISBURSEMENTS_ALL_KEY]: state[CONSTANTS.DISBURSEMENTS_KEY][CONSTANTS.DISBURSEMENTS_ALL_KEY],
  						[PRODUCTION_VOLUMES_FISCAL_YEAR]: state[CONSTANTS.PRODUCTION_VOLUMES_KEY][CONSTANTS.FISCAL_YEAR_KEY],
  						[PRODUCTION_VOLUMES_CALENDAR_YEAR]: state[CONSTANTS.PRODUCTION_VOLUMES_KEY][CONSTANTS.CALENDAR_YEAR_KEY],
  						[REVENUES_FISCAL_YEAR]: state[CONSTANTS.REVENUES_KEY][CONSTANTS.FISCAL_YEAR_KEY],
  						[REVENUES_CALENDAR_YEAR]: state[CONSTANTS.REVENUES_KEY][CONSTANTS.CALENDAR_YEAR_KEY],
  					}),
  dispatch => ({	productionVolumesByYear: (key, filter, options) => dispatch(productionVolumesByYearAction(key, filter, options)),
  								productionVolumesByMonth: (key, filter, options) => dispatch(productionVolumesByMonthAction(key, filter, options)),
  								revenuesByMonth: (key, filter, options) => dispatch(revenuesByMonthAction(key, filter, options)),
  								revenuesByYear: (key, filter, options) => dispatch(revenuesByYearAction(key, filter, options)),
  								disbursementsByYear: (key, filter, options) => dispatch(disbursementsByYearAction(key, filter, options)),
  						})
)(KeyStatsSection);

const getDefaultChartData = (dataSet) => {
	let key = Object.keys(dataSet[dataSet.length-1])[0];
	let data = dataSet[dataSet.length-1][key];
	return {chartLegendData: data, chartDataKeySelected: key }
};