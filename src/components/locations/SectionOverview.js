import React from 'react'
import hastReactRenderer from '../../js/hast-react-renderer'
import ReactHtmlParser from 'react-html-parser'
import { withPrefixSVG } from '../utils/temp-link'
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

        <StateProductionSummary production={props.production} productionYears={props.productionYears} stateName={usStateData.title} />
          
          <StateRevenueSummary revenueYears={props.revenueYears} stateName={usStateData.title} revenue={props.revenue}/>

          <StateDisbursementsSummary stateId={usStateData.unique_id}  stateName={usStateData.title}  data={usDisbursements} />

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

const StateProductionSummary = props => {
  const currentYear = props.productionYears[props.productionYears.length - 1]
  const commodityCurrentYear = Object.keys(props.production).filter(commodity => props.production[commodity].volume[currentYear] > 0)
  const commodityCount = commodityCurrentYear && commodityCurrentYear.length
  const withhelds = Object.keys(props.production).filter(commodity => props.production[commodity].volume[currentYear] === 0)
  
  console.log(commodityCurrentYear);
  
    return (
      <div>
          {commodityCount === 1 && <p><strong>{commodityCount}</strong> energy or mineral commodity was produced on federal land in {props.stateName} in {currentYear}.</p>}
          
          {commodityCount > 1 && <p><strong>{commodityCount}</strong> energy or mineral commodities were produced on federal land in {props.stateName} in {currentYear}.</p>}
  
          {commodityCount === 0 && <p>There was no energy or mineral production on federal land in {props.stateName} in {currentYear}.</p>}
  
          {withhelds.length === 1 && <em><strong>{withhelds.length}</strong> commodity was <GlossaryTerm>withheld</GlossaryTerm> in {currentYear}.</em>}
          
          {withhelds.length > 1 && <em><strong>{withhelds.length}</strong> commodities were <GlossaryTerm>withheld</GlossaryTerm> in {currentYear}.</em>}
          <hr></hr>
        </div>
    )
  }
  
  
  const StateRevenueSummary = props => {
  const revenueYear = props.revenueYears[props.revenueYears.length - 1]
  const revenue = props.revenue.All.All[revenueYear]
  
    return (
      <div>
        <p>Production on federal land in {props.stateName} resulted in <strong>{utils.formatToDollarInt(revenue)}</strong> in {revenueYear} revenue.</p>
        <hr></hr>
      </div>
    )
  }
  
  const StateDisbursementsSummary = props => {
      const usStateDisbursements = FederalDisbursements(props.stateId,props.data);
      const stateName=props.stateName;
      const maxYear=usStateDisbursements.All.MaxYear
      const allDisbursements = (usStateDisbursements && usStateDisbursements.All.All) ? usStateDisbursements.All.All[maxYear] : 0
      
      return (
        <div>
        { allDisbursements > 0 && <p>Revenue from federal land resulted in <strong> {utils.formatToDollarInt(allDisbursements)}</strong> disbursed from the federal government to {stateName} in {maxYear}.</p> }
  
        { (allDisbursements == null || allDisbursements == 0 ) && <p>No disbursements were reported for {stateName} in {maxYear}, probably because there was no revenue from production on federal land.</p> }
        <hr></hr>
        </div>
    )
  }

/* Specifies what percentage of land is federally owned, and outputs the total revenue from federal land. */

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
        The state of {props.usStateData.title} chose to participate in an extended reporting process, so this page includes additional <a href="#state-revenue">state revenue</a> and <a href="#state-disbursements">disbursements</a> data, as well as contextual information about <a href="#state-governance">state governance</a> of natural resources.
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
