import React from 'react';
import { connect } from 'react-redux';

import styles from "./KeyStatsSection.module.css";

import {ExploreDataLink} from '../../layouts/icon-links/ExploreDataLink';
import {Toggle} from '../../selectors/Toggle';
import {StackedBarChartLayout} from '../../layouts/charts/StackedBarChartLayout';

class KeyStatsSection extends React.Component{

	render(){
		return(
			<section id="data-summary" className={styles.keyStatsSection}>
				<h2>Data summary</h2>
				<p>Summary of production, revenue, and disbursements for resources extracted on federal lands and waters and Native American lands.</p>
			
				<section>
					<div>
						<h3>Production</h3>
						<div>Production data for major commodities.</div>
						<div><ExploreDataLink to="/explore/#production" >Explore all production data</ExploreDataLink></div>
					</div>

					<div>
						Show: <Toggle buttons={[{key:"year", name:"Yearly",default: true},
					  {key:"month",name:"Monthly"}]}></Toggle>
					</div>

					<div>
						<div>
							<StackedBarChartLayout 
								chartTitle="Oil (bbl)"
								chartLegendHeader={["Source", "2017 (bbl)"]}
								chartLegendData={[{'Onshore':1257456, 'Offshore': 3454054, 'GOMESA':3256897}]}></StackedBarChartLayout>
						</div>

						<div>
							<StackedBarChartLayout 
								chartTitle="Gas (scf)"
								chartLegendHeader={["Source", "2017 (mcf)"]}
								chartLegendData={[{'Onshore':1257456, 'Offshore': 3454054, 'GOMESA':3256897}]}></StackedBarChartLayout>
						</div>


						<div>
							<StackedBarChartLayout 
								chartTitle="Coal (tons)"
								chartLegendHeader={["Source", "2017 (tons)"]}
								chartLegendData={[{'Onshore':1257456, 'Offshore': 3454054, 'GOMESA':3256897}]}></StackedBarChartLayout>
						</div>
					</div>
				</section>
			
				<section>
					<div>
						<h3>Revenue</h3>
						<div>Federal revenue from bonuses, rent, and royalties paid by companies to extract natural.</div>
						<div><ExploreDataLink to="/explore/#production" >Explore all revenue data</ExploreDataLink></div>
					</div>

					<div>
						Show: <Toggle buttons={[{key:"year", name:"Yearly",default: true},
					  {key:"month",name:"Monthly"}]}></Toggle>
					</div>

					<div>
						<div>
							<StackedBarChartLayout 
								chartTitle="Revenue"
								chartLegendHeader={["Source", "2017"]}
								chartLegendData={[{'Onshore':1257456, 'Offshore': 3454054, 'GOMESA':3256897}]}></StackedBarChartLayout>
						</div>
					</div>
				</section>
			
				<section>
					<div>
						<h3>Disbursements</h3>
						<div>Distribution of federal revenue to local governments, the U.S. treasury, Native Americans, and designated funds.</div>
						<div><ExploreDataLink to="/explore/#production" >Explore all disbursements data</ExploreDataLink></div>
					</div>

					<div>
						Show: <Toggle buttons={[{key:"year", name:"Yearly",default: true},
					  {key:"month",name:"Monthly"}]}></Toggle>
					</div>

					<div>
						<div>
							<StackedBarChartLayout 
								chartTitle="Disbursements"
								chartLegendHeader={["Source", "2017"]}
								chartLegendData={[{'Onshore':1257456, 'Offshore': 3454054, 'GOMESA':3256897}]}></StackedBarChartLayout>
						</div>
					</div>
				</section>

			</section>
		);
	}

}

export default connect(
  state => ({})
)(KeyStatsSection);


