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

const CHART_SORT_ORDER = [CONSTANTS.FEDERAL_ONSHORE, CONSTANTS.FEDERAL_OFFSHORE,CONSTANTS.NATIVE_AMERICAN];

const CHART_STYLE_MAP = {
	"bar": styles.chartBar,
	[CONSTANTS.FEDERAL_OFFSHORE]: styles.federalOffshore,
	[CONSTANTS.FEDERAL_ONSHORE]: styles.federalOnshore,
	[CONSTANTS.NATIVE_AMERICAN]: styles.nativeAmerican,
};

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
				[CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY]: this.props.productionVolumesByYear(CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY, {sumBy:"ProductionCategory", displayName:true, limit: 10 }),
				[CONSTANTS.PRODUCTION_VOLUMES_GAS_KEY]: this.props.productionVolumesByYear(CONSTANTS.PRODUCTION_VOLUMES_GAS_KEY, {sumBy:"ProductionCategory", displayName:true, limit: 10 }),
				[CONSTANTS.PRODUCTION_VOLUMES_COAL_KEY]: this.props.productionVolumesByYear(CONSTANTS.PRODUCTION_VOLUMES_COAL_KEY, {sumBy:"ProductionCategory", displayName:true, limit: 10 })
			});
		}
		else {
			this.setState({
				productionToggle: toggleValue, 
				productionPeriod: dropDownValue,
				[CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY]: this.props.productionVolumesByMonth(CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY, {sumBy:"ProductionCategory", displayName:true, limit: 12, period:dropDownValue, subGroup:"ProductionYear" }),
				[CONSTANTS.PRODUCTION_VOLUMES_GAS_KEY]: this.props.productionVolumesByMonth(CONSTANTS.PRODUCTION_VOLUMES_GAS_KEY, {sumBy:"ProductionCategory", displayName:true, limit: 12, period:dropDownValue, subGroup:"ProductionYear" }),
				[CONSTANTS.PRODUCTION_VOLUMES_COAL_KEY]: this.props.productionVolumesByMonth(CONSTANTS.PRODUCTION_VOLUMES_COAL_KEY, {sumBy:"ProductionCategory", displayName:true, limit: 12, period:dropDownValue, subGroup:"ProductionYear" }),

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
				[CONSTANTS.REVENUES_ALL_KEY]: this.props.revenuesByYear(CONSTANTS.REVENUES_ALL_KEY, {sumBy:"RevenueCategory", displayName:true, limit: 10 }),
			});
		}
		else {
			this.setState({
				revenueToggle: toggleValue, 
				revenuePeriod: dropDownValue,
				[CONSTANTS.REVENUES_ALL_KEY]: this.props.revenuesByMonth(CONSTANTS.REVENUES_ALL_KEY, {sumBy:"RevenueCategory", displayName:true, limit: 12, period:dropDownValue, subGroup:"RevenueYear" }),

			});
		}
	}

	setStateForDisbursements() {
		this.setState({
			[CONSTANTS.DISBURSEMENTS_ALL_KEY]: this.props.disbursementsByYear(CONSTANTS.DISBURSEMENTS_ALL_KEY, {sumBy:"DisbursementCategory", displayName:true, limit: 10 }),
		});
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
								<div>Production data for major commodities.</div>
								<div><ExploreDataLink to="/explore/#production" >Explore all production data</ExploreDataLink></div>
							</div>

							<div>
								<div className={styles.toggle}>
									Show:
									<Toggle action={this.productionToggleClicked.bind(this)} buttons={[{key:TOGGLE_VALUES.Year, name:"Yearly",default: true},
								  {key:TOGGLE_VALUES.Month,name:"Monthly"}]}></Toggle>
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
								{this.state[CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY] &&
									<div is="chart">
										<StackedBarChartLayout 
											chartDisplayConfig = {{
												xAxisLabels: this.state[CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY].DisplayNames,
												title: this.state[CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY].ProductName+" ("+this.state[CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY].Units+")",
												longUnits: this.state[CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY].LongUnits,
												units: this.state[CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY].Units,
												styleMap: CHART_STYLE_MAP,
												sortOrder: CHART_SORT_ORDER,
											}}

											chartData={this.state[CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY].Data}

											chartLegendDataFormatFunc={utils.formatToCommaInt}

											chartGroups={this.state[CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY].GroupNames}

											>
										</StackedBarChartLayout>
									</div>
								}
								{this.state[CONSTANTS.PRODUCTION_VOLUMES_GAS_KEY] &&
									<div is="chart">
										<StackedBarChartLayout 
											chartDisplayConfig = {{
												xAxisLabels: this.state[CONSTANTS.PRODUCTION_VOLUMES_GAS_KEY].DisplayNames,
												title: this.state[CONSTANTS.PRODUCTION_VOLUMES_GAS_KEY].ProductName+" ("+this.state[CONSTANTS.PRODUCTION_VOLUMES_GAS_KEY].Units+")",
												longUnits: this.state[CONSTANTS.PRODUCTION_VOLUMES_GAS_KEY].LongUnits,
												units: this.state[CONSTANTS.PRODUCTION_VOLUMES_GAS_KEY].Units,
												styleMap: CHART_STYLE_MAP,
												sortOrder: CHART_SORT_ORDER,
											}}

											chartData={this.state[CONSTANTS.PRODUCTION_VOLUMES_GAS_KEY].Data}

											chartLegendDataFormatFunc={utils.formatToCommaInt}

											chartGroups={this.state[CONSTANTS.PRODUCTION_VOLUMES_GAS_KEY].GroupNames}

											>
										</StackedBarChartLayout>
									</div>
								}
								{this.state[CONSTANTS.PRODUCTION_VOLUMES_COAL_KEY] &&
									<div is="chart">
										<StackedBarChartLayout 
											chartDisplayConfig = {{
												xAxisLabels: this.state[CONSTANTS.PRODUCTION_VOLUMES_COAL_KEY].DisplayNames,
												title: this.state[CONSTANTS.PRODUCTION_VOLUMES_COAL_KEY].ProductName+" ("+this.state[CONSTANTS.PRODUCTION_VOLUMES_COAL_KEY].Units+")",
												longUnits: this.state[CONSTANTS.PRODUCTION_VOLUMES_COAL_KEY].LongUnits,
												units: this.state[CONSTANTS.PRODUCTION_VOLUMES_COAL_KEY].Units,
												styleMap: CHART_STYLE_MAP,
												sortOrder: CHART_SORT_ORDER,
											}}

											chartData={this.state[CONSTANTS.PRODUCTION_VOLUMES_COAL_KEY].Data}

											chartLegendDataFormatFunc={utils.formatToCommaInt}

											chartGroups={this.state[CONSTANTS.PRODUCTION_VOLUMES_COAL_KEY].GroupNames}

											>
										</StackedBarChartLayout>
									</div>
								}

							</div>
						</section>
						<section className={styles.revenueDisbursementsSection} >
							<div className={styles.itemTitle}><h3>Revenue</h3></div>
							<div className={styles.itemDesc}>Federal revenue from bonuses, rent, and royalties paid by companies to extract natural.</div>
							<div className={styles.itemLink}><ExploreDataLink to="/explore/#production" >Explore all revenue data</ExploreDataLink></div>
							
							<div className={styles.itemToggle}>
								<div className={styles.toggle}>
									Show:
									<Toggle action={this.revenueToggleClicked.bind(this)} buttons={[{key:TOGGLE_VALUES.Year, name:"Yearly",default: true},
								  {key:TOGGLE_VALUES.Month,name:"Monthly"}]}></Toggle>
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
								{this.state[CONSTANTS.REVENUES_ALL_KEY] &&
									<div is="chart">
										<StackedBarChartLayout 
											chartDisplayConfig = {{
												xAxisLabels: this.state[CONSTANTS.REVENUES_ALL_KEY].DisplayNames,
												title: "Revenue",
												longUnits: this.state[CONSTANTS.REVENUES_ALL_KEY].Units,
												units: this.state[CONSTANTS.REVENUES_ALL_KEY].Units,
												styleMap: CHART_STYLE_MAP,
												sortOrder: CHART_SORT_ORDER,
											}}

											chartData={this.state[CONSTANTS.REVENUES_ALL_KEY].Data}

											chartLegendDataFormatFunc={utils.formatToDollarInt}

											chartGroups={this.state[CONSTANTS.REVENUES_ALL_KEY].GroupNames}

											>
										</StackedBarChartLayout>
									</div>
								}
							</div>

							<div className={styles.itemTitle+" "+styles.itemDisbursements} ><h3>Disbursements</h3></div>
							<div className={styles.itemDesc+" "+styles.itemDisbursements}>Distribution of federal revenue to local governments, the U.S. treasury, Native Americans, and designated funds.</div>
							<div className={styles.itemLink+" "+styles.itemDisbursements}><ExploreDataLink to="/explore/#production" >Explore all disbursements data</ExploreDataLink></div>
							<div className={styles.itemChart+" "+styles.itemDisbursements}>
								{this.state[CONSTANTS.DISBURSEMENTS_ALL_KEY] &&
									<div is="chart">
										<StackedBarChartLayout 
											chartDisplayConfig = {{
												xAxisLabels: this.state[CONSTANTS.DISBURSEMENTS_ALL_KEY].DisplayNames,
												title: "Disbursements",
												longUnits: this.state[CONSTANTS.DISBURSEMENTS_ALL_KEY].Units,
												units: this.state[CONSTANTS.DISBURSEMENTS_ALL_KEY].Units,
												styleMap: CHART_STYLE_MAP,
												sortOrder: CHART_SORT_ORDER,
											}}

											chartData={this.state[CONSTANTS.DISBURSEMENTS_ALL_KEY].Data}

											chartLegendDataFormatFunc={utils.formatToDollarInt}

											chartGroups={this.state[CONSTANTS.DISBURSEMENTS_ALL_KEY].GroupNames}

											>
										</StackedBarChartLayout>
									</div>
								}
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
  					}),
  dispatch => ({	productionVolumesByYear: (key, filter) => dispatch(productionVolumesByYearAction(key, filter)),
  								productionVolumesByMonth: (key, filter) => dispatch(productionVolumesByMonthAction(key, filter)),
  								revenuesByMonth: (key, filter) => dispatch(revenuesByMonthAction(key, filter)),
  								revenuesByYear: (key, filter) => dispatch(revenuesByYearAction(key, filter)),
  								disbursementsByYear: (key, filter) => dispatch(disbursementsByYearAction(key, filter)),
  						})
)(KeyStatsSection);