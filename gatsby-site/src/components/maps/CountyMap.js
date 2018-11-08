import React from 'react';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import Link from '../utils/temp-link';
import { withPrefixSVG } from 'components/utils/temp-link';

import lazy from 'lazy.js';

import VIEWBOXES from '../../data/viewboxes.yml'; 
import VIEWBOXES_CROPPED from '../../data/viewboxes_cropped.yml'; 

import iconPlus from '../../img/icons/icon-circled-plus.svg';
import iconMinus from '../../img/icons/icon-circled-minus.svg';

const CountyMap = (props) => {

    const usStateData = props.usStateMarkdown.frontmatter;
    const usStateFields = props.usStateMarkdown.fields || {};

	let localityName = usStateData.locality_name || 'County';

    let legendUnits = props.shortUnits || props.units;

    let viewBox = (usStateData.is_cropped)? VIEWBOXES_CROPPED[usStateData.unique_id] : VIEWBOXES[usStateData.unique_id];
    let viewBoxList;
    let breakpointWidth;
    let breakpointHeight;
    let height;
    let isWide = false;
    let mediaWidth = 65.88078;
    let dataDimensions;
    let eitiTooltipWrapper_Classlist = "svg-container county map-container";

    if(viewBox && viewBox.county) {
    	viewBox = viewBox.county;
    }

    if(viewBox) {
    	viewBoxList = viewBox.split(' ');
    	breakpointWidth = viewBoxList[2];
    	height = viewBoxList[3];
    	breakpointHeight = height*2.5;
    	isWide = (breakpointWidth > breakpointHeight);
    }

    mediaWidth = (isWide)? 100 : mediaWidth;
	eitiTooltipWrapper_Classlist = (isWide)? eitiTooltipWrapper_Classlist+" wide " : eitiTooltipWrapper_Classlist;
	dataDimensions = (height/breakpointWidth);
	let additionalPadding = dataDimensions*1.8;
	let paddingBottom = (mediaWidth*dataDimensions)+additionalPadding;

    let usStatesSVG = withPrefixSVG("/maps/states/all.svg");
    let usStateSVG = withPrefixSVG("/maps/states/"+usStateData.unique_id+".svg");

    function getNeighbors_Features() {
      let content = "";

      if(usStateData.neighbors){
        content = usStateData.neighbors.map((neighbor, index) => {
          return (<use key={index} xlinkHref={usStatesSVG+"#state-"+neighbor}></use>);
          
        }); 
      }
      else {
        content = <use xlinkHref={usStatesSVG+"#states"}></use>;
      }

      return content;
    }

    function getNeighbors_Mesh() {
      let content = "";

      if(usStateData.neighbors){
        content = usStateData.neighbors.map((neighbor, index) => {
          return (<use key={index} xlinkHref={usStatesSVG+"#state-"+neighbor}></use>);
          
        }); 
      }
      else {
        content = <use xlinkHref={usStatesSVG+"#states-mesh"}></use>;
      }

      return content;
    }


    let legend_Classlist = (isWide)? "legend-container wide" : "legend-container";

	return (
	<div>
		<div className="container">
			<div is="eiti-tooltip-wrapper"
				tooltip-style="subtle"
				cursor-offset="10"
				class={eitiTooltipWrapper_Classlist}
				data-dimensions={dataDimensions}
				style={{"paddingBottom": paddingBottom}} 
				>
				<svg className="county map" viewBox={ viewBox }>
                    <g className="states features">
                      	{getNeighbors_Features()}
                    </g>
                    <g className="states mesh">
                      	{getNeighbors_Mesh()}
                    </g>
                    <g className="counties features">
                      	<use xlinkHref={usStateSVG+"#counties"}></use>
                    </g>

		            {
		                (lazy(props.countyProductionData).toArray()).map((countyData, index) => {
		                	if(countyData[1].products[props.productKey]){
			                    return(
			                        <g key={index} 
			                            className="county feature" 
			                            data-fips={countyData[0]}
			                            data-value={countyData[1].products[props.productKey].volume[props.year]}
			                            data-year-values={JSON.stringify(countyData[1].products[props.productKey].volume)}
			                            >
			                            <title>{ countyData[1].name }</title>
			                            <use xlinkHref={usStateSVG+"#county-"+countyData[0]}></use>
			                        </g>
			                    );

		                	}
		                })
		            }

                    <g className="counties mesh">
                      	<use xlinkHref={usStateSVG+"#counties-mesh"}></use>
                    </g>

                    {
		                (lazy(props.countyProductionData).toArray()).map((countyData, index) => {
		                	if(countyData[1].products[props.productKey]){
			                    return(
			                        <g key={index} 
			                            className="county feature only-stroke" 
			                            data-fips={countyData[0]}
			                            data-value={countyData[1].products[props.productKey].volume[props.year]}
			                            data-year-values={JSON.stringify(countyData[1].products[props.productKey].volume)}
			                            >
			                            <title>{ countyData[1].name }</title>
			                            <use xlinkHref={usStateSVG+"#county-"+countyData[0]}></use>
			                        </g>
			                    );
			                }
		                })
                    }

                    <g className="state feature overlay">
                      	<use xlinkHref={usStatesSVG+"#state-"+usStateData.unique_id}></use>
                    </g>
				</svg>
			</div>

			<div className={legend_Classlist}>
				{props.isCaption &&
					<div>
						<figcaption className="legend-data">
							{localityName } production of {props.productName.toLowerCase()} in <span data-year={ props.year }>{ props.year }</span>
								{legendUnits && 
									<span className="legend-units"> ({legendUnits})</span>
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
	);

};

export default CountyMap;
