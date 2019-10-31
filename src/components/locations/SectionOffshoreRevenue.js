import React from 'react'
import Link from '../utils/temp-link'

import StickyHeader from '../layouts/StickyHeader'
import { StickyWrapper } from '../utils/StickyWrapper'
import YearSelector from '../selectors/YearSelector'
import DataAndDocs from '../layouts/DataAndDocs'
import GlossaryTerm from '../utils/glossary-term.js'
import RevenueTypeTable from '../locations/RevenueTypeTable'
import RevenueProcessTable from '../locations/RevenueProcessTable'
import utils from '../../js/utils'
import ChartTitle from '../charts/ChartTitleCollapsible'

import OffshoreMap from '../maps/OffshoreMap'

const SectionOffshoreRevenue = props => {
  const usStateData = props.usStateMarkdown.frontmatter

  const commodities = props.commodities
  const commodityYears = props.commodityYears
  let commodityYearsSortDesc = commodityYears.slice(0)
  commodityYearsSortDesc.sort((a, b) => b - a)
  let year = commodityYears[props.commodityYears.length - 1]

  const usStateCountyRevenue = props.commoditiesCounty
  const usStateCountyRevenueSorted = Object.keys(usStateCountyRevenue).map(key => {
    return ({ [key]: usStateCountyRevenue[key] })
  })

  usStateCountyRevenueSorted.sort((a, b) => {
    let nameA = a[Object.keys(a)[0]].name.toLowerCase()
    let nameB = b[Object.keys(b)[0]].name.toLowerCase()
    if (nameA < nameB) return -1
    if (nameB < nameA) return 1
    return 0
  })

  let allCommoditiesValues = {}
  let allCommoditiesSlug, allCommoditiesChartName
  if (commodities) {
    allCommoditiesChartName = 'All commodities'
    allCommoditiesSlug = utils.formatToSlug(allCommoditiesChartName, { lower: true })
    // eslint-disable-next-line no-return-assign
    commodityYearsSortDesc.map(year => allCommoditiesValues[year] = commodities.All.All[year])
  }

  let chartMapTitle = 'Revenue collected by offshore area'

  return (
    <section id="revenue" is="year-switcher-section" className="federal revenue">

      <h2>Federal Revenue</h2>

      <p>Natural resource extraction can lead to federal revenue in two ways: non-tax revenue and tax revenue.</p>
      <p>When companies extract natural resources on federal lands and waters, they pay royalties, rents, bonuses, and other fees, much like they would to any landowner. This non-tax revenue is collected and reported by the Office of Natural Resources Revenue (ONRR).</p>

      <section id="federal-revenue">

        {commodities
          ? <div>
            <StickyWrapper bottomBoundary="#fee-summaries" innerZ="10000">
              <StickyHeader headerText={'Federal revenue by resource'} />
            </StickyWrapper>
            <p>Laws and policies govern how rights are awarded to companies and what they pay to extract natural resources on the Outer Continental Shelf
          . For details, read more about the processes for <Link to="/how-it-works/offshore-oil-gas/">offshore oil and gas
            </Link> or <Link to="/how-it-works/offshore-renewables/">offshore renewable energy</Link>.
            </p>
            <p>The federal government collects different kinds of fees at each phase of resource extraction. This chart shows how much federal revenue was collected in <GlossaryTerm>calendar year (CY)</GlossaryTerm> {commodityYearsSortDesc[0]} for production or potential production of natural resources on federal waters, broken down by phase of production.</p>
		                <div id="fee-summaries" className="tab-interface">
		                    <ul className="eiti-tabs info-tabs" role="tablist">
		                        <li role="presentation">
		                            <a href="#revenues" tabIndex="0" role="tab" aria-controls="revenues" aria-selected="true">
                                  Federal revenue by phase (CY {commodityYearsSortDesc[0]})</a>
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
                  commodities={commodities}
                  commodityYears={commodityYears}
		                    />
		                  </article>

		                  <article className="eiti-tab-panel" id="story" role="tabpanel">
		                    <RevenueProcessTable
		                        id='revenue-process'
		                        locationId={usStateData.unique_id}
		                        locationName={usStateData.title}
		                        year={year}
                  commodities={commodities}
                  commodityYears={commodityYears}
		                    />
		                  </article>

		                </div>

		              <StickyWrapper bottomBoundary="#federal-revenue-county-table" innerZ="10000">
				            <StickyHeader headerSize="h4" headerText={'Federal revenue by offshore area'}>
				                <YearSelector years={commodityYearsSortDesc} classNames="flex-row-icon" />
				            </StickyHeader>
				           </StickyWrapper>

            <section className="chart-list">

              <div className="chart-selector-wrapper">

                <div className="chart-description">
                  <p>
                    Non-tax revenue collected by ONRR often depends on what resources are available
                    , as well as the laws and regulations about extraction of each resource.
                  </p>
                  <p>
                    <Link to="/downloads/federal-revenue-by-location">
                      <DataAndDocs />
                    </Link>
                  </p>
                </div>
              </div>

              <section id={'federal-revenue-county-table'} className="county-map-table">
                <div className="row-container">

                  <div className="chart-container">
                    <ChartTitle
                      isIcon={true}
                      units={'dollars'}
                      chartValues={allCommoditiesValues}
                      chartToggle={'federal-revenue-county-figures-' + allCommoditiesSlug} >{allCommoditiesChartName}</ChartTitle>

                    <figure className="chart" id={'federal-revenue-county-figures-chart-' + allCommoditiesSlug}>
                      <eiti-bar-chart
                        aria-controls={'federal-revenue-county-figures-' + allCommoditiesSlug}
                        data={JSON.stringify(allCommoditiesValues)}
                        x-range={'[' + commodityYearsSortDesc[commodityYearsSortDesc.length - 1] + ',' + commodityYearsSortDesc[0] + ']'}
                        x-value={commodityYearsSortDesc[0]}
                        data-units={'$,'}>
                      </eiti-bar-chart>
                      <figcaption id={'federal-revenue-county-figures-' + allCommoditiesSlug} aria-hidden='false'>
                        <span className="caption-data">
                          Companies paid <span className="eiti-bar-chart-y-value" data-format="$,">
                            {(allCommoditiesValues[commodityYearsSortDesc[0]])
                              ? (allCommoditiesValues[commodityYearsSortDesc[0]]).toLocaleString() : ('0').toLocaleString() }{' '}
                          </span>
                          {' '}to produce natural resources in the{' ' + usStateData.title + ' in '}
                          <span className="eiti-bar-chart-x-value">{ commodityYearsSortDesc[0] }</span>.
                        </span>
                        <span className="caption-no-data" aria-hidden="true">
                          There is no data about production of {allCommoditiesChartName.toLowerCase()} in{' '}
                          <span className="eiti-bar-chart-x-value">{ commodityYearsSortDesc[0] }</span>.
                        </span>
                      </figcaption>
                    </figure>
                  </div>
                  {usStateCountyRevenue &&
                    <div className="map-container">

                      <h4 className="chart-title">
                        {chartMapTitle}
                      </h4>

                      <figure is="eiti-data-map-table">
                        <eiti-data-map color-scheme="Blues" steps="4" units={'$'}>
                          <OffshoreMap
                            usStateMarkdown={props.usStateMarkdown}
                            countyProductionData={usStateCountyRevenue}
                            productKey={'revenue'}
                            year={commodityYearsSortDesc[0]}
                            isCaption={true}
                            mapToggle={'federal-revenue-counties'}
                            productName={'revenue'}
                            units={'$'}
                            shortUnits={'$'}/>

                        </eiti-data-map>

                        <div className="eiti-data-map-table" id={'federal-revenue-counties'} aria-hidden="true">
                          <table is='bar-chart-table'
                            data-percent-max='100'
                            class='county-table'
                            year={commodityYearsSortDesc[0]}>
                            <thead>
                              <tr>
                                <th>{utils.toTitleCase(usStateData.unique_id)}</th>
                                <th colSpan='2' className='numeric' data-series='volume'>Revenue</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="inner-table-row">
                                <td colSpan="3" className="inner-table-cell">
                                  <div className="inner-table-wrapper">
                                    <table>
                                      {usStateCountyRevenueSorted.map((data, index) => {
                                        let key = Object.keys(data)[0]
                                        let countyData = [key, data[key]]
                                        if (countyData[1].revenue[year] > 0) {
                                          let yearsValue = countyData[1].revenue
                                          let productVolume = countyData[1].revenue[year]
                                          let dataSentence = utils.formatToDollarInt(productVolume)
                                          return (
                                            <tbody key={index}>
                                              <tr data-fips={countyData[0]} data-format={'$,'} data-year-values={JSON.stringify(yearsValue)}>
                                                <td>
                                                  <div className='swatch'
                                                    data-value-swatch={productVolume}
                                                    data-year-values={JSON.stringify(yearsValue)}>
                                                  </div>{ countyData[1].name }
                                                </td>
                                                <td data-format={'$,'} data-value-text={productVolume}
                                                  data-year-values={JSON.stringify(yearsValue)}>{productVolume}</td>
                                                <td className='numberless'
                                                  data-series='volume'
                                                  data-value={productVolume}
                                                  data-year-values={JSON.stringify(yearsValue)}>{productVolume}</td>
                                              </tr>
                                              <tr data-fips={countyData[0]}>
                                                <td colSpan='3'
                                                  data-format={'$,'}
                                                  data-year-values={JSON.stringify(yearsValue)}
                                                  data-sentence={dataSentence}
                                                  aria-hidden='true'
                                                  data-withheld="false">
                                                  <span className="withheld" aria-hidden="true">
                                                    Data about revenue on federal land in { countyData[1].name } in <span data-year={ year }>{ year }</span> is withheld.
                                                  </span>
                                                  <span className="has-data">
                                                    Companies paid <span data-format={'$,'} data-value={productVolume}>
                                                      {productVolume}
                                                    </span> to extract natural resources on federal land in { countyData[1].name } County in
                                                    <span data-year={ year }>{year}</span>.
                                                  </span>
                                                </td>
                                              </tr>
                                            </tbody>
                                          )
                                        }
                                      })}
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                      </figure>
                    </div>
                  }
                </div>
              </section>
            </section>
          </div>
          : <div className="chart-description">
							No natural resources were produced on federal land in {usStateData.title} in { commodityYearsSortDesc[0] }
              , so ONRR did not collect any non-tax revenues.
          </div>
        }
      </section>
    </section>
  )
}

export default SectionOffshoreRevenue
