import React from 'react'
import Link from '../utils/temp-link'

import utils from '../../js/utils'
import lazy from 'lazy.js'

import StickyHeader from '../layouts/StickyHeader'
import YearSelector from '../selectors/YearSelector'
import DataAndDocs from '../layouts/DataAndDocs'
import GlossaryTerm from '../utils/glossary-term.js'
import { filterTerms } from '../utils/Glossary'
import RevenueTypeTable from '../locations/RevenueTypeTable'
import RevenueProcessTable from '../locations/RevenueProcessTable'
import { ExploreDataLink } from '../layouts/icon-links/ExploreDataLink'

import ChartTitle from '../charts/ChartTitleCollapsible'

import iconCirclePlus from '../../img/icons/icon-circled-plus.svg'
import iconCircleMinus from '../../img/icons/icon-circled-minus.svg'

import NATIONAL_REVENUES from '../../../static/data/national_revenues.yml'

// @todo: use graphql to import data
import FEDERAL_PRODUCTION_DATA from '../../../static/data/national_federal_production.yml'

import PRODUCTION_UNITS from '../../../static/data/production_units.yml'


const createRevenueCommoditiesData = (groupByCommodity, groupByYear) => {
  let data = groupByCommodity
  let commodityYears = groupByYear.sort(utils.compareValues('id'))
  if (commodityYears.length > 10) {
    commodityYears = commodityYears.slice(commodityYears.length - 10)
  }
  commodityYears = commodityYears.map(item => parseInt(item.id))

  let commodities = data.reduce((total, item) => {
    item.edges.forEach(element => {
      let node = element.node
      if (commodityYears.includes(node.CalendarYear)) {
        total[item.id] = total[item.id] || {}
        total[item.id][node.CalendarYear] = (total[item.id][node.CalendarYear])
          ? total[item.id][node.CalendarYear] + node.Revenue
          : node.Revenue

        total[item.id][node.CalendarYear] = total[item.id][node.CalendarYear]
        if (!total['All'][node.CalendarYear]) {
          total['All'][node.CalendarYear] = 0
        }
        total['All'][node.CalendarYear] += node.Revenue
      }
    })

    return total
  }, { 'All': {} })

  Object.keys(commodities).forEach(commodity => {
    Object.keys(commodities[commodity]).forEach(year => {
      commodities[commodity][year] = parseInt(commodities[commodity][year])
    })
  })

  return { commodities, commodityYears }
}

