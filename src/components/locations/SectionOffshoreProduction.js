import React from 'react'
import Link from '../utils/temp-link'

import PRODUCTION_UNITS from '../../../static/data/production_units.yml'

import ChartTitle from '../charts/ChartTitleCollapsible'
import StickyHeader from '../layouts/StickyHeader'
import { StickyWrapper } from '../utils/StickyWrapper'
import YearSelector from '../selectors/YearSelector'
import DataAndDocs from '../layouts/DataAndDocs'
import GlossaryTerm from '../utils/glossary-term.js'
import { filterTerms } from '../utils/Glossary'
import OffshoreMap from '../maps/OffshoreMap'

import utils from '../../js/utils'

const SectionOffshoreProduction = props => {
  const usStateData = props.usStateMarkdown.frontmatter
  const countyProductionForState = props.countyProduction
  const usStateFederalProducts = props.production

  let commodityYearsSortDesc = props.productionYears.slice(0)
  commodityYearsSortDesc.sort((a, b) => b - a)
  let year = props.productionYears[props.productionYears.length - 1]
  let yearRange = [props.productionYears[0], props.productionYears[props.productionYears.length - 1]]

  return (
    <section id="federal-production" className="federal production">

      <section className="county-map-table" is="year-switcher-section">
        <StickyWrapper bottomBoundary="#federal-production" innerZ="10000">
          <StickyHeader headerText={'Production on federal waters in the ' + usStateData.title}>
            <YearSelector years={commodityYearsSortDesc} classNames="flex-row-icon" />
          </StickyHeader>
        </StickyWrapper>

        { (Object.entries(usStateFederalProducts).length === 0 && usStateFederalProducts.constructor === Object)
          ? <div>
            <p>
              The Office of Natural Resources Revenue collects detailed data about natural resources produced on federal waters. According to that data
              , there was no natural resource <GlossaryTerm>production</GlossaryTerm> on federal waters in the {usStateData.title} in { year }.
            </p>
            <p>
              <Link to="/downloads/federal-production/">
                <DataAndDocs />
              </Link>
            </p>
          </div>
          : <div className="chart-selector-wrapper">
            <div className="chart-description">
              <p>
                The Office of Natural Resources Revenue collects detailed data about natural resource <GlossaryTerm>
                  production</GlossaryTerm> on federal waters in the {usStateData.title}.
              </p>
              <p>
                <Link to="/downloads/federal-production/">
                  <DataAndDocs />
                </Link>
              </p>
            </div>
          </div>
        }

        <div className="chart-list">
          {Object.keys(usStateFederalProducts).map((productKey, index) => {
            
            if (usStateFederalProducts[productKey].total === 0) return
            let product = usStateFederalProducts[productKey]
            let productName = product.name
            let productSlug = utils.formatToSlug(productName, { lower: true })
            let productVolumes = {}
            let units = product.units

            Object.keys(product.volume).map((volumeKey, index) => {
              productVolumes[volumeKey] = product.volume[volumeKey]
            })

            let shortUnits = PRODUCTION_UNITS[units] ? PRODUCTION_UNITS[units].short : units
            let longUnits = PRODUCTION_UNITS[units] ? PRODUCTION_UNITS[units].long : units
            let termUnits = PRODUCTION_UNITS[units] && PRODUCTION_UNITS[units].term
            let suffixUnits = PRODUCTION_UNITS[units] ? PRODUCTION_UNITS[units].suffix : ''
            let glossaryTerm = (termUnits) ? filterTerms(termUnits)[0] : termUnits

            let chartToggle = 'federal-production-figures-chart-' + productSlug

            /* Start County Map Variables */
            let mapToggle = 'federal-production-' + productSlug + '-counties'

            return (
              <section key={index} id={'federal-production-' + productSlug } className="product full-width">
                <div className="row-container">

                  <div className="chart-container">
                    <ChartTitle
                      isIcon={true}
                      units={longUnits}
                      chartValues={productVolumes}
                      chartToggle={chartToggle} >{productName}</ChartTitle>

                    <figure className="chart" id={chartToggle}>
                      <eiti-bar-chart
                        aria-controls={'federal-production-figures-' + productSlug }
                        data={JSON.stringify(productVolumes)}
                        x-range={JSON.stringify(yearRange)}
                        x-value={year}
                        data-units={longUnits}>
                      </eiti-bar-chart>
                      <figcaption id={'federal-production-figures-' + productSlug }>
                        <span className="caption-data">
                          <span className="eiti-bar-chart-y-value" data-format=",">{(productVolumes[year]) ? (productVolumes[year]).toLocaleString() : ('0').toLocaleString() }{' '}</span>
                          {glossaryTerm
                            ? <GlossaryTerm termKey={termUnits}>{longUnits}</GlossaryTerm>
                            : longUnits
                          }{' '}of {productName.toLowerCase()} {suffixUnits}
                                                    were produced in the {' ' + usStateData.title + ' in '}
                          <span className="eiti-bar-chart-x-value">{ year }</span>.
                        </span>
                        <span className="caption-no-data" aria-hidden="true">
                                                    There is no data about production of {productName.toLowerCase()} {suffixUnits} in{' '}
                          <span className="eiti-bar-chart-x-value">{ year }</span>.
                        </span>
                      </figcaption>
                    </figure>
                  </div>

                  <div className="map-container">

                    <h4 className="chart-title">
                      { usStateData.title } production
                    </h4>

                    <figure is="eiti-data-map-table">
                      <eiti-data-map color-scheme="Blues" steps="4" units={units}>
                        <OffshoreMap
                          usStateMarkdown={props.usStateMarkdown}
                          countyProductionData={countyProductionForState}
                          productKey={productKey}
                          year={year}
                          isCaption={true}
                          mapToggle={mapToggle}
                          productName={productName}
                          units={units}
                          shortUnits={shortUnits}/>

                      </eiti-data-map>

                      <div className="eiti-data-map-table" id={mapToggle} aria-hidden="true">
                        <table is='bar-chart-table'
                          data-percent-max='100'
                          class='county-table'
                          year={year}>
                          <thead>
                            <tr>
                              <th>{'Region'}</th>
                              <th colSpan='2' className='numeric' data-series='volume'>{ longUnits.toLowerCase() } of {productName.toLowerCase()}</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="inner-table-row">
                              <td colSpan="3" className="inner-table-cell">
                                <div className="inner-table-wrapper">
                                  <table>
                                    {Object.keys(countyProductionForState).map((countyKey, index) => {
                                      let countyData = countyProductionForState[countyKey]

                                      if (countyData.products[productKey] && countyData.products[productKey].volume[year] > 0) {
                                        let yearsValue = countyData.products[productKey].volume
                                        let productVolume = countyData.products[productKey].volume[year]

                                        return (
                                          <tbody key={index}>
                                            <tr data-fips={countyData} data-year-values={JSON.stringify(yearsValue)}>
                                              <td><div className='swatch'
                                                data-value-swatch={productVolume}
                                                data-year-values={JSON.stringify(yearsValue)}></div>{ countyData.name }</td>
                                              <td data-value-text={productVolume}
                                                data-year-values={JSON.stringify(yearsValue)}>{utils.formatToCommaInt(productVolume)}</td>
                                              <td className='numberless'
                                                data-series='volume'
                                                data-value={productVolume}
                                                data-year-values={JSON.stringify(yearsValue)}>{utils.formatToCommaInt(productVolume)}</td>
                                            </tr>
                                            <tr data-fips={countyData[0]}>
                                              <td colSpan='3'
                                                data-year-values={JSON.stringify(yearsValue)}
                                                data-sentence={productVolume}
                                                aria-hidden='true'
                                                data-withheld="false">
                                                <span className="withheld" aria-hidden="true">
                                                                                                Data about { productName.toLowerCase() } extraction on federal land in { countyData.name } in <span data-year={ year }>{ year }</span> is withheld.
                                                </span>
                                                <span className="has-data">
                                                  <span data-value={productVolume}>{utils.formatToCommaInt(productVolume)}</span> {longUnits} of {productName.toLowerCase()} were produced in { countyData.name } in <span data-year={ year }>{year}</span>.
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

                </div>

              </section>
            )
          })}
        </div>
      </section>

    </section>
  )
}

export default SectionOffshoreProduction
