import React from 'react'
import hastReactRenderer from '../../js/hast-react-renderer'
import ReactHtmlParser from 'react-html-parser'
import { withPrefixSVG } from '../utils/temp-link'
import ALL_US_STATES_GDP from '../../data/state_gdp.yml'
import ALL_US_STATES_JOBS from '../../data/state_jobs.yml'
import * as TOP_STATE_PRODUCTS from '../../data/top_state_products'
import LAND_STATS from '../../data/land_stats.yml'
import VIEWBOXES_CROPPED from '../../data/viewboxes_cropped.yml'
import FederalLandOwnershipLegend from '../maps/FederalLandOwnershipLegend'
import FederalLandOwnershipSvg from '../maps/FederalLandOwnershipSvg'
import utils from '../../js/utils'
import styles from './SectionOverview.module.scss'

let year

const SectionOverview = props => {
  const usStateData = props.usStateMarkdown.frontmatter
  const usStateFields = props.usStateMarkdown.fields || {}

  return (
    <section className="state-pages-top">

      <section className="container">

        <div className="state-pages-ownership container-right-5">
          <h3 className="title-land-ownership">Land ownership</h3>
          <FederalLandInfo usStateData={usStateData} />
          <SectionOwnership usStateData={usStateData}/>
        </div>

        <KeyGDPJobs usStateData={usStateData}/>

        <KeyAllProduction usStateData={usStateData} />

        {usStateData.nearby_offshore_region &&
                  <OffshoreRegion usStateData={usStateData} />
        }

        {usStateData.opt_in &&
                  <OptIn usStateData={usStateData} optInIntroHtml={usStateFields.state_optin_intro} />
        }

        {usStateFields.case_study_link_htmlAst &&
                  <CaseStudyLink caseStudyHtml={usStateFields.case_study_link_htmlAst} />
        }

      </section>
    </section>
  )
}

export default SectionOverview

/* TODO: Add SVG */
const SectionOwnership = props => {
  let usStatesSVG = withPrefixSVG('/maps/states/all.svg')
  let usStateSVG = withPrefixSVG('/maps/states/' + props.usStateData.unique_id + '.svg')

  let viewBox = VIEWBOXES_CROPPED[props.usStateData.unique_id]

  if (viewBox['ownership']) {
    viewBox = viewBox['ownership']
  }

  function getNeighborsFeatures () {
    let content = ''

    if (props.usStateData.neighbors) {
      content = props.usStateData.neighbors.map((neighbor, index) => {
        return (<use key={index} xlinkHref={usStatesSVG + '#state-' + neighbor}></use>)
      })
    }
    else {
      content = <use xlinkHref={usStatesSVG + '#states'}></use>
    }

    return content
  }

  function getNeighborsMesh () {
    let content = ''

    if (props.usStateData.neighbors) {
      content = props.usStateData.neighbors.map((neighbor, index) => {
        return (<use key={index} xlinkHref={usStatesSVG + '#state-' + neighbor}></use>)
      })
    }
    else {
      content = <use xlinkHref={usStatesSVG + '#states-mesh'}></use>
    }

    return content
  }

  return (
    <section className="container land-ownership">
      <aside className="map-container" style={{ 'width': '100%' }}>
        <figure is="ownership-map">
          <div className="svg-container county map-container wide"
            style={{ 'paddingBottom': '235.85px' }}>
            <svg className="county ownership map state-page" viewBox={viewBox}>
              <g className="states features">
                {getNeighborsFeatures()}
              </g>
              <g className="states mesh">
                {getNeighborsMesh()}
              </g>
              <g className="counties features">
                <use xlinkHref={usStateSVG + '#counties'}></use>
              </g>
              <FederalLandOwnershipSvg clip='#state-outline'/>
              <g className="counties mesh">
                <use xlinkHref={usStateSVG + '#counties-mesh'}></use>
              </g>
              <g className="state feature overlay">
                <use xlinkHref={usStatesSVG + '#state-' + props.usStateData.unique_id}></use>
              </g>
            </svg>
          </div>

        </figure>

        <aside className="wide" style={{ 'clear': 'both' }}>
          <FederalLandOwnershipLegend />
        </aside>

      </aside>
    </section>
  )
}

