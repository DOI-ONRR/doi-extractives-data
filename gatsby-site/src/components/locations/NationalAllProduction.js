import React from 'react';
import Link from 'components/utils/temp-link';

import slugify from 'slugify';
import lazy from 'lazy.js';

import StickyHeader from 'components/layouts/StickyHeader';
import YearSelector from 'components/selectors/YearSelector';
import DataAndDocs from 'components/layouts/DataAndDocs';

import ChartTitle from 'components/charts/ChartTitle';

import COMMODITY_NAMES from 'data/commodity_names.yml';

// @todo: pass in years from data

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
            

            {props.allProducts !== undefined &&
            
                <div className="chart-list">

                    {(props.allProducts).map((product, index) => {
                        //console.log(product);
                        let _year = '2016';
                        let _productName = COMMODITY_NAMES[product.productName] || product.productName;
                        let _productSlug = slugify(_productName, {lower:true});
                        let _productVolumes = {};
                        product.productData.map((data, index) => {
                            let yearVolume = lazy(data.item).omit(["name","region","units"]).values().toArray();
                            _productVolumes[yearVolume[0]] = yearVolume[1];
                            _year = yearVolume[0]; // Gets the last year in the set
                        });
                        let _chartToggle = 'all-production-figures-chart-'+_productSlug;
                        let _volume = _productVolumes

                        //console.log("productName",_productName);
                        //console.log("productSlug",_productSlug);
                        //console.log("productVolumes",_productVolumes);

                        return (
                            <section key={index} id={"all-production-" + _productSlug } className="chart-item">
                                <ChartTitle 
                                    isIcon={true}
                                    chartValues={_productVolumes}
                                    chartToggle={_chartToggle} >{_productName}</ChartTitle>


                                <figure className="chart" id={_chartToggle}>
                                    <eiti-bar-chart
                                        aria-controls={"all-production-figures-"+_productSlug }
                                        data={JSON.stringify(_productVolumes)}
                                        x-range="[2007, 2016]"
                                        x-value={2016}
                                        data-units="long_units">
                                    </eiti-bar-chart>
                                    <figcaption id={"all-production-figures-"+_productSlug }>
                                        <span className="caption-data">
                                            <span className="eiti-bar-chart-y-value" data-format=",">{(_productVolumes[_year]).toLocaleString() }</span>
                                            long units of
                                            were produced in
                                            <span className="eiti-bar-chart-x-value">{ _year }</span>.
                                        </span>
                                        <span className="caption-no-data" aria-hidden="true">
                                            There is no data about production of  in
                                            <span className="eiti-bar-chart-x-value">{ _year }</span>.
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