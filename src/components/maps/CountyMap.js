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

const CountyMap = props => {
  const usStateData = props.usStateMarkdown.frontmatter
  const usStateFields = props.usStateMarkdown.fields || {}

  let localityName = usStateData.locality_name || 'County'

  if (usStateData.unique_id === 'AK') {
    localityName = 'Borough'
  }

  if (usStateData.unique_id === 'LA') {
    localityName = 'Parish'
  }

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
  let eitiTooltipWrapper_Classlist = 'svg-container county map-container'

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
  eitiTooltipWrapper_Classlist = (isWide) ? eitiTooltipWrapper_Classlist + ' wide ' : eitiTooltipWrapper_Classlist
  dataDimensions = (height / breakpointWidth)
  let additionalPadding = dataDimensions * 1.8
  let paddingBottom = (mediaWidth * dataDimensions) + additionalPadding

  let usStatesSVG = withPrefixSVG('/maps/states/all.svg')
  let usStateSVG = (usStateData.unique_id === 'pacific') ? withPrefixSVG('/maps/offshore/all.svg') : withPrefixSVG('/maps/states/' + usStateData.unique_id + '.svg')

  function getNeighbors_Features () {
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

  function getNeighbors_Mesh () {
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

  let legend_Classlist = (isWide) ? 'legend-container wide' : 'legend-container'

  return (
    <div>
      <div className="container">
        <div is="eiti-tooltip-wrapper"
          tooltip-style="subtle"
          cursor-offset="10"
          class={eitiTooltipWrapper_Classlist}
          data-dimensions={dataDimensions}
          style={{ 'paddingBottom': paddingBottom }}
        >
          <svg className="county map" viewBox={ viewBox }>
            <g className="states features">
                      	{getNeighbors_Features()}
            </g>
            <g className="states mesh">
                      	{getNeighbors_Mesh()}
            </g>
            <g className="counties features">
                      	<use xlinkHref={usStateSVG + '#counties'}></use>
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
			                            <use xlinkHref={usStateSVG + '#county-' + countyData[0]}></use>
			                        </g>
			                    )
		                	}
		                })
		            }

            <g className="counties mesh">
                      	<use xlinkHref={usStateSVG + '#counties-mesh'}></use>
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
			                            <use xlinkHref={usStateSVG + '#county-' + countyData[0]}></use>
			                        </g>
			                    )
			                }
		                })
            }

            <g className="state feature overlay">
                      	<use xlinkHref={usStatesSVG + '#state-' + usStateData.unique_id}></use>
            </g>
          </svg>
        </div>

        <div className={legend_Classlist}>
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

export default CountyMap
