import React from 'react';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import Link from '../utils/temp-link';

import ALL_US_STATES_FEDERAL_PRODUCTION from '../../data/state_federal_production.yml'; 
import PRODUCTION_UNITS from '../../../static/data/production_units.yml';
import * as FEDERAL_COUNTY_PRODUCTION from '../../data/federal_county_production';

import ChartTitle from 'components/charts/ChartTitle';
import StickyHeader from 'components/layouts/StickyHeader';
import YearSelector from 'components/selectors/YearSelector';
import DataAndDocs from 'components/layouts/DataAndDocs';
import GlossaryTerm from 'components/utils/glossary-term.js';
import {filterTerms} from 'components/utils/Glossary';
import CountyMap from 'components/maps/CountyMap';

import utils from '../../js/utils';
import slugify from 'slugify';
import lazy from 'lazy.js';

let year = 2017;

const SectionFederalProduction = (props) => {
    const usStateData = props.usStateMarkdown.frontmatter;
    const usStateFields = props.usStateMarkdown.fields || {};

    const countyProductionForState = FEDERAL_COUNTY_PRODUCTION[usStateData.unique_id];

    const usStateFederalProducts = ALL_US_STATES_FEDERAL_PRODUCTION[usStateData.unique_id] && ALL_US_STATES_FEDERAL_PRODUCTION[usStateData.unique_id].products;

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
                        let productName = product[1].name || product[0];
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
                                            <eiti-data-map color-scheme="Blues" steps="4" units={units}>
                                                <CountyMap 
                                                    usStateMarkdown={props.usStateMarkdown} 
                                                    countyProductionData={countyProductionForState} 
                                                    productKey={product[0]}
                                                    year={year}
                                                    isCaption={true}
                                                    mapToggle={mapToggle}
                                                    productName={productName}
                                                    units={units}
                                                    shortUnits={shortUnits}/>



                                            </eiti-data-map>

                                            <div className="eiti-data-map-table" id={mapToggle} aria-hidden="true"> 
                                                <table is='bar-chart-table'
                                                    data-percent-max='100'
                                                    class='county-table'
                                                    year={year}>
                                                    <thead>
                                                        <tr>
                                                            <th>{usStateData.locality_name}</th>
                                                            <th colSpan='2' className='numeric' data-series='volume'>{ (longUnits.charAt(0).toUpperCase() + longUnits.slice(1))} of {productName.toLowerCase()}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr className="inner-table-row">
                                                            <td colSpan="3" className="inner-table-cell">
                                                                <div className="inner-table-wrapper">
                                                                    <table>
                                                                            {(lazy(countyProductionForState).toArray()).map((countyData, index) => {

                                                                                if(countyData[1].products[product[0]] && countyData[1].products[product[0]].volume[year] > 0){
                                                                                    let yearsValue = countyData[1].products[product[0]].volume;
                                                                                    let productVolume = countyData[1].products[product[0]].volume[year];

                                                                                    return(
                                                                                    <tbody key={index}>
                                                                                        <tr data-fips={countyData[0]} data-year-values={JSON.stringify(yearsValue)}>
                                                                                          <td><div className='swatch'
                                                                                                   data-value-swatch={productVolume}
                                                                                                   data-year-values={JSON.stringify(yearsValue)}></div>{ countyData[1].name }</td>
                                                                                          <td data-value-text={productVolume}
                                                                                              data-year-values={JSON.stringify(yearsValue)}>{utils.formatToCommaInt(productVolume)}</td>
                                                                                          <td className='numberless'
                                                                                              data-series='volume'
                                                                                              data-value={productVolume}
                                                                                              data-year-values={JSON.stringify(yearsValue)}>{utils.formatToCommaInt(productVolume)}</td>
                                                                                        </tr>
                                                                                        <tr data-fips={countyData[0]}>
                                                                                          <td colSpan='3'
                                                                                              data-year-values={JSON.stringify(yearsValue)}
                                                                                              data-sentence={productVolume}
                                                                                              aria-hidden='true'
                                                                                              data-withheld="false">
                                                                                              <span className="withheld" aria-hidden="true">
                                                                                                Data about { productName.toLowerCase() } extraction on federal land in { countyData[1].name } in <span data-year={ year }>{ year }</span> is withheld.
                                                                                              </span>
                                                                                              <span className="has-data">
                                                                                                <span data-value={productVolume}>{utils.formatToCommaInt(productVolume)}</span> {longUnits} of {productName.toLowerCase()} were produced in { countyData[1].name } in <span data-year={ year }>{year}</span>.
                                                                                              </span>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                    );

                                                                                }
                                                                            })}
                                                                    </table>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

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