import React from 'react'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser'
import Link, { withPrefixSVG } from '../utils/temp-link'

import lazy from 'lazy.js'

import VIEWBOXES from '../../data/viewboxes.yml'
import VIEWBOXES_CROPPED from '../../data/viewboxes_cropped.yml'
import VIEWBOXES_OFFSHORE from '../../data/viewboxes_offshore.yml'
import VIEWBOXES_OFFSHORE_CROPPED from '../../data/viewboxes_offshore_cropped.yml'

import iconPlus from '../../img/icons/icon-circled-plus.svg'
import iconMinus from '../../img/icons/icon-circled-minus.svg'

const OffshoreMap = props => {
  const usStateData = props.usStateMarkdown.frontmatter
  const usStateFields = props.usStateMarkdown.fields || {}

  let localityName = usStateData.title

  let legendUnits = props.shortUnits || props.units

  let viewBox = (usStateData.is_cropped) ? VIEWBOXES_CROPPED[usStateData.unique_id] : VIEWBOXES[usStateData.unique_id]
  if (viewBox === undefined) {
    viewBox = (usStateData.is_cropped) ? VIEWBOXES_OFFSHORE_CROPPED[usStateData.unique_id] : VIEWBOXES_OFFSHORE[usStateData.unique_id]
  }

  let viewBoxList
  let breakpointWidth
  let breakpointHeight
  let height
  let isWide = false
  let mediaWidth = 65.88078
  let dataDimensions
  let eitiTooltipWrapperClasslist = 'svg-container county map-container'

  if (viewBox && viewBox.county) {
    	viewBox = viewBox.county
  }

  if (viewBox) {
    viewBoxList = viewBox.split(' ')
    breakpointWidth = viewBoxList[2]
    height = viewBoxList[3]
    breakpointHeight = height * 2.5
    isWide = (breakpointWidth > breakpointHeight)
  }

  mediaWidth = (isWide) ? 100 : mediaWidth
  eitiTooltipWrapperClasslist = (isWide) ? eitiTooltipWrapperClasslist + ' wide ' : eitiTooltipWrapperClasslist
  dataDimensions = (height / breakpointWidth)
  let additionalPadding = dataDimensions * 1.8
  let paddingBottom = (mediaWidth * dataDimensions) + additionalPadding
  let usStatesSVG = withPrefixSVG('/maps/states/all.svg')
  let usOffshoreSVG = withPrefixSVG('/maps/offshore/all.svg')
  let usStateSVG = withPrefixSVG('/maps/offshore/all.svg#' + usStateData.unique_id)

  function getNeighborsFeatures () {
    let content = ''

    if (usStateData.neighbors) {
      content = usStateData.neighbors.map((neighbor, index) => {
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

    if (usStateData.neighbors) {
      content = usStateData.neighbors.map((neighbor, index) => {
        return (<use key={index} xlinkHref={usStatesSVG + '#state-' + neighbor}></use>)
      })
    }
    else {
      content = <use xlinkHref={usStatesSVG + '#states-mesh'}></use>
    }

    return content
  }

  let legendClasslist = (isWide) ? 'legend-container wide' : 'legend-container'

  return (
    <div>
      <div className="container">
        <div is="eiti-tooltip-wrapper"
          tooltip-style="subtle"
          cursor-offset="10"
          class={eitiTooltipWrapperClasslist}
          data-dimensions={dataDimensions}
          style={{ 'paddingBottom': paddingBottom }}
        >
          <svg className="county map" viewBox={ viewBox }>
            <g className="states features">
              {getNeighborsFeatures()}
            </g>
            <g className="states mesh">
              {getNeighborsMesh()}
            </g>
            <g className="regions features">
              <use xlinkHref={usOffshoreSVG}></use>
            </g>
            <g className="regions features">
              <use xlinkHref={usStateSVG}></use>
            </g>

		            {
		                (lazy(props.countyProductionData).toArray()).map((countyData, index) => {
                let data = (countyData[1].products) ? countyData[1].products[props.productKey] : countyData[1].revenue
                let dataValue = (countyData[1].products)
                  ? (countyData[1].products[props.productKey] && countyData[1].products[props.productKey].volume[props.year])
                  : countyData[1].revenue[props.year]
                let dataValues = (countyData[1].products)
                  ? (countyData[1].products[props.productKey] && JSON.stringify(countyData[1].products[props.productKey].volume))
                  : JSON.stringify(countyData[1].revenue)
                if (data && dataValues) {
                  return (
                    <g key={index}
                      className="county feature"
                      data-fips={countyData[0]}
                      data-value={dataValue }
                      data-year-values={dataValues}
                    >
                      <data>{ countyData[1].name }</data>
                      <use xlinkHref={usOffshoreSVG + '#' + countyData[0]}></use>
                    </g>
                  )
                }
              })
		            }

            <g className="regions mesh">
              <use xlinkHref={usStateSVG + '-mesh'}></use>
            </g>

            {
		                (lazy(props.countyProductionData).toArray()).map((countyData, index) => {
                let data = (countyData[1].products) ? countyData[1].products[props.productKey] : countyData[1].revenue
                let dataValue = (countyData[1].products)
                  ? (countyData[1].products[props.productKey] && countyData[1].products[props.productKey].volume[props.year])
                  : countyData[1].revenue[props.year]
                let dataValues = (countyData[1].products)
                  ? (countyData[1].products[props.productKey] && JSON.stringify(countyData[1].products[props.productKey].volume))
                  : JSON.stringify(countyData[1].revenue)
                if (data && dataValues) {
                  return (
                    <g key={index}
                      className="county feature only-stroke"
                      data-fips={countyData[0]}
                      data-value={dataValue}
                      data-year-values={dataValues}
                    >
                      <title desc={countyData[0]} alt={countyData[0]}>{countyData[0]}</title>
                      <use xlinkHref={usOffshoreSVG + countyData[0]}></use>
                    </g>
                  )
                }
              })
            }

          </svg>
        </div>

        <div className={legendClasslist}>
          {props.isCaption &&
					<div>
					  <figcaption className="legend-data">
					    {props.productName.toLowerCase() === 'revenue'
					      ? <React.Fragment>
                  Revenue by {localityName.toLowerCase()} in <span data-year={ props.year }>{ props.year }</span>
					      </React.Fragment>
					      : <React.Fragment>
					        {localityName } production of {props.productName.toLowerCase()} in <span data-year={ props.year }>{ props.year }</span>
					        {legendUnits && <span className="legend-units"> ({legendUnits})</span>}
					      </React.Fragment>
					    }
					  </figcaption>
					  <figcaption className="legend-no-data" aria-hidden="true">
							There is no county-level data for {usStateData.title} in <span data-year={props.year}>{props.year}</span>.
					  </figcaption>
					  <figcaption className="legend-withheld" aria-hidden="true">
							County-level data for <span data-year={ props.year }>{ props.year }</span> is withheld.
					  </figcaption>
					</div>
          }
          <svg className="legend-svg"></svg>
        </div>
      </div>

      {props.mapToggle &&
			<h4 className="details-container">
			  <button is="aria-toggle"
			    aria-controls={props.mapToggle}
			    aria-expanded="false">
			    <span className="hide-expanded">
			      <img className="aria-toggle-icon" alt="icon with a plus sign" src={iconPlus} />
						Show table
			    </span>
			    <span className="show-expanded">
			      <img className="aria-toggle-icon" alt="icon with a minus sign" src={iconMinus} />
						Hide table
			    </span>
			  </button>
			</h4>
      }

    </div>
  )
}

export default OffshoreMap
