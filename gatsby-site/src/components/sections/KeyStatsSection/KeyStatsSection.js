import React from 'react';
import { connect } from 'react-redux';

import styles from "./KeyStatsSection.module.css";

import {ExploreDataLink} from '../../layouts/icon-links/ExploreDataLink';
import {Toggle} from '../../selectors/Toggle';
import {StackedBarChartLayout} from '../../layouts/charts/StackedBarChartLayout';

class KeyStatsSection extends React.Component{

	render(){
		return(
			<section id="data-summary" className={styles.root}>
				<h2>Data summary</h2>
				<p>Summary of production, revenue, and disbursements for resources extracted on federal lands and waters and Native American lands.</p>
			
				<section id="key-stats-production"  className={styles.production}>
					<div className={styles.sectionTitle}>
						<h3>Production</h3>
						<div>Production data for major commodities.</div>
						<div><ExploreDataLink to="/explore/#production" >Explore all production data</ExploreDataLink></div>
					</div>

					<div className={styles.toggle}>
						Show:
						<Toggle buttons={[{key:"year", name:"Yearly",default: true},
					  {key:"month",name:"Monthly"}]}></Toggle>
					</div>

					<div is="chart-container">
						<div is="chart">
							<StackedBarChartLayout 

								chartTitle="Oil (bbl)"

								chartData={[
									{"Jan": [{"Federal onshore": 50, "Federal offshore": 90, "Native American":75}]},
									{"Feb": [{"Federal onshore": 10, "Federal offshore": 30, "Native American":15}]},
									{"Mar": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
									{"Apr": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
									{"May": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
									{"Jun": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
									{"Jul": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
									{"Aug": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
									{"Sep": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
									{"Oct": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
									{"Nov": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
									{"Dec": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
								]}

								defaultSelected={"Dec"}

								chartLegendHeader={["Source", "2017 (bbl)"]}

								chartLegendData={[{'Onshore':1257456, 'Offshore': 3454054, 'GOMESA':3256897}]}

								>
							</StackedBarChartLayout>
						</div>

						<div is="chart">
							<StackedBarChartLayout 

								chartTitle="Gas (mcf)"

								chartData={[
									{"Jan": [{"Federal onshore": 50, "Federal offshore": 100, "Native American":75}]},
									{"Feb": [{"Federal onshore": 10, "Federal offshore": 30, "Native American":15}]},
									{"Mar": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
									{"Apr": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
									{"May": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
									{"Jun": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
									{"Jul": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
									{"Aug": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
									{"Sep": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
									{"Oct": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
									{"Nov": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
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

								chartData={[
									{"Jan": [{"Federal onshore": 50, "Federal offshore": 100, "Native American":75}]},
									{"Feb": [{"Federal onshore": 10, "Federal offshore": 30, "Native American":15}]},
									{"Mar": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
									{"Apr": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
									{"May": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
									{"Jun": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
									{"Jul": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
									{"Aug": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
									{"Sep": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
									{"Oct": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
									{"Nov": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
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

				<div className={styles.bottomSection}>
			
					<section id=" key-stats-revenue"  className={styles.revenue}>
						<div className={styles.sectionTitle}>
							<h3>Revenue</h3>
							<div>Federal revenue from bonuses, rent, and royalties paid by companies to extract natural.</div>
							<div><ExploreDataLink to="/explore/#production" >Explore all revenue data</ExploreDataLink></div>
						</div>

						<div className={styles.toggle}>
							Show:
							<Toggle buttons={[{key:"year", name:"Yearly",default: true},
						  {key:"month",name:"Monthly"}]}></Toggle>
						</div>

						<div>
							<div is="chart">
								<StackedBarChartLayout 

									chartTitle="Revenue"

									chartData={[
										{"Jan": [{"Federal onshore": 60, "Federal offshore": 100, "Native American":75}]},
										{"Feb": [{"Federal onshore": 10, "Federal offshore": 30, "Native American":15}]},
										{"Mar": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
										{"Apr": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
										{"May": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
										{"Jun": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
										{"Jul": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
										{"Aug": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
										{"Sep": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
										{"Oct": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
										{"Nov": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
										{"Dec": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
									]}

									defaultSelected={"Dec"}

									chartLegendHeader={["Source", "2017"]}

									chartLegendData={[{'Onshore':1257456, 'Offshore': 3454054, 'GOMESA':3256897}]}

									>
								</StackedBarChartLayout>
							</div>
						</div>
					</section>
					<section id="key-stats-disbursements"  className={styles.disbursements}>
						<div className={styles.sectionTitle}>
							<h3>Disbursements</h3>
							<div>Distribution of federal revenue to local governments, the U.S. treasury, Native Americans, and designated funds.</div>
							<div><ExploreDataLink to="/explore/#production" >Explore all disbursements data</ExploreDataLink></div>
						</div>

						<div>
							<div is="chart">
								<StackedBarChartLayout 

									chartTitle="Disbursements"

									chartData={[
										{"Jan": [{"Federal onshore": 65, "Federal offshore": 100, "Native American":75}]},
										{"Feb": [{"Federal onshore": 10, "Federal offshore": 30, "Native American":15}]},
										{"Mar": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
										{"Apr": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
										{"May": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
										{"Jun": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
										{"Jul": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
										{"Aug": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
										{"Sep": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
										{"Oct": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
										{"Nov": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
										{"Dec": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
									]}

									defaultSelected={"Dec"}

									chartLegendHeader={["Source", "2017"]}

									chartLegendData={[{'Onshore':1257456, 'Offshore': 3454054, 'GOMESA':3256897}]}

									>
								</StackedBarChartLayout>
							</div>
						</div>
					</section>
				</div>
			</section>
		);
	}

}

export default connect(
  state => ({})
)(KeyStatsSection);


