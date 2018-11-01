import React from 'react';
import { connect } from 'react-redux';


import { byYear as productionVolumesByYearAction } from '../../../state/reducers/production-volumes';

import * as CONSTANTS from '../../../js/constants';

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

class KeyStatsSection extends React.Component{
	state = {
		productionToggle: TOGGLE_VALUES.Year,
		productionPeriod: DROPDOWN_VALUES.Recent,
		revenueToggle: TOGGLE_VALUES.Year,
		revenuePeriod: DROPDOWN_VALUES.Recent,
		[CONSTANTS.PRODUCT_VOLUMES_OIL]: this.props.productionVolumesByYear(CONSTANTS.PRODUCT_VOLUMES_OIL),
	}

	productionToggleClicked(value) {
		if(value !== this.state.productionToggle) {
			this.setState({productionToggle: value});
		}
	}

	productionPeriodSelected(value) {
		if(value !== this.state.productionPeriod) {
			this.setState({productionPeriod: value});
		}
	}

	revenueToggleClicked(value) {
		if(value !== this.state.revenueToggle) {
			this.setState({revenueToggle: value});
		}
	}

	revenuePeriodSelected(value) {
		if(value !== this.state.revenuePeriod) {
			this.setState({revenuePeriod: value});
		}
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
								<div is="chart">
									<StackedBarChartLayout 

										chartTitle="Oil (bbl)"

										units="barrels"

										chartData={[
											{"Jan": [{"Federal onshore": 100, "Federal offshore": 100, "Native American":90}]},
											{"Feb": [{"Federal onshore": 63, "Federal offshore": 30, "Native American":15}]},
											{"Mar": [{"Federal onshore": 22, "Federal offshore": 75, "Native American":35}]},
											{"Apr": [{"Federal onshore": 66, "Federal offshore": 50, "Native American":55}]},
											{"May": [{"Federal onshore": 56, "Federal offshore": 20, "Native American":90}]},
											{"Jun": [{"Federal onshore": 55, "Federal offshore": 33, "Native American":23}]},
											{"Jul": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":66}]},
											{"Aug": [{"Federal onshore": 99, "Federal offshore": 66, "Native American":35}]},
											{"Sep": [{"Federal onshore": 30, "Federal offshore": 20, "Native American":35}]},
											{"Oct": [{"Federal onshore": 42, "Federal offshore": 50, "Native American":35}]},
											{"Nov": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":65}]},
											{"Dec": [{"Federal onshore": 41, "Federal offshore": 50, "Native American":35}]},
										]}

										chartGroups={[
											{name: "2016", members:5},
											{name: "2017", members:7}]}

										defaultSelected={"Dec"}

										chartLegendHeader={["Source", "2017 (bbl)"]}

										chartLegendData={[{'Onshore':1257456, 'Offshore': 3454054, 'GOMESA':3256897}]}

										>
									</StackedBarChartLayout>
								</div>

								<div is="chart">
									<StackedBarChartLayout 

										chartTitle="Gas (mcf)"

										units="mcf"

										chartData={[
											{"Jan": [{"Federal onshore": 56, "Federal offshore": 100, "Native American":75}]},
											{"Feb": [{"Federal onshore": 20, "Federal offshore": 30, "Native American":15}]},
											{"Mar": [{"Federal onshore": 55, "Federal offshore": 50, "Native American":35}]},
											{"Apr": [{"Federal onshore": 55, "Federal offshore": 50, "Native American":35}]},
											{"May": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":96}]},
											{"Jun": [{"Federal onshore": 21, "Federal offshore": 33, "Native American":35}]},
											{"Jul": [{"Federal onshore": 30, "Federal offshore": 89, "Native American":44}]},
											{"Aug": [{"Federal onshore": 71, "Federal offshore": 50, "Native American":35}]},
											{"Sep": [{"Federal onshore": 30, "Federal offshore": 80, "Native American":52}]},
											{"Oct": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
											{"Nov": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":76}]},
											{"Dec": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
										]}

										defaultSelected={"Dec"}

										chartLegendHeader={["Source", "2017 (mcf)"]}

										chartLegendData={[{'Onshore':1257456, 'Offshore': 3454054, 'GOMESA':3256897}]}

										>
									</StackedBarChartLayout>
								</div>

								<div is="chart">
									<StackedBarChartLayout 

										chartTitle="Coal (tons)"

										units="tons"

										chartData={[
											{"Jan": [{"Federal onshore": 44, "Federal offshore": 100, "Native American":75}]},
											{"Feb": [{"Federal onshore": 55, "Federal offshore": 33, "Native American":15}]},
											{"Mar": [{"Federal onshore": 29, "Federal offshore": 50, "Native American":35}]},
											{"Apr": [{"Federal onshore": 28, "Federal offshore": 50, "Native American":35}]},
											{"May": [{"Federal onshore": 66, "Federal offshore": 50, "Native American":35}]},
											{"Jun": [{"Federal onshore": 30, "Federal offshore": 22, "Native American":44}]},
											{"Jul": [{"Federal onshore": 66, "Federal offshore": 50, "Native American":35}]},
											{"Aug": [{"Federal onshore": 55, "Federal offshore": 50, "Native American":12}]},
											{"Sep": [{"Federal onshore": 55, "Federal offshore": 50, "Native American":35}]},
											{"Oct": [{"Federal onshore": 33, "Federal offshore": 22, "Native American":35}]},
											{"Nov": [{"Federal onshore": 68, "Federal offshore": 50, "Native American":66}]},
											{"Dec": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
										]}



										defaultSelected={"Dec"}

										chartLegendHeader={["Source", "2017 (tons)"]}

										chartLegendData={[{'Onshore':1257456, 'Offshore': 3454054, 'GOMESA':3256897}]}

										>
									</StackedBarChartLayout>
								</div>
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
								<StackedBarChartLayout 

									chartTitle="Revenue"

									units="$"

									chartData={[
										{"Jan": [{"Federal onshore": 66, "Federal offshore": 100, "Native American":75}]},
										{"Feb": [{"Federal onshore": 66, "Federal offshore": 30, "Native American":15}]},
										{"Mar": [{"Federal onshore": 74, "Federal offshore": 50, "Native American":35}]},
										{"Apr": [{"Federal onshore": 66, "Federal offshore": 50, "Native American":54}]},
										{"May": [{"Federal onshore": 99, "Federal offshore": 33, "Native American":97}]},
										{"Jun": [{"Federal onshore": 66, "Federal offshore": 50, "Native American":35}]},
										{"Jul": [{"Federal onshore": 30, "Federal offshore": 13, "Native American":77}]},
										{"Aug": [{"Federal onshore": 55, "Federal offshore": 50, "Native American":35}]},
										{"Sep": [{"Federal onshore": 22, "Federal offshore": 63, "Native American":29}]},
										{"Oct": [{"Federal onshore": 69, "Federal offshore": 50, "Native American":35}]},
										{"Nov": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
										{"Dec": [{"Federal onshore": 15, "Federal offshore": 50, "Native American":12}]},
									]}

									chartGroups={[
										{name: "2016", members:3},
										{name: "2017", members:9}]}

									defaultSelected={"Dec"}

									chartLegendHeader={["Source", "2017"]}

									chartLegendData={[{'Onshore':1257456, 'Offshore': 3454054, 'GOMESA':3256897}]}

									>
								</StackedBarChartLayout>
							</div>

							<div className={styles.itemTitle+" "+styles.itemDisbursements} ><h3>Disbursements</h3></div>
							<div className={styles.itemDesc+" "+styles.itemDisbursements}>Distribution of federal revenue to local governments, the U.S. treasury, Native Americans, and designated funds.</div>
							<div className={styles.itemLink+" "+styles.itemDisbursements}><ExploreDataLink to="/explore/#production" >Explore all disbursements data</ExploreDataLink></div>
							<div className={styles.itemChart+" "+styles.itemDisbursements}>
								<StackedBarChartLayout 

									chartTitle="Disbursements"

									units="$"

									chartData={[
									{"Jan": [{"Federal onshore": 44, "Federal offshore": 100, "Native American":75}]},
									{"Feb": [{"Federal onshore": 55, "Federal offshore": 33, "Native American":15}]},
									{"Mar": [{"Federal onshore": 22, "Federal offshore": 50, "Native American":35}]},
									{"Apr": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
									{"May": [{"Federal onshore": 24, "Federal offshore": 50, "Native American":65}]},
									{"Jun": [{"Federal onshore": 55, "Federal offshore": 45, "Native American":35}]},
									{"Jul": [{"Federal onshore": 88, "Federal offshore": 50, "Native American":71}]},
									{"Aug": [{"Federal onshore": 30, "Federal offshore": 23, "Native American":35}]},
									{"Sep": [{"Federal onshore": 22, "Federal offshore": 50, "Native American":35}]},
									{"Oct": [{"Federal onshore": 30, "Federal offshore": 85, "Native American":35}]},
									{"Nov": [{"Federal onshore": 89, "Federal offshore": 50, "Native American":35}]},
									{"Dec": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
									]}

									defaultSelected={"Dec"}

									chartLegendHeader={["Source", "2017"]}

									chartLegendData={[{'Onshore':1257456, 'Offshore': 3454054, 'GOMESA':3256897}]}

									>
								</StackedBarChartLayout>
							</div>
						</section>

					</section>
				</div>
			</section>
		);
	}

}

export default connect(
  state => ({[CONSTANTS.PRODUCT_VOLUMES_OIL]: state.productionVolumes[CONSTANTS.PRODUCT_VOLUMES_OIL]}),
  dispatch => ({ productionVolumesByYear: (filter, key) => dispatch(productionVolumesByYearAction(filter, key)) })
)(KeyStatsSection);