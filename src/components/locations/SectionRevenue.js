import React from 'react'
import Link from '../utils/temp-link'

import ALL_US_STATES_REVENUES from '../../data/state_revenues.yml'

import StickyHeader from '../layouts/StickyHeader'
import { StickyWrapper } from '../utils/StickyWrapper'
import YearSelector from '../selectors/YearSelector'
import DataAndDocs from '../layouts/DataAndDocs'
import GlossaryTerm from '../utils/glossary-term.js'
import RevenueTypeTable from '../locations/RevenueTypeTable'
import RevenueProcessTable from '../locations/RevenueProcessTable'
import StateRevenue from '../locations/opt_in/StateRevenue'

let year = 2017

const SectionRevenue = props => {
  const usStateData = props.usStateMarkdown.frontmatter
  const usStateFields = props.usStateMarkdown.fields || {}

  const usStateRevenueCommodities = ALL_US_STATES_REVENUES[usStateData.unique_id] && ALL_US_STATES_REVENUES[usStateData.unique_id].commodities

  return (
    <section id="revenue" is="year-switcher-section" className="federal revenue">

      <h2>Revenue</h2>

      <p>Companies pay a wide range of fees, rates, and taxes to extract natural resources in the United States. What companies pay to federal, state, and local governments often depends on <Link to="/how-it-works/ownership/">who owns the natural resources</Link>.</p>

      <section id="federal-revenue">

        <StickyWrapper bottomBoundary="#fee-summaries" innerZ="10000">
          <StickyHeader headerText={'Federal revenue'} />
        </StickyWrapper>

        <p>
					Natural resource extraction can lead to federal revenue in two ways: non-tax revenue and tax revenue. Revenue data on this site primarily includes non-tax revenue from extractive industry activities on federal land.
        </p>
        <p>
          <Link to="/downloads/federal-revenue-by-location">
            <DataAndDocs />
          </Link>
        </p>

        <h4>Revenue from production on federal land by resource</h4>

        {usStateRevenueCommodities
          ? <div>
            <p>When companies extract natural resources on federal lands and waters, they pay royalties, rents, bonuses, and other fees, much like they would to any landowner. This non-tax revenue is collected and reported by the Office of Natural Resources Revenue (ONRR).</p>

            <p>For details about the laws and policies that govern how rights are awarded to companies and what they pay to extract natural resources on federal land: <Link to="/how-it-works/coal/">coal</Link>, <Link to="/how-it-works/onshore-oil-gas/">oil and gas</Link>, <Link to="/how-it-works/onshore-renewables/">renewable resources</Link>, and <Link to="/how-it-works/minerals/">hardrock minerals</Link>.</p>

            <p>The federal government collects different kinds of fees at each phase of natural resource extraction. This chart shows how much federal revenue was collected in <GlossaryTerm>Calendar year (CY)</GlossaryTerm> { year } for production or potential production of natural resources on federal land in { usStateData.title }, broken down by phase of production.</p>

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
		                        locationId={usStateData.unique_id}
		                        locationName={usStateData.title}
		                        year={year}
		                    />
		                  </article>

		                  <article className="eiti-tab-panel" id="story" role="tabpanel">
		                    <RevenueProcessTable
		                        id='revenue-process'
		                        locationId={usStateData.unique_id}
		                        locationName={usStateData.title}
		                        year={year}
		                    />
		                  </article>

		                </div>

		              <StickyWrapper bottomBoundary="#federal-revenue-county-table" innerZ="10000">
				            <StickyHeader headerSize="h4" headerText={'Revenue from production on federal land by county'}>
				                <YearSelector years={[2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008]} classNames="flex-row-icon" />
				            </StickyHeader>
				           </StickyWrapper>

            <section className="chart-list">

              <div className="chart-selector-wrapper">

                <div className="chart-description">
                  <p>
										Most non-tax revenue collected by ONRR comes from counties with significant natural resources on federal land.
                  </p>
                  <p>
                    <Link to="/downloads/federal-revenue-by-location">
                      <DataAndDocs />
                    </Link>
                  </p>
                </div>
              </div>

              <section id="federal-revenue-county-table" className="county-map-table">

              </section>
            </section>
          </div>
          :						<div className="chart-description">
							No natural resources were produced on federal land in {usStateData.title} in { year }, so ONRR did not collect any non-tax revenues.
          </div>
        }

      </section>

      <section id="state-revenue" className="state revenue">
        <StickyWrapper bottomBoundary="#state-revenue" innerZ="10000">
          <StickyHeader headerText={'State revenue'} />
        </StickyWrapper>

        {usStateData.opt_in

          ? <StateRevenue usStateData={usStateData} usStateFields={usStateFields} />
          :					<p>We don’t have detailed data about federal, state, or local revenue from natural resource extraction on land owned by {usStateData.title}, corporations, or individuals. However, companies generally must pay state and local taxes.</p>
        }

      </section>

    </section>
  )
}

export default SectionRevenue
