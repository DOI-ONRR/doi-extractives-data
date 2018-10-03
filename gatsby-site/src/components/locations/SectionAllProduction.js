import React from 'react';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import Link from '../utils/temp-link';

import ALL_US_STATES_PRODUCTION from '../../data/state_all_production.yml'; 
import PRODUCTION_UNITS from '../../../static/data/production_units.yml';

import ChartTitle from 'components/charts/ChartTitle';
import StickyHeader from 'components/layouts/StickyHeader';
import YearSelector from 'components/selectors/YearSelector';
import DataAndDocs from 'components/layouts/DataAndDocs';
import GlossaryTerm from 'components/utils/glossary-term.js';
import {filterTerms} from 'components/utils/Glossary';

import utils from '../../js/utils';
import slugify from 'slugify';
import lazy from 'lazy.js';

let year;

const SectionAllProduction = (props) => {
    const usStateData = props.usStateMarkdown.frontmatter;
    const usStateFields = props.usStateMarkdown.fields || {};

    const usStateProducts = ALL_US_STATES_PRODUCTION[usStateData.unique_id].products;

    

    return (
        <section id="all-production" is="year-switcher-section" className="all-lands production">
            <StickyHeader headerText={'Energy production in the entire state of '+usStateData.title}>
                <YearSelector years={[2016,2015,2014,2013,2012,2011,2010,2009,2008,2007]} classNames="flex-row-icon" />
            </StickyHeader>

			<div className="chart-selector-wrapper">
				<div className="chart-description">
					<p>
					The Energy Information Administration collects data about all energy-related natural resources produced on federal, state, and privately owned land.
					</p>
					<p>
						<Link to="/downloads/#all-lands-and-waters">
							<DataAndDocs />
						</Link>
					</p>
				</div>
			</div>

            {usStateProducts !== undefined &&
            
                <div className="chart-list">

                    {(lazy(usStateProducts).toArray()).map((product, index) => {
                        

                        let year = '2016';
                        let productName = utils.getDisplayName_CommodityName(product[0]);
                        let productSlug = slugify(productName, {lower:true});
                        let productVolumes = {};
                        let units = product[1].units;

                        (lazy(product[1].volume).toArray()).map((yearData, index) => {
                        	productVolumes[yearData[0]] = yearData[1].volume; 
                        });

                        let shortUnits = PRODUCTION_UNITS[units] ? PRODUCTION_UNITS[units].short : units;
                        let longUnits = PRODUCTION_UNITS[units] ? PRODUCTION_UNITS[units].long : units;
                        let termUnits = PRODUCTION_UNITS[units] && PRODUCTION_UNITS[units].term;
                        let suffixUnits = PRODUCTION_UNITS[units] ? PRODUCTION_UNITS[units].suffix : '';
                        let glossaryTerm = (termUnits) ? filterTerms(termUnits)[0] : termUnits;

                        let chartToggle = 'all-production-figures-chart-'+productSlug;

                        return (
                            <section key={index} id={"all-production-" + productSlug } className="chart-item">
                                <ChartTitle 
                                    isIcon={true}                                   
                                    units={longUnits}
                                    chartValues={productVolumes}
                                    chartToggle={chartToggle} >{productName}</ChartTitle>

                                <figure className="chart" id={chartToggle}>
                                    <eiti-bar-chart
                                        aria-controls={"all-production-figures-"+productSlug }
                                        data={JSON.stringify(productVolumes)}
                                        x-range="[2007, 2016]"
                                        x-value={2016}
                                        data-units={longUnits}>
                                    </eiti-bar-chart>
                                    <figcaption id={"all-production-figures-"+productSlug }>
                                        <span className="caption-data">
                                            <span className="eiti-bar-chart-y-value" data-format=",">{(productVolumes[year])? (productVolumes[year]).toLocaleString() : ("0").toLocaleString() }{" "}</span>
                                            {glossaryTerm ?
                                                <GlossaryTerm termKey={termUnits}>{longUnits}</GlossaryTerm> :
                                                longUnits
                                            }{' '}of {productName.toLowerCase()} {suffixUnits}
                                            were produced in {' '}
                                            <span className="eiti-bar-chart-x-value">{ year }</span>.
                                        </span>
                                        <span className="caption-no-data" aria-hidden="true">
                                            There is no data about production of {productName.toLowerCase()} {suffixUnits} in{' '}
                                            <span className="eiti-bar-chart-x-value">{ year }</span>.
                                        </span>
                                    </figcaption>
                                </figure>

                            </section>
                        );

                    })}
  
                </div>
            
        
            }

        </section>
    );
};

export default SectionAllProduction;