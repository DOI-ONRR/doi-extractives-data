import React from 'react';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import Link from '../utils/temp-link';

import ALL_US_STATES_FEDERAL_PRODUCTION from '../../data/state_federal_production.yml'; 
import PRODUCTION_UNITS from '../../../static/data/production_units.yml';

import ChartTitle from 'components/molecules/ChartTitle';
import StickyHeader from 'components/layouts/StickyHeader';
import YearSelector from 'components/atoms/YearSelector';
import DataAndDocs from 'components/layouts/DataAndDocs';
import GlossaryTerm from 'components/utils/glossary-term.js';
import {filterTerms} from 'components/utils/Glossary';

import utils from '../../js/utils';
import slugify from 'slugify';
import lazy from 'lazy.js';

let year = 2017;

const SectionFederalProduction = (props) => {
    const usStateData = props.usStateMarkdown.frontmatter;
    const usStateFields = props.usStateMarkdown.fields || {};

    const usStateFederalProducts = ALL_US_STATES_FEDERAL_PRODUCTION[usStateData.unique_id].products;

    return (
        <section id="federal-production" className="federal production">

            <section className="county-map-table" is="year-switcher-section">
                <StickyHeader headerText={'Energy production in the entire state of '+usStateData.title}>
                    <YearSelector years={[2017,2016,2015,2014,2013,2012,2011,2010,2009,2008]} classNames="flex-row-icon" />
                </StickyHeader>

                { usStateFederalProducts === undefined ?
                    <div>
                        <p>
                          The Office of Natural Resources Revenue collects detailed data about natural resources produced on federal land. According to that data, there was no natural resource <GlossaryTerm>production</GlossaryTerm> on federal land in {usStateData.title} in { year }.
                        </p>
                        <p>
                            <Link to="/downloads/federal-production/">
                                <DataAndDocs />
                            </Link>
                        </p>
                    </div>
                    :
                    <div className="chart-selector-wrapper">
                        <div className="chart-description">
                            <p>
                                The Office of Natural Resources Revenue collects detailed data about natural resource <GlossaryTerm>production</GlossaryTerm> on federal land in {usStateData.title}.
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
                    {(lazy(usStateFederalProducts).toArray()).map((product, index) => {
                        

                        let year = '2017';
                        let productName = utils.getDisplayName_CommodityName(product[0]);
                        let productSlug = utils.formatToSlug(productName, {lower:true});
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

                        let chartToggle = 'federal-production-figures-chart-'+productSlug;

                        /* Start County Map Variables */
                        let mapToggle = 'federal-production-'+ productSlug +'-counties';

                        return (
                            <section key={index} id={"federal-production-" + productSlug } className="product full-width">
                                <div className="row-container">

                                    <div className="chart-container">
                                        <ChartTitle 
                                            isIcon={true}                                   
                                            units={longUnits}
                                            chartValues={productVolumes}
                                            chartToggle={chartToggle} >{productName}</ChartTitle>

                                        <figure className="chart" id={chartToggle}>
                                            <eiti-bar-chart
                                                aria-controls={"federal-production-figures-"+productSlug }
                                                data={JSON.stringify(productVolumes)}
                                                x-range="[2008, 2017]"
                                                x-value={2017}
                                                data-units={longUnits}>
                                            </eiti-bar-chart>
                                            <figcaption id={"federal-production-figures-"+productSlug }>
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
                                    </div>


                                    <div className="map-container">

                                        <h4 className="chart-title">
                                            { usStateData.locality_name } production
                                        </h4>

                                        <figure is="eiti-data-map-table">


                                        </figure>
                                    </div>

                                </div>

                            </section>
                        );

                    })}
                </div>
            </section>

        </section>
    );
};

export default SectionFederalProduction;