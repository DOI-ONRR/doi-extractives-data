import React from 'react'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser'
import Link, { withPrefixSVG } from '../../utils/temp-link'

import lazy from 'lazy.js'

import styles from './CountyMaps.module.scss'

import VIEWBOXES from '../../../data/viewboxes_offshore.yml'
import VIEWBOXES_CROPPED from '../../../data/viewboxes_offshore_cropped.yml'

import ALASKA_PRODUCTION_AREAS from '../../../data/offshore_federal_production_areas/Alaska.yml'
import GULF_PRODUCTION_AREAS from '../../../data/offshore_federal_production_areas/Gulf.yml'
import PACIFIC_PRODUCTION_AREAS from '../../../data/offshore_federal_production_areas/Pacific.yml'

import iconPlus from '../../../img/icons/icon-circled-plus.svg'
import iconMinus from '../../../img/icons/icon-circled-minus.svg'

class CountyMaps extends React.Component {
  constructor (props) {
    super(props)

	  this.frontmatterData = props.usStateMarkdown.frontmatter
	  const usStateFields = props.usStateMarkdown.fields || {}

	 	this.productionAreas

    switch (this.frontmatterData.unique_id) {
    case 'alaska':
      this.productionAreas = ALASKA_PRODUCTION_AREAS
      break
    case 'GULF_PRODUCTION_AREAS':
      this.productionAreas = GULF_PRODUCTION_AREAS
      break
    case 'pacific':
      this.productionAreas = PACIFIC_PRODUCTION_AREAS
      break
    }
    //console.log('OFFSHORE_FEDERAL_PRODUCTION_AREAS:', this.productionAreas)

    let localityName = this.frontmatterData.unique_id + ' offshore region'

	  let legendUnits = props.shortUnits || props.units

	  this.viewBox = (this.frontmatterData.is_cropped) ? VIEWBOXES_CROPPED[this.frontmatterData.unique_id] : VIEWBOXES[this.frontmatterData.unique_id]
	  let viewBoxList
	  let breakpointWidth
	  let breakpointHeight
	  let height
	  let isWide = false
	  let mediaWidth = 65.88078
	  let dataDimensions
	  let eitiTooltipWrapper_Classlist = 'svg-container county map-container'

	  if (this.viewBox && this.viewBox.county) {
	  	this.viewBox = this.viewBox.county
	  }

	  if (this.viewBox) {
	  	viewBoxList = this.viewBox.split(' ')
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

    this.offshoreAllSvg = withPrefixSVG('/maps/offshore/all.svg')

	  this.statesAllSvg = withPrefixSVG('/maps/states/all.svg')
    // let stateId =

    let usStateSVG = withPrefixSVG('/maps/states/' + this.frontmatterData.unique_id + '.svg')

    let legend_Classlist = (isWide) ? 'legend-container wide' : 'legend-container'

    let styleMap = {
    	float: 'left',
	    display: 'block',
	    marginRight: '2.35765%',
	    width: '65.88078%',
	    'paddingBottom': paddingBottom,
    }
  }

  getNeighborsFeatures () {
    let content = ''

    if (this.frontmatterData.neighbors) {
      content = this.frontmatterData.neighbors.map((neighbor, index) => {
        return (<use key={index} xlinkHref={this.statesAllSvg + '#state-' + neighbor}></use>)
      })
    }
    else {
      content = <use xlinkHref={this.statesAllSvg + '#states'}></use>
    }

    return content
  }

  getNeighborsMesh () {
    let content = ''

    if (this.frontmatterData.neighbors) {
      content = this.frontmatterData.neighbors.map((neighbor, index) => {
        return (<use key={index} xlinkHref={this.statesAllSvg + '#state-' + neighbor}></use>)
      })
    }
    else {
      content = <use xlinkHref={this.statesAllSvg + '#states-mesh'}></use>
    }

    return content
  }

  render () {
    return (
      <div className={styles.root}>
        <div>
          <svg className={styles.map} viewBox={ this.viewBox }>
            <g className={styles.states}>
	            {this.getNeighborsFeatures()}
            </g>
            <g className={styles.counties}>
              <use xlinkHref={this.offshoreAllSvg + '#' + this.frontmatterData.unique_id}></use>
            </g>
            {
              (lazy(this.productionAreas).toArray()).map((countyData, index) => {
              	if (countyData[1].products[this.props.productKey]) {
              		//console.log(countyData[1].products[this.props.productKey])
                  return (
                    <g key={index} style={{ fill: 'blue', cursor: 'pointer' }} >
                      <title>{ countyData[1].name }</title>
                      <use xlinkHref={this.offshoreAllSvg + '#' + countyData[0]}></use>
                    </g>
                  )
              	}
              })
            }
            <g className={styles.counties}>
		          <use xlinkHref={this.offshoreAllSvg + '#' + this.frontmatterData.unique_id + '-mesh'}></use>
		        </g>
          </svg>
        </div>
      </div>
    )
  }
};

export default CountyMaps

/*
			                    <g className="states features">
			                      	{getNeighbors_Features()}
			                    </g>
			                    <g className="states mesh">
			                      	{getNeighbors_Mesh()}
			                    </g>
			                    <g className="regions features">
			                      	<use xlinkHref={offshoreAllSvg}></use>
			                    </g>
			                    <g className="regions features">
			                      	<use xlinkHref={offshoreAllSvg+"#"+this.frontmatterData.unique_id}></use>
			                    </g>

					            {
					                (lazy(productionAreas).toArray()).map((countyData, index) => {
					                	if(countyData[1].products[props.productKey]){
						                    return(
						                        <g key={index} style={{fill: 'blue', cursor:'pointer'}} onClick={>
					                            <title>{ countyData[1].name }</title>
					                            <use xlinkHref={offshoreAllSvg+"#"+countyData[0]}></use>
						                        </g>
						                    );

					                	}
					                })
					            }

			                    <g style={{stroke:'#768d99', strokeWidth:'0.5px'}}>
			                      	<use xlinkHref={offshoreAllSvg+"#"+this.frontmatterData.unique_id+"-mesh"}></use>
			                    </g>

*/