const NationalRevenue = props => {
  let { commodities, commodityYears } = createRevenueCommoditiesData(props.revenueGroupByCommodity, props.revenueGroupByCalendarYear)
  let commodityYearsSortDesc = commodityYears.slice(0)
  commodityYearsSortDesc.sort((a, b) => b - a)
  let year = commodityYears[commodityYears.length - 1]
  let annualTotalRevenue = commodities && commodities.All && commodities.All[year]

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
        <StickyHeader headerId="federal-revenue" headerText='Revenue from extraction on federal lands and waters' alt="Federal land"/>

        <p>When companies extract natural resources on federal lands and waters, they pay royalties, rents, bonuses, and other fees, much like they would to any landowner. This non-tax revenue is collected and reported by the Office of Natural Resources Revenue (ONRR).</p>

        <p>For details about the laws and policies that govern how rights are awarded to companies and what they pay to extract natural resources on federal land: <Link to="/how-it-works/coal/">coal</Link>, <Link to="/how-it-works/onshore-oil-gas/">oil and gas</Link>, <Link to="/how-it-works/onshore-renewables/">renewable resources</Link>, and <Link to="/how-it-works/minerals/">hardrock minerals</Link>.</p>

        <p>The federal government collects different kinds of fees at each phase of natural resource extraction. This chart shows how much federal revenue ONRR collected in <GlossaryTerm>calendar year (CY)</GlossaryTerm> { year } for production or potential production of natural resources on federal lands and waters, broken down by phase of production. <strong>In { year }, ONRR collected a total of {utils.formatToDollarInt(annualTotalRevenue)} in revenue.</strong>
        </p>

        <p>
          <ExploreDataLink to="/explore/revenue">Revenue data in detail</ExploreDataLink>
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
              revenueGroupByCommodity = {props.revenueGroupByCommodity}
              revenueGroupByCalendarYear = {props.revenueGroupByCalendarYear}
            />
          </article>

          <article className="eiti-tab-panel" id="story" role="tabpanel">
            <RevenueProcessTable
              id='revenue-process'
              locationId={props.stateId}
              locationName={props.stateName}
              year={year}
              isNationalPage = {props.isNationalPage}
              revenueGroupByCommodity = {props.revenueGroupByCommodity}
              revenueGroupByCalendarYear = {props.revenueGroupByCalendarYear}
            />
          </article>

        </div>

        <StickyHeader headerId="revenue-trends" headerSize="h4" headerText='Federal revenue trends by resource'>
          <YearSelector years={commodityYearsSortDesc} classNames="flex-row-icon" />
        </StickyHeader>

        <div className="chart-selector-wrapper">
          <div className="chart-description">
            <p>
                        Non-tax revenue collected by <GlossaryTerm>ONRR</GlossaryTerm> often depends on what resources are available on federal lands and waters, as well as the laws and regulations about extraction of each resource.
            </p>
            <p>
              <ExploreDataLink to="/explore/revenue">Revenue data in detail</ExploreDataLink>
              <Link to="/downloads/federal-revenue-by-location/" className="data-downloads">
                <DataAndDocs />
              </Link>
            </p>
          </div>
        </div>

        <section className="chart-list">

          {lazy(commodities).toArray().map((commodity, index) => {
            let annualRevenue = commodity[1]
            let revenue = annualRevenue[year] || 0
            let commodityName = utils.getDisplayName_CommodityName(commodity[0])
            let commoditySlug = utils.formatToSlug(commodity[0])
            let chartToggle = 'revenue-figures-chart-' + commoditySlug
            let yearRange = '[' + commodityYears[0] + ', ' + commodityYears[commodityYears.length - 1] + ']'

            return (
              <section key={index} id={'revenue-' + commoditySlug} className="chart-item">
                <ChartTitle
                  isIcon={true}
                  units="$,"
                  chartValues={annualRevenue}
                  chartToggle={chartToggle} >{commodityName}</ChartTitle>

                <figure className="chart" id={ chartToggle }>
                  <eiti-bar-chart
                    data={JSON.stringify(annualRevenue)}
                    aria-controls={'revenue-figures-' + commoditySlug}
                    x-range={yearRange}
                    x-value={year}
                    data-units="$,">
                  </eiti-bar-chart>

                  <figcaption id={'revenue-figures-' + commoditySlug}>
                    <span className="caption-data">
                      { commodityName === 'Non-commodity revenue'
                        ? <div>
                                                        Companies paid <span className="eiti-bar-chart-y-value" data-format="$,">
                            {utils.formatToDollarInt(revenue)}
                          </span> in inspection fees, civil penalties, and other revenues in
                          <span className="eiti-bar-chart-x-value">{ year }</span>.
                        </div>
                        : <div>
                                                        Companies paid <span className="eiti-bar-chart-y-value" data-format="$,">
                            {utils.formatToDollarInt(revenue)}
                          </span> to produce {commodityName.toLowerCase()} on federal land in <span className="eiti-bar-chart-x-value">{year}</span>.
                        </div>
                      }
                    </span>
                    <span className="caption-no-data" aria-hidden="true">
                                                There is no data about revenue from production of {commodityName.toLowerCase()} on federal land in <span className="eiti-bar-chart-x-value">{year }</span>.
                    </span>
                    <span className="caption-negative-data" aria-hidden="true">
                                                Production of {commodityName.toLowerCase()} yielded <span className="eiti-bar-chart-y-value" data-format="$,">
                        { utils.formatToDollarInt(revenue)}
                      </span> in <span className="eiti-bar-chart-x-value">{ year }</span> revenue, probably due to  previous overpayment.
                    </span>
                  </figcaption>
                </figure>

              </section>

            )
          })
          }

        </section>

      </section>

    </section>
  )
}

export default NationalRevenue
