import React from 'react';
import Link from '../utils/temp-link';

import lazy from 'lazy.js';

import ALL_US_STATES_GDP from '../../data/state_gdp.yml'; 

import StickyHeader from 'components/layouts/StickyHeader';
import {StickyWrapper} from '../utils/StickyWrapper';
import YearSelector from 'components/selectors/YearSelector';
import DataAndDocs from 'components/layouts/DataAndDocs';
import GlossaryTerm from 'components/utils/glossary-term.js';
import RevenueTypeTable from 'components/locations/RevenueTypeTable';
import RevenueProcessTable from 'components/locations/RevenueProcessTable';
import StateRevenue from 'components/locations/opt_in/StateRevenue';

import utils from '../../js/utils';

let year = 2016;

const SectionGDP = (props) => {
    const usStateData = props.usStateMarkdown.frontmatter;
    const usStateFields = props.usStateMarkdown.fields || {};
	const usStateGDP = ALL_US_STATES_GDP[usStateData.unique_id];

	const metric = 'dollars';

    let usStateGDP_Dollars_ByYear = {};
    let usStateGDP_Percent_ByYear = {};

    (lazy(usStateGDP).toArray()).map((yearData, index) => {
        usStateGDP_Dollars_ByYear[yearData[0]] = yearData[1][metric]; 
        usStateGDP_Percent_ByYear[yearData[0]] = yearData[1]['percent']; 
    });

	return (
		<section id="gdp" is="year-switcher-section" class="economic gdp">
			<StickyWrapper bottomBoundary="#gdp" innerZ="10000">
				<StickyHeader headerText={'Gross domestic product (GDP)'}>
					<YearSelector years={[2016,2015,2014,2013,2012,2011,2010,2009,2008,2007]} classNames="flex-row-icon" />
				</StickyHeader>
			</StickyWrapper>

			<div className="chart-selector-wrapper">
			    <div className="chart-description">
			      <p>
			        Data about each state’s <GlossaryTerm termKey="Gross domestic product (GDP)">gross domestic product</GlossaryTerm> comes from the Bureau of Economic Analysis.
			      </p>
			      <p>
			        <Link to="/downloads/#gdp">
			          <DataAndDocs />
			        </Link>
			      </p>
			    </div>
			</div>

			{usStateGDP && usStateGDP[year] &&
				
				<div className="chart-list">
					<section className="chart-item">
						<h3 className="chart-title"><span>GDP ({metric})</span></h3>
						<figure className={"chart chart-"+metric}>
					        <eiti-bar-chart
					          aria-controls={"gdp-figures-"+metric}
					          data={JSON.stringify(usStateGDP_Dollars_ByYear)}
					          x-range="[2007, 2016]"
					          x-value={year}
					          data-units={metric}>
					        </eiti-bar-chart>
							<figcaption id={"gdp-figures-"+metric}>
								<span className="caption-data">
									In <span className="eiti-bar-chart-x-value">{ year }</span>, extractive industries accounted for <span className="eiti-bar-chart-y-value" data-format="$,">{utils.formatToDollarInt(usStateGDP[year][metric])} </span> or <year-value year={year } data-year-values={JSON.stringify(usStateGDP_Percent_ByYear)} empty="--">{utils.round(usStateGDP[year]['percent'], 2)}</year-value>% of { usStateData.title }’s GDP.
								</span>
								<span className="caption-no-data" aria-hidden="true">
									There is no data about GDP from extractive industries in { usStateData.title } in <span className="eiti-bar-chart-x-value">{ year }</span>.
								</span>
							</figcaption>
						</figure>
					</section>
				</div>
			}
		</section>
	);
};

export default SectionGDP;