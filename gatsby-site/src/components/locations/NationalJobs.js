import React from 'react';

import Link from 'components/utils/temp-link';

import lazy from 'lazy.js';

import utils from 'js/utils';

import StickyHeader from 'components/layouts/StickyHeader';
import YearSelector from 'components/selectors/YearSelector';
import DataAndDocs from 'components/layouts/DataAndDocs';
import GlossaryTerm from 'components/utils/glossary-term.js';
import ChartTitle from 'components/charts/ChartTitle';

import NATIONAL_JOBS from '../../../static/data/national_jobs.yml';
import NATIONAL_JOBS_BY_COMMODITY from '../../../static/data/national_jobs_by_commodity.yml';
import NATIONAL_SELF_EMPLOYMENT from '../../../static/data/national_self_employment.yml';
import COMMODITIES from '../../../static/data/commodities.yml';

const YEARS = [2016,2015,2014,2013,2012,2011,2010,2009,2008,2007];
const YEAR_RANGE = "[2007, 2016]";
const YEAR = 2016;

const NationalJobs = (props) => {
	const METRIC = "count";
	const NATIONAL_JOBS_BY_YEAR = NATIONAL_JOBS['US'];
	const NATIONAL_JOBS_BY_YEAR_COUNT = {};
	lazy(NATIONAL_JOBS_BY_YEAR).toArray().map((yearData, index) => {
			NATIONAL_JOBS_BY_YEAR_COUNT[yearData[0]] = yearData[1].count;
		});

	const COMMODITIES_JOBS_WHITELISTED = COMMODITIES.jobs.show;
	const COMMODITIES_JOBS_ALIAS = COMMODITIES.jobs.alias;

	const NATIONAL_JOBS_BY_COMMODITY_WHITELISTED = {};

	// Filter National Commodity Jobs by the whitelisted commodity jobs
	COMMODITIES_JOBS_WHITELISTED.map((commodityJobName, index) => {
			NATIONAL_JOBS_BY_COMMODITY_WHITELISTED[commodityJobName] = lazy(NATIONAL_JOBS_BY_COMMODITY).get(commodityJobName);
		}
	);

	const SELF_EMPLOYMENT_BY_YEAR = NATIONAL_SELF_EMPLOYMENT['US'];

	const SELF_EMPLOYMENT_BY_YEAR_COUNT = {};
	lazy(SELF_EMPLOYMENT_BY_YEAR).toArray().map((yearData, index) => {
		SELF_EMPLOYMENT_BY_YEAR_COUNT[yearData[0]] = yearData[1].count;
	});

	return (
		<section id="employment" className="economic employment">
			<section is="year-switcher-section">
	            <StickyHeader headerText='Wage and salary jobs'>
	                <YearSelector years={YEARS} classNames="flex-row-icon" />
	            </StickyHeader>

	            <section className="chart-list">
					<div className="chart-selector-wrapper">
						<div className="chart-description">
							<p>
								Wage and salary data, from the Bureau of Labor Statistics, describes the number of people employed in natural resource extraction that receive wages or salaries from companies.
							</p>
							<p>
								<Link to="/downloads/#jobs">
								  <DataAndDocs />
								</Link>
							</p>
						</div>
					</div>
					<section className="chart-item">
						<h3 className="chart-title"><span>Extractive industry jobs</span></h3>

						<figure className="chart">
							<eiti-bar-chart
								aria-controls={"jobs-figures-"+METRIC}
								data={ JSON.stringify(NATIONAL_JOBS_BY_YEAR_COUNT) }
								x-range={ YEAR_RANGE }
								x-value={ YEAR }
								data-units="jobs">
							</eiti-bar-chart>
							<figcaption id={"jobs-figures-"+METRIC}>
								<span className="caption-data">
									In <span className="eiti-bar-chart-x-value">{ YEAR }</span>,
									there were <span className="eiti-bar-chart-y-value" data-format=",">
									{ utils.formatToCommaInt( (NATIONAL_JOBS_BY_YEAR_COUNT[YEAR] || 0) )}
								</span> jobs in the extractive industries, and they accounted for {(NATIONAL_JOBS_BY_YEAR[YEAR] ? NATIONAL_JOBS_BY_YEAR[YEAR].percent : 0)}%
								of nationwide jobs.
								</span>
								<span className="caption-no-data" aria-hidden="true">
									There is no data about jobs in the extractive industries in <span className="eiti-bar-chart-x-value">{ YEAR }</span>
								</span>
							</figcaption>

						</figure>
					</section>
	            </section>


	            {NATIONAL_JOBS_BY_COMMODITY &&

	            	<div>
						<h4>Wage and salary jobs by commodity</h4>

						<p>Jobs are categorized according to the North American Industry Classification System (NAICS). To learn more about how we grouped those categories, see <Link to="/downloads/#jobs">data and documentation</Link>.</p>
						<p>Geothermal, hydroelectric, solar, and wind energy categories are limited to jobs directly related to electrical energy generation. To learn more about all energy-related employment, see the <a href="https://www.energy.gov/downloads/2017-us-energy-and-employment-report">2017 U.S. Energy and Employment Report</a> from the Department of Energy.</p>

	            		<section className="chart-list">

	            			{lazy(NATIONAL_JOBS_BY_COMMODITY_WHITELISTED).toArray().map((commodity, index) => {
	            					

	            					let commodityName =  commodity[0];
	            					let commodityNameAlias = ( COMMODITIES_JOBS_ALIAS[commodityName] || commodityName ).toLowerCase();
	            					let commoditySlug = utils.formatToSlug(commodityName);
	            					let commodityYearData = commodity[1][YEAR];
	            					let commodityByYears_Count = {};
									lazy(commodity[1]).toArray().map((commodityYearData, index) => {
											commodityByYears_Count[commodityYearData[0]] = commodityYearData[1].count;
										});
									let chartToggle = 'jobs-figures-chart-'+commoditySlug; 

									return (
											<div key={index} className="chart-item">
			                                    <ChartTitle 
			                                        isIcon={true}
			                                        units="jobs"
			                                        chartValues={commodityByYears_Count}
			                                        chartToggle={chartToggle} >{commodityNameAlias}</ChartTitle>

												<figure className="chart" id="{{ chart_toggle }}">
													<eiti-bar-chart
														aria-controls={"jobs-figures-"+commoditySlug}
														data={ JSON.stringify(commodityByYears_Count)}
														x-range={YEAR_RANGE}
														x-value={YEAR}
														data-units="jobs">
													</eiti-bar-chart>
													<figcaption id={"jobs-figures-"+commoditySlug}>
														<span className="caption-data">
															In <span className="eiti-bar-chart-x-value">{ YEAR }</span>,
															there were <span className="eiti-bar-chart-y-value"
															data-format=",">{ utils.formatToCommaInt( (commodityYearData.count || 0) ) }</span> <b>{ commodityNameAlias }</b> jobs in the U.S.
														</span>
														<span className="caption-no-data" aria-hidden="true">
															There is no data about <b>{commodityNameAlias}</b> jobs in <span className="eiti-bar-chart-x-value">{YEAR}</span>.
														</span>
													</figcaption>
												</figure>
											</div>
										);

	            				})
	            			}
	            		</section>
	            	</div>
	            }
			</section>

			<section is="year-switcher-section">
	            <StickyHeader headerId='self-employment' headerText='Self-employment'>
	                <YearSelector years={YEARS} classNames="flex-row-icon" />
	            </StickyHeader>

   				<section className="chart-list">
					<div className="chart-selector-wrapper">
						<div className="chart-description">
							<p>
								Self-employment data, from the Bureau of Economic Analysis, describes people who work in natural resource extraction, but don't receive wages or salaries because they own their own companies.
							</p>
							<p>
								<Link to="/downloads/#jobs">
									<DataAndDocs />
								</Link>
							</p>
						</div>
					</div>

					<section className="chart-item">

						<h3 className="chart-title"><span>Self-employment</span></h3>

						<figure className="chart">
							<eiti-bar-chart
								aria-controls="self-employment-figures-count"
								data={JSON.stringify(SELF_EMPLOYMENT_BY_YEAR_COUNT)}
								x-range={YEAR_RANGE}
								x-value={YEAR}
								data-units="jobs">
							</eiti-bar-chart>
							<figcaption id="self-employment-figures-count">
								In <span className="eiti-bar-chart-x-value">{YEAR}</span>, there were <span className="eiti-bar-chart-y-value" data-format=",">
								{ utils.formatToCommaInt( (SELF_EMPLOYMENT_BY_YEAR_COUNT[YEAR] || 0) ) }
								</span> self-employed people working in the extractive industries.
							</figcaption>
						</figure>

					</section>
				</section>
			</section>
		</section>
	);
};

export default NationalJobs;