import React from 'react'
import Link from '../utils/temp-link'

import slugify from 'slugify'
import lazy from 'lazy.js'

import utils from '../../js/utils'

import StickyHeader from '../layouts/StickyHeader'
import YearSelector from '../selectors/YearSelector'
import DataAndDocs from '../layouts/DataAndDocs'
import GlossaryTerm from '../utils/glossary-term.js'
import { filterTerms } from '../utils/Glossary'

import ChartTitle from '../charts/ChartTitleCollapsible'

import iconCirclePlus from '../../img/icons/icon-circled-plus.svg'
import iconCircleMinus from '../../img/icons/icon-circled-minus.svg'

import PRODUCTION_UNITS from '../../../static/data/production_units.yml'

const createProductionData = (groupByCommodity, groupByYear) => {
  let data = groupByCommodity
  let commodityYears = groupByYear.sort(utils.compareValues('id'))
  if (commodityYears.length > 10) {
    commodityYears = commodityYears.slice(commodityYears.length - 10)
  }
  commodityYears = commodityYears.map(item => parseInt(item.id))

  let commodities = data.reduce((total, item) => {
    let name = (item.id.includes('~')) ? item.id.split('~')[0] : item.id
    item.edges.forEach(element => {
      let node = element.node
      let year = parseInt(node.ProductionYear)
      if (commodityYears.includes(year)) {
        total[item.id] = total[item.id] || { name: name, units: node.Units, withheld: node.Withheld, total: 0, volume: {} }
        total[item.id].volume[year] = (total[item.id].volume[year])
          ? total[item.id].volume[year] + node.Volume
          : node.Volume
        
        total[item.id].total += node.Volume
      }
    })

    return total
  }, {})

  Object.keys(commodities).forEach(commodity => {
    commodities[commodity].total = parseInt(commodities[commodity].total)
    Object.keys(commodities[commodity].volume).forEach(year => {
      commodities[commodity].volume[year] = parseInt(commodities[commodity].volume[year])
    })
  })

  return { commodities, commodityYears }
}