/* Includes the GDP percentage, then outputs employment percentage if it’s over 2%. */
const KeyGDPJobs = props => {
  const usStateGDP = ALL_US_STATES_GDP[props.usStateData.unique_id]
  year = (usStateGDP) ? Math.max(...Object.keys(usStateGDP)) : 2017
  const usStateJobs = ALL_US_STATES_JOBS[props.usStateData.unique_id]

  return (
    <p>
            Natural resource extraction varies widely from state to state.{' '}
      {(usStateGDP && usStateGDP[year] && usStateGDP[year].dollars > 0) 
        ? <span>
          In {props.usStateData.title}, extractive industries accounted for { utils.round(usStateGDP[year].percent, 1) }% of gross domestic product (GDP) in {year}
          { usStateJobs[year] && (usStateJobs[year].percent > 2) &&
            <span>
              , and jobs in the extractive industries made up {utils.round(usStateJobs[year].percent, 1)}% of statewide employment
            </span>
          }
          .
        </span>
        :         <span>
          Extractive industries did not have any effect on gross domestic product (GDP) in
          {props.usStateData.title} in {year}.
        </span>
      }
    </p>
  )
}

/* If the state leads U.S. production for any commodities, those commodities are listed along with percentage of US production. */
const KeyAllProduction = props => {
  const usStateTopProducts =
      (TOP_STATE_PRODUCTS[props.usStateData.unique_id] && TOP_STATE_PRODUCTS[props.usStateData.unique_id]['all_production'])
        ? TOP_STATE_PRODUCTS[props.usStateData.unique_id]['all_production'][year] : undefined

  let productsRankedOne = []
  if (usStateTopProducts) {
    usStateTopProducts.map((product, index) => {
      if (product.rank === 1) {
        productsRankedOne.push(product)
      }
    })
  }

  let getProductListItems = () => {
    return (
      <ul>
        {productsRankedOne &&
          productsRankedOne.map((product, index) => {
            return (<li key={index}>{utils.getDisplayName_CommodityName(product.name)}: {utils.round(product.percent, 1)}% of U.S. Production</li>)
          })
        }
      </ul>
    )
  }

  return (
    <div>
      {productsRankedOne.length > 0 &&
                <div>
                  <p>{props.usStateData.title} leads the nation in production of:</p>
                  {getProductListItems()}
                </div>
      }
    </div>
  )
}

/* Sets up the federal-land focus of USEITI data, specifies what percentage of land is federally owned, and outputs the total revenue from federal land. */

const FederalLandInfo = props => {
  return (
    <div className={styles.landOwnershipSummary}>
      <span className="para-md">
        Federal land represents <strong>{utils.round(LAND_STATS[props.usStateData.unique_id].federal_percent, 1)}%</strong> of all land in {props.usStateData.title}.
      </span>
    </div>
  )
}

/* Includes link to relevant offshore region, if there is one */
const OffshoreRegion = props => {
  /// console.log(props.usStateData.nearby_offshore_region);
  return (
    <p>
      {props.usStateData.title} also borders an offshore area with significant natural resource extraction, which may contribute to the state’s economy
      . For production and revenue data about offshore extraction near {props.usStateData.title}, see {ReactHtmlParser(props.usStateData.nearby_offshore_region)}.
    </p>
  )
}

/* Blurb for opt-in states */
const OptIn = props => {
  return (
    <div>
      <p>
        The state of {props.usStateData.title} chose to participate in an extended reporting process, so this page includes additional
        <a href="#state-revenue">state revenue</a> and <a href="#state-disbursements">disbursements</a> data, as well as contextual information about
        <a href="#state-governance">state governance</a> of natural resources.
      </p>
      {props.optInIntroHtml &&
          <div>
            {ReactHtmlParser(props.optInIntroHtml)}
          </div>
      }
    </div>
  )
}

/* Includes case study link, if there is one */
const CaseStudyLink = props => {
  return (
    <div>
      {hastReactRenderer(JSON.parse(props.caseStudyHtml))}
    </div>
  )
}
