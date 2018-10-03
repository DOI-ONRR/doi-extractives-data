import React from 'react';
import Link from '../utils/temp-link';

import lazy from 'lazy.js';

import ALL_US_STATES_EXPORTS from '../../data/state_exports.yml'; 

import ChartTitle from 'components/charts/ChartTitle';
import StickyHeader from 'components/layouts/StickyHeader';
import YearSelector from 'components/selectors/YearSelector';
import DataAndDocs from 'components/layouts/DataAndDocs';
import GlossaryTerm from 'components/utils/glossary-term.js';
import RevenueTypeTable from 'components/locations/RevenueTypeTable';
import RevenueProcessTable from 'components/locations/RevenueProcessTable';
import StateRevenue from 'components/locations/opt_in/StateRevenue';

import utils from '../../js/utils';

let year = 2015;
let yearRange = [2015,2014,2013,2012,2011,2010,2009,2008,2007,2006];

const SectionExports = (props) => {
    const usStateData = props.usStateMarkdown.frontmatter;
    const usStateFields = props.usStateMarkdown.fields || {};

	const usStateExports = (ALL_US_STATES_EXPORTS[usStateData.unique_id]) ? ALL_US_STATES_EXPORTS[usStateData.unique_id].commodities : undefined;

	return(
		<section id="exports" is="year-switcher-section" class="economic exports">
			<StickyHeader headerText={'Exports'}>
				<YearSelector years={yearRange} classNames="flex-row-icon" />
			</StickyHeader>

			<div className="chart-list">

				<div className="chart-selector-wrapper">

					<div className="chart-description">
						<p>
							The U.S. Census Bureau collects information about the top 25 exports in each state.
						</p>
						<p>
					        <Link to="/downloads/#jobs">
					          <DataAndDocs />
					        </Link>
						</p>
					</div>
				</div>

				{(lazy(usStateExports).toArray()).map((commodity, index) => {
					
						let commodityName = commodity[0];
						let commodityValues = commodity[1];
						let commoditySlug = utils.formatToSlug(commodityName);
						let chartToggle = 'exports-figures-chart-'+commoditySlug;

						if(commodityName !== 'Total' && commodityName !== 'Extractives'){
							return (
								<section key={index} className="chart-item">
		                            <ChartTitle 
		                                isIcon={true}                                   
		                                units='$,'
		                                chartValues={commodityValues}
		                                chartToggle={chartToggle} >{commodityName}</ChartTitle>

									<figure className="chart" id={chartToggle}>
										<eiti-bar-chart
											aria-controls={"exports-figures-"+commoditySlug}
											data={JSON.stringify(commodityValues)}
											x-range="[2006,2015]"
											x-value={ year }
											data-units="$,">
										</eiti-bar-chart>
										<figcaption id={"exports-figures-"+commoditySlug}>
											<span className="caption-data">
												<span className="eiti-bar-chart-y-value" data-format="$,">{utils.formatToDollarInt(commodityValues[year])}</span>worth of {commodityName.toLowerCase()} was exported from {usStateData.title} in <span className="eiti-bar-chart-x-value">{ year }</span>.
											</span>
											<span className="caption-no-data" aria-hidden="true">
												There is no data for {commodityName.toLowerCase()} exports from {usStateData.title} in <span className="eiti-bar-chart-x-value">{ year }</span>.
											</span>
										</figcaption>
									</figure>
								</section>

							);
						}
					}
				)}
			</div>
		</section>
	);
};

export default SectionExports