import React from 'react';
import Link from 'components/utils/temp-link';


import Utils from 'js/utils';
import lazy from 'lazy.js';

import StickyHeader from 'components/layouts/StickyHeader';
import YearSelector from 'components/selectors/YearSelector';
import DataAndDocs from 'components/layouts/DataAndDocs';
import GlossaryTerm from 'components/utils/glossary-term.js';
import {filterTerms} from 'components/utils/Glossary';
import RevenueTypeTable from 'components/locations/RevenueTypeTable';
import RevenueProcessTable from 'components/locations/RevenueProcessTable';

import ChartTitle from 'components/charts/ChartTitle';

import iconCirclePlus from "img/icons/icon-circled-plus.svg";
import iconCircleMinus from "img/icons/icon-circled-minus.svg";

import COMMODITY_NAMES from 'data/commodity_names.yml';
import NATIONAL_REVENUES from '../../../static/data/national_revenues.yml';

import GLOSSARY_TERMS from 'data/terms.yml';

// @todo: pass in years from data
const years = [2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007];
const year = "2017";
const YEAR_RANGE = "[2007, 2017]";


// @todo: use graphql to import data
import FEDERAL_PRODUCTION_DATA from '../../../static/data/national_federal_production.yml';

import PRODUCTION_UNITS from '../../../static/data/production_units.yml';

