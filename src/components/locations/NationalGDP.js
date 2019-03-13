import React from 'react';

import Link from 'components/utils/temp-link';

import lazy from 'lazy.js';

import utils from 'js/utils';

import StickyHeader from 'components/layouts/StickyHeader';
import YearSelector from 'components/selectors/YearSelector';
import DataAndDocs from 'components/layouts/DataAndDocs';
import GlossaryTerm from 'components/utils/glossary-term.js';

import NATIONAL_GDP from '../../../static/data/national_gdp.yml';

const YEARS = [2016,2015,2014,2013,2012,2011,2010,2009,2008,2007];
const YEAR_RANGE = "[2007, 2016]";
const YEAR = 2016;

const NationalGDP = (props) => {
	const METRIC = "Dollars";
	const FORMAT = "$,";
	let nationalGDPByYears = NATIONAL_GDP['US'];

	let nationalGDPByYears_Dollars = {};
	lazy(nationalGDPByYears).toArray().map((gdpYearData, index) => {
			nationalGDPByYears_Dollars[gdpYearData[0]] = gdpYearData[1].dollars;
		});

	let nationalGDPByYears_Percent = {};
	lazy(nationalGDPByYears).toArray().map((gdpYearData, index) => {
			nationalGDPByYears_Percent[gdpYearData[0]] = gdpYearData[1].percent;
		});

	return (
		<section id="gdp" is="year-switcher-section" class="economic gdp">

            <StickyHeader headerText='Gross domestic product (GDP)'>
                <YearSelector years={YEARS} classNames="flex-row-icon" />
            </StickyHeader>

			<div className="chart-selector-wrapper">

				<div className="chart-description">
					<p>
						Data about <GlossaryTerm termKey="Gross domestic product (GDP)">gross domestic product</GlossaryTerm> comes from the Bureau of Economic Analysis.
					</p>
					<p>
						<Link to="/downloads/#gdp">
							<DataAndDocs />
						</Link>
					</p>
				</div>
			</div>

			<div className="chart-list">
				<section className="chart-item">
					<h3 className="chart-title"><span>GDP ({METRIC})</span></h3>

					<figure className={"chart chart-"+METRIC}>
						<eiti-bar-chart 
							aria-controls={"gdp-figures-"+METRIC}
							data={ JSON.stringify(nationalGDPByYears_Dollars) }
							x-range={ YEAR_RANGE }
							x-value={ YEAR }
							data-units={ FORMAT }>
						</eiti-bar-chart>

					</figure>
					<figcaption id={"gdp-figures-"+METRIC}>
						<span className="caption-data">
							In <span className="eiti-bar-chart-x-value">{ YEAR }</span>,
							extractive industries accounted for
							<span className="eiti-bar-chart-y-value" data-format={ FORMAT }>{ utils.formatToDollarInt(nationalGDPByYears_Dollars[YEAR]) }</span> or
							<year-value year={ YEAR } data-year-values={JSON.stringify(nationalGDPByYears_Percent)}
							empty="--">{nationalGDPByYears_Percent[YEAR]}</year-value>%
							of GDP.
						</span>
						<span className="caption-no-data" aria-hidden="true">
							There is no national GDP data for
							<span className="eiti-bar-chart-x-value">{ YEAR }</span>.
						</span>
					</figcaption>

				</section>

			</div>

		 </section>
	);
};

export default NationalGDP;