import React from 'react';
import Link from 'components/utils/temp-link';

import slugify from 'slugify';
import lazy from 'lazy.js';

import StickyHeader from 'components/layouts/StickyHeader';
import YearSelector from 'components/selectors/YearSelector';
import DataAndDocs from 'components/layouts/DataAndDocs';
import GlossaryTerm from 'components/utils/glossary-term.js';
import {filterTerms} from 'components/utils/Glossary';

import ChartTitle from 'components/charts/ChartTitle';

import COMMODITY_NAMES from 'data/commodity_names.yml';

import PRODUCTION_UNITS from '../../../static/data/production_units.yml';

// @todo: pass in years from data

// @todo: use graphql to import data
import ALL_PRODUCTION_DATA from '../../../static/data/national_all_production.yml';

const NationalAllProduction = (props) => {

    return (
        <section id="all-production" is="year-switcher-section" class="all-lands production">
            <StickyHeader headerText='Energy production nationwide'>
                <YearSelector years={[2016,2015,2014,2013,2012,2011,2010,2009,2008,2007]} classNames="flex-row-icon" />
            </StickyHeader>

            <div className="chart-selector-wrapper">

                <div className="chart-description">
                <p>
                    The Energy Information Administration collects data about energy-related natural resources produced on federal, state, and privately owned lands and waters. This data does not include information about nonenergy minerals.
                </p>
                <p>
                    <Link to="/downloads/#all-lands-and-waters" >
                        <DataAndDocs />
                    </Link>
                </p>
                </div>
            </div>
            

            {ALL_PRODUCTION_DATA.US.products !== undefined &&
            
                <div className="chart-list">

                    {(lazy(ALL_PRODUCTION_DATA.US.products).toArray()).map((product, index) => {
                        let year = '2016';
                        let productName = COMMODITY_NAMES[product[0]] || product[0];
                        let productSlug = slugify(productName, {lower:true});
                        let productVolumes = product[1].volume;
                        let units = product[1].units;
                        // product.productData.map((data, _index) => {
                        //     let yearVolume = lazy(data.item).omit(["name","region","units"]).values().toArray();
                        //     productVolumes[yearVolume[0]] = yearVolume[1];
                        //     year = yearVolume[0]; // Gets the last year in the set
                        //     units = data.item.units.toLowerCase();
                        // });
 
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
                                            <span className="eiti-bar-chart-y-value" data-format=",">{(productVolumes[year]).toLocaleString() }{" "}</span>
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
}

export default NationalAllProduction;