const NationalRevenue = (props) => {

    const REVENUE_COMMODITIES = NATIONAL_REVENUES[props.stateId].commodities;

    return (
        <section id="revenue" is="year-switcher-section" className="federal revenue">

            <h2>Revenue</h2>

            <p>
                Companies pay a wide range of fees, rates, and taxes to extract natural resources in the United States. 
                The types and amounts of payments differ, depending on <Link to="/how-it-works/ownership/">who owns the natural resources</Link>.
            </p>

            <p>
                Natural resource extraction can lead to federal revenue in two ways: non-tax revenue and tax revenue. 
                Revenue data on this site primarily includes non-tax revenue from extractive industry activities on federal land.
            </p>

            <section>
                <StickyHeader headerId="federal-revenue" headerText='Revenue from extraction on federal land' />

                <p>When companies extract natural resources on federal lands and waters, they pay royalties, rents, bonuses, and other fees, much like they would to any landowner. This non-tax revenue is collected and reported by the Office of Natural Resources Revenue (ONRR).</p>

                <p>For details about the laws and policies that govern how rights are awarded to companies and what they pay to extract natural resources on federal land: <Link to="/how-it-works/coal/">coal</Link>, <Link to="/how-it-works/onshore-oil-gas/">oil and gas</Link>, <Link to="/how-it-works/onshore-renewables/">renewable resources</Link>, and <Link to="/how-it-works/minerals/">hardrock minerals</Link>.</p>

                <p>The federal government collects different kinds of fees at each phase of natural resource extraction. This chart shows how much federal revenue ONRR collected in <GlossaryTerm>calendar year (CY)</GlossaryTerm> { year } for production or potential production of natural resources on federal land, broken down by phase of production.
                </p>
                <p>
                    <Link className="data-downloads" to="/downloads/federal-revenue-by-location/" >
                        <DataAndDocs />
                    </Link>
                </p>

                <div id="fee-summaries" className="tab-interface">
                    <ul className="eiti-tabs info-tabs" role="tablist">
                        <li role="presentation">
                            <a href="#revenues" tabIndex="0" role="tab" aria-controls="revenues" aria-selected="true">Federal revenue by phase (CY {year})</a>
                        </li>
                        <li role="presentation">
                            <a href="#story" tabIndex="-1" role="tab" aria-controls="story" className="link-charlie">Revenue details by phase</a>
                        </li>
                    </ul>

                  <article className="eiti-tab-panel" id="revenues" role="tabpanel">
                    <RevenueTypeTable
                        id='revenue-types'
                        locationId={props.stateId}
                        locationName={props.stateName}
                        year={year}
                        isNationalPage = {props.isNationalPage}
                    />
                  </article>

                  <article className="eiti-tab-panel" id="story" role="tabpanel">
                    <RevenueProcessTable
                        id='revenue-process'
                        locationId={props.stateId}
                        locationName={props.stateName}
                        year={year}
                        isNationalPage = {props.isNationalPage}
                    />
                  </article>

                </div>

                <StickyHeader headerId="revenue-trends" headerSize="h4" headerText='Federal revenue trends by resource'>
                    <YearSelector years={years} classNames="flex-row-icon" />
                </StickyHeader>

                <div className="chart-selector-wrapper">
                    <div className="chart-description">
                        <p>
                        Non-tax revenue collected by <GlossaryTerm>ONRR</GlossaryTerm> often depends on what resources are available on federal land, as well as the laws and regulations about extraction of each resource.
                        </p>
                        <p>
                            <Link to="/downloads/federal-revenue-by-location/" className="data-downloads">
                                <DataAndDocs />
                            </Link>
                        </p>
                    </div>
                </div>

                <section className="chart-list">

                    {lazy(REVENUE_COMMODITIES).toArray().map((commodity, index) => {
                            let annualRevenue = commodity[1];
                            let revenue = annualRevenue[year] || 0;
                            let commodityName = COMMODITY_NAMES[commodity[0]] || commodity[0];
                            let commoditySlug = Utils.formatToSlug(commodity[0]);
                            let chartToggle = "revenue-figures-chart-"+commoditySlug;

                            return (
                                <section key={index} id={"revenue-"+commoditySlug} className="chart-item">
                                    <ChartTitle 
                                        isIcon={true}
                                        units="$,"
                                        chartValues={annualRevenue}
                                        chartToggle={chartToggle} >{commodityName}</ChartTitle>

                                    <figure className="chart" id={ chartToggle }>
                                        <eiti-bar-chart
                                            data={JSON.stringify(annualRevenue)}
                                            aria-controls={"revenue-figures-"+commoditySlug}
                                            x-range={YEAR_RANGE}
                                            x-value={year}
                                            data-units="$,">
                                        </eiti-bar-chart>
                                    </figure>
                                    <figcaption id={"revenue-figures-"+commoditySlug}>
                                        <span className="caption-data">
                                            { commodityName === 'Non-commodity revenue' ?
                                                <div>
                                                    Companies paid <span className="eiti-bar-chart-y-value" data-format="$,">
                                                        {Utils.formatToDollarInt(revenue)}
                                                    </span> in inspection fees, civil penalties, and other revenues in
                                                    <span className="eiti-bar-chart-x-value">{ year }</span>.
                                                </div>
                                                    :
                                                <div>        
                                                    Companies paid <span className="eiti-bar-chart-y-value" data-format="$,">
                                                        {Utils.formatToDollarInt(revenue)}
                                                    </span> to produce {commodityName.toLowerCase()} on federal land in <span className="eiti-bar-chart-x-value">{year}</span>.
                                                </div>
                                            }
                                        </span>
                                        <span className="caption-no-data" aria-hidden="true">
                                            There is no data about revenue from production of {commodityName.toLowerCase()} on federal land in <span className="eiti-bar-chart-x-value">{year }</span>.
                                        </span>
                                        <span className="caption-negative-data" aria-hidden="true">
                                            Production of {commodityName.toLowerCase()} yielded <span className="eiti-bar-chart-y-value" data-format="$,">
                                                { Utils.formatToDollarInt(revenue)}
                                            </span> in <span className="eiti-bar-chart-x-value">{ year }</span> revenue, probably due to  previous overpayment.
                                        </span>
                                    </figcaption>

                                </section>

                            );

                        })
                    }

                </section>

            </section>

            <section>
                <StickyHeader headerId="federal-tax-revenue" headerText='Federal tax revenue' />
                <div>
                    <p>Individuals and corporations (specifically C-corporations) pay income taxes to the IRS. The federal corporate income tax rate tops out at 21%. Public policy provisions, such as tax expenditures, can decrease corporate income tax and other revenue payments in order to promote other policy goals.</p>
                    <p>Learn more about <Link to="/how-it-works/revenues/#all-lands-and-waters">revenue from extraction on all lands and waters</Link>.</p>
                </div>
            </section>

        </section> 
    );

}

export default NationalRevenue;
