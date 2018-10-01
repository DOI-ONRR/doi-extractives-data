import React from 'react';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import Link from '../utils/temp-link';
import { withPrefixSVG } from 'components/utils/temp-link';

import ALL_US_STATES_GDP from '../../data/state_gdp.yml'; 
import ALL_US_STATES_JOBS from '../../data/state_jobs.yml'; 
import ALL_US_STATES_PRODUCTION from '../../data/state_all_production.yml'; 
import * as TOP_STATE_PRODUCTS from '../../data/top_state_products';
import LAND_STATS from '../../data/land_stats.yml'; 

import FederalLandOwnershipLegend from '../maps/FederalLandOwnershipLegend';
import FederalLandOwnershipSvg from '../maps/FederalLandOwnershipSvg';
import GlossaryTerm from 'components/utils/glossary-term.js';

import utils from '../../js/utils';

import rehypeReact from "rehype-react";

const renderAst = new rehypeReact({
  createElement: React.createElement,
  components: { "glossary-term": GlossaryTerm },

}).Compiler; 

let year;

const SectionOverview = (props) => {
    const usStateData = props.usStateMarkdown.frontmatter;
    const usStateFields = props.usStateMarkdown.fields || {};

    return (
        <section className="state-pages-top">

            <section className="container">

                <div className="state-pages-ownership container-right-5">
                    <SectionOwnership usStateData={usStateData}/>
                </div>
                
                <KeyGDPJobs usStateData={usStateData}/>

                <KeyAllProduction usStateData={usStateData} />

                <FederalLandInfo usStateData={usStateData} />

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
    );
};

export default SectionOverview;