const NationalFederalProduction = props => {
  let { commodities, commodityYears } = createProductionData(props.allProducts, props.allYears)
  let commodityYearsSortDesc = commodityYears.slice(0)
  commodityYearsSortDesc.sort((a, b) => b - a)
  let year = commodityYears[commodityYears.length - 1]
  let yearRange = [commodityYears[0], commodityYears[commodityYears.length - 1]]

  let withHeldProducts = []

  function getWithheldProductsHtml () {
    let withheldProductItems = []

    for (let index in withHeldProducts) {
      let yearString = '('

      let yearsArray = lazy(withHeldProducts[index].volume).keys().toArray()

      let numbersAreConsecutive = true
      for (let i = 1; i < yearsArray.length; i++) {
        if (parseInt(yearsArray[i]) - parseInt(yearsArray[i - 1]) !== 1) {
          numbersAreConsecutive = false
          break
        }
      }

      if (numbersAreConsecutive && yearsArray.length > 1) {
        yearString += "'" + yearsArray[0].substring(2) + '-' + "'" + yearsArray[yearsArray.length - 1].substring(2) + ')'
      }
      else {
        yearsArray.map((year, index) => {
          yearString += "'" + year.substring(2) + ','
        })
        yearString = yearString.substring(0, yearString.length - 1) + ')'
      }

      withheldProductItems.push(<li key={index}>{withHeldProducts[index].name}{' ' + yearString }</li>)
    }

    return withheldProductItems
  }

  return (

    <section id="federal-production" is="year-switcher-section" className="federal production">

      <section className="county-map-table" is="year-switcher-section">
        <StickyHeader alt='Federal lands and waters' headerText='Federal production trends by resources'>
          <YearSelector years={commodityYearsSortDesc} classNames="flex-row-icon" />
        </StickyHeader>

        <div className="chart-selector-wrapper">
          <div className="chart-description">
            <p>
              The Office of Natural Resources Revenue collects detailed data about natural resource <GlossaryTerm>production</GlossaryTerm> on federal lands and waters.
            </p>
            <p>
              <Link to="/downloads/federal-production" >
                <DataAndDocs />
              </Link>
            </p>
          </div>
        </div>

        <div className="chart-list">
          {Object.keys(commodities).map((key, index) => {
            let product = commodities[key]

            // Checks to verify if we have no data for a product for all years
            if (product.total === 0) {
              withHeldProducts.push(product)
              return // return nothing if there is no data to display for this product
            }

            let productName = product.name || key
            let productSlug = slugify(key, { lower: true, remove: /[$*_+~.()'"!\-:@,]/g })
            productSlug = productSlug.replace('/', '')
            let productionValues = product.volume
            let units = product.units ? product.units.toLowerCase() : product.name
            let longUnits = PRODUCTION_UNITS[units] ? PRODUCTION_UNITS[units].long : units
            let termUnits = PRODUCTION_UNITS[units] && PRODUCTION_UNITS[units].term
            let suffixUnits = PRODUCTION_UNITS[units] ? PRODUCTION_UNITS[units].suffix : ''
            let titleUnits = PRODUCTION_UNITS[units] && PRODUCTION_UNITS[units].title
            let chartToggle = 'federal-production-figures-chart-' + productSlug
            let glossaryTerm = (termUnits) ? filterTerms(termUnits)[0] : termUnits

            return (
              <section key={index} id={'national-federal-production-' + productSlug} className="product chart-item">
                <ChartTitle
                  isIcon={true}
                  units={longUnits}
                  chartUnitsTitle ={titleUnits}
                  chartValues={productionValues}
                  chartToggle={chartToggle} >{productName}</ChartTitle>

                <figure className="chart" id={chartToggle}>
                  <eiti-bar-chart
                    aria-controls={'national-federal-production-figures-' + productSlug + ' national-federal-production-withheld' }
                    data={JSON.stringify(productionValues)}
                    x-range={JSON.stringify(yearRange)}
                    x-value={year}
                    data-units={longUnits}>
                  </eiti-bar-chart>
                  <figcaption id={'national-federal-production-figures-' + productSlug }>
                    <span className="caption-data">
                      <span className="eiti-bar-chart-y-value" data-format=",">{productionValues[year] ? (productionValues[year]).toLocaleString() : 0}{' '}</span>
                      {glossaryTerm
                        ? <GlossaryTerm termKey={termUnits}>{longUnits}</GlossaryTerm>
                        : longUnits
                      }
                      {' '}of {productName.toLowerCase()} {suffixUnits} were produced on federal land in <span className="eiti-bar-chart-x-value">{ year }</span>.
                    </span>
                    <span className="caption-no-data" aria-hidden="true">
                      There is no data about production of {productName.toLowerCase()} {suffixUnits} on federal land in <span className="eiti-bar-chart-x-value">
                        { year }</span>.
                    </span>
                    <span className="caption-withheld" aria-hidden="true">
                      Data about {productName.toLowerCase()} {suffixUnits} production on federal land in <span className="eiti-bar-chart-x-value">
                        { year }</span> is withheld.
                    </span>
                  </figcaption>
                </figure>
              </section>
            )
          })}

          <section id="national-federal-production-withheld" className="product chart-item withheld-list">
            <h3 className="chart-title">Data withheld</h3>
            <p>
                            Production volume was <GlossaryTerm>withheld</GlossaryTerm> for the
                            following products:
            </p>
            <ul id="federal-production-withheld-products" className="expandable">
              {getWithheldProductsHtml()}
            </ul>
            <button is="aria-toggle"
              aria-expanded="false"
              aria-toggles="aria-expanded"
              aria-controls="federal-production-withheld-products"
              className="aria-toggle-large aria-toggle-white">
              <span className="hide-expanded">
                <img className="aria-toggle-icon" alt="icon with a plus sign" src={iconCirclePlus}/>
                            Show all { withHeldProducts.length } {withHeldProducts.length > 1 ? ' products' : ' product'}
              </span>
              <span className="show-expanded">
                <img className="aria-toggle-icon" alt="icon with a minus sign" src={iconCircleMinus}/>
                            Close
              </span>
            </button>
          </section>

        </div>
      </section>
    </section>
  )
}

export default NationalFederalProduction