/* TODO: Add SVG */
const SectionOwnership = (props) => {
    let usStatesSVG = withPrefixSVG("/maps/states/all.svg");
    let usStateSVG = withPrefixSVG("/maps/states/"+props.usStateData.unique_id+".svg");

    function getNeighbors_Features() {
      let content = "";

      if(props.usStateData.neighbors){
        content = props.usStateData.neighbors.map((neighbor, index) => {
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

      if(props.usStateData.neighbors){
        content = props.usStateData.neighbors.map((neighbor, index) => {
          return (<use key={index} xlinkHref={usStatesSVG+"#state-"+neighbor}></use>);
          
        }); 
      }
      else {
        content = <use xlinkHref={usStatesSVG+"#states-mesh"}></use>;
      }

      return content;
    }

    return (
        <section className="container land-ownership">

            <h3 className="title-land-ownership">Land ownership</h3>
            <aside className="map-container" style={{"width": "100%"}}>
                <figure is="ownership-map">
                    <div className="svg-container county map-container wide"
                    style={{"paddingBottom": "235.85px"}}>
                      <svg className="county ownership map state-page" viewBox="49 441 245 115">
                        <g className="states features">
                          {getNeighbors_Features()}
                        </g>
                        <g className="states mesh">
                          {getNeighbors_Mesh()}
                        </g>
                        <g className="counties features">
                          <use xlinkHref={usStateSVG+"#counties"}></use>
                        </g>
                        <FederalLandOwnershipSvg clip='#state-outline'/>
                        <g className="counties mesh">
                          <use xlinkHref={usStateSVG+"#counties-mesh"}></use>
                        </g>
                        <g className="state feature overlay">
                          <use xlinkHref={usStatesSVG+"#state-"+props.usStateData.unique_id}></use>
                        </g>
                      </svg>
                    </div>

                </figure>

                <aside className="wide" style={{"clear":"both"}}>
                  <FederalLandOwnershipLegend />
                </aside>

            </aside>
        </section>
    );
};

/* Includes the GDP percentage, then outputs employment percentage if it’s over 2%. */
const KeyGDPJobs = (props) => {
    const usStateGDP = ALL_US_STATES_GDP[props.usStateData.unique_id];
    year = Math.max(...Object.keys(usStateGDP));
    const usStateJobs = ALL_US_STATES_JOBS[props.usStateData.unique_id];

    return (
        <p>
            Natural resource extraction varies widely from state to state.{' '}
            {(usStateGDP[year].dollars > 0) ?
                <span>
                    In {props.usStateData.title}, extractive industries accounted for <a href="#gdp">{ utils.round(usStateGDP[year].percent, 1) }% of gross domestic product</a> (GDP) in {year}
                    { (usStateJobs[year].percent > 2) &&
                        <span>
                            , and jobs in the extractive industries made up <a href="#employment">{utils.round(usStateJobs[year].percent, 1)}% of statewide employment</a>
                        </span> 
                    }
                    .
                </span>
                :
                <span>
                    Extractive industries did not have any effect on gross domestic product (GDP) in
                    {props.usStateData.title} in {year}.
                </span>
            }
        </p>
    );
}

/* If the state leads U.S. production for any commodities, those commodities are listed along with percentage of US production. */
const KeyAllProduction = (props) => {
    const usStateProducts = ALL_US_STATES_PRODUCTION[props.usStateData.unique_id].products;
    const usStateTopProducts = TOP_STATE_PRODUCTS[props.usStateData.unique_id]['all_production'][year];

    let productsRankedOne = [];
    if(usStateTopProducts){
        usStateTopProducts.map((product, index ) => {
            if(product.rank === 1){
                productsRankedOne.push(product);
            }
        })
    }

    let getProductListItems = () => {
        return (
            <ul>
                {productsRankedOne &&
                    productsRankedOne.map((product, index) => {
                        return (<li  key={index}>{utils.getDisplayName_CommodityName(product.name)}: {utils.round(product.percent, 1)}% of U.S. Production</li>)
                    })
                }       
            </ul>
        );
    }

    return (
        <div>
            {productsRankedOne &&
                <div>
                    <p>{props.usStateData.title} leads the nation in production of:</p>
                    {getProductListItems()}
                </div>
            }
        </div>
    );
}

/* Sets up the federal-land focus of USEITI data, specifies what percentage of land is federally owned, and outputs the total revenue from federal land.*/

const FederalLandInfo = (props) => {
  return (
    <p>
      Natural resource ownership in the U.S. is closely tied to land ownership. Land can be owned by citizens, corporations, Indian tribes or individuals, or governments (for instance, federal, state, or local governments). Much of the data on this site is limited to natural resource extraction on federal land, which represents {utils.round(LAND_STATS[props.usStateData.unique_id].federal_percent, 1)}%
      of all land in {props.usStateData.title}.
    </p>
  );
}


/* Includes link to relevant offshore region, if there is one */
const OffshoreRegion = (props) => {
  console.log(props.usStateData.nearby_offshore_region);
  return (
    <p>
      {props.usStateData.title} also borders an offshore area with significant natural resource extraction, which may contribute to the state’s economy. For production and revenue data about offshore extraction near {props.usStateData.title}, see {ReactHtmlParser(props.usStateData.nearby_offshore_region)}.
    </p>
  );
}

/* Blurb for opt-in states*/
const OptIn = (props) => {
  return (
      <div>
        <p>
          The state of {props.usStateData.title} chose to participate in an extended reporting process, so this page includes additional <a href="#state-local-revenue">state revenue</a> and <a href="#state-disbursements">disbursements</a> data, as well as contextual information about <a href="#state-governance">state governance</a> of natural resources.
        </p>
        {props.optInIntroHtml &&
          <div>
            {ReactHtmlParser(props.optInIntroHtml)}
          </div>
        }
      </div>
  ); 
}

/* Includes case study link, if there is one */
const CaseStudyLink = (props) => {
  console.log(JSON.parse(props.caseStudyHtml));
  return (
    <div>
      {renderAst(JSON.parse(props.caseStudyHtml))}
    </div>
  );
}  







/*
<section class="container land-ownership">

  <h3 class="title-land-ownership">Land ownership</h3>

  {% assign __viewbox = site.data.viewboxes_cropped[state_id] %}

  {% if __viewbox['ownership'] %}
    {% assign __viewbox = __viewbox['ownership'] %}
  {% endif %}

  <aside class="map-container" style="width: 100%;">
    <figure is="ownership-map">
      <div class="svg-container county map-container wide"{% if __viewbox %}
        style="padding-bottom: {{ __viewbox | svg_viewbox_padding: _width }}%;"{% endif %}>
        <svg class="county ownership map state-page"{% if __viewbox %} viewBox="{{ __viewbox }}"{% endif %}>
          <g class="states features">
            {% if page.neighbors %}
              {% for neighbor in page.neighbors %}
            <use xlink:href="{{ states_svg }}#state-{{ neighbor }}"></use>
              {% endfor %}
            {% else %}
            <use xlink:href="{{ states_svg }}#states"></use>
            {% endif %}
          </g>
          <g class="states mesh">
            {% if page.neighbors %}
              {% for neighbor in page.neighbors %}
            <use xlink:href="{{ states_svg }}#state-{{ neighbor }}"></use>
              {% endfor %}
            {% else %}
            <use xlink:href="{{ states_svg }}#states-mesh"></use>
            {% endif %}
          </g>
          <g class="counties features">
            <use xlink:href="{{ state_svg }}#counties"></use>
          </g>
          {%
            include maps/federal_land_ownership.svg
            clip='#state-outline'
          %}
          <g class="counties mesh">
            <use xlink:href="{{ state_svg }}#counties-mesh"></use>
          </g>
          <g class="state feature overlay">
            <use xlink:href="{{ states_svg }}#state-{{ state_id }}"></use>
          </g>
        </svg>
      </div>

    </figure>

    <aside class="wide" style="clear:both;">
      {% include maps/federal_land_ownership_legend.html %}
    </aside>

  </aside>
</section>
*/



/*
<section class="state-pages-top">

  <section class="container">

    <div class="state-pages-ownership container-right-5">
      {% include location/section-ownership.html %}
    </div>

    <!-- Includes the GDP percentage, then outputs employment percentage if it’s over 2%.-->
    <p>
      Natural resource extraction varies widely from state to state.
      {%
        include location/key-gdp-jobs.html
        location_id=state_id
        location_name=state_name
        year=year
      %}
    </p>

    <!-- If the state leads U.S. production for any commodities, those commodities are listed along with percentage of US production. -->
    <p>
      {%
        include location/key-all-production.html
        location_id=state_id
        location_name=state_name
        year=year
        top=top_products
      %}
    </p>

    <!-- Sets up the federal-land focus of USEITI data, specifies what percentage of land is federally owned, and outputs the total revenue from federal land. -->
    <p>
      Natural resource ownership in the U.S. is closely tied to land ownership. Land can be owned by citizens, corporations, Indian tribes or individuals, or governments (for instance, federal, state, or local governments). Much of the data on this site is limited to natural resource extraction on federal land, which represents
      {{ site.data.land_stats[state_id].federal_percent | percent }}%
      of all land in {{ state_name }}.
    </p>

    <!-- Includes link to relevant offshore region, if there is one -->
    {% if page.nearby_offshore_region %}
    <p>
      {{ state_name }} also borders an offshore area with significant natural resource extraction, which may contribute to the state’s economy. For production and revenue data about offshore extraction near {{ state_name }}, see {{ page.nearby_offshore_region | liquify }}.
    </p>
    {% endif %}

    <!-- Blurb for opt-in states -->
    {% if is_opt_in_state %}
      <p>
        The state of {{ state_name }} chose to participate in an extended reporting process, so this page includes additional <a href="#state-local-revenue">state revenue</a> and <a href="#state-disbursements">disbursements</a> data, as well as contextual information about <a href="#state-governance">state governance</a> of natural resources.
      </p>
      {% if page.state_optin_intro %}
        {{ page.state_optin_intro | liquify | markdownify }}
      {% endif %}
    {% endif %}

    <!-- Includes case study link, if there is one -->
    {% if page.case_study_link %}
      {{ page.case_study_link | liquify | markdownify }}
    {% endif %}

  </section>

</section>

*/