import React from 'react';
import Link from 'components/utils/temp-link';

import slugify from 'slugify';
import lazy from 'lazy.js';

import StickyHeader from 'components/layouts/StickyHeader';
import YearSelector from 'components/selectors/YearSelector';
import DataAndDocs from 'components/layouts/DataAndDocs';

import COMMODITY_NAMES from 'data/commodity_names.yml';

// @todo: pass in years from data

const NationalAllProduction = (props) => {
    console.log(props);
    console.log("CommodityNames ",COMMODITY_NAMES);

     
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

                        let productName = COMMODITY_NAMES[product.productName] || product.productName;
                        let productSlug = slugify(productName, {lower:true});
                        let productVolumes = {};
                        product.productData.map((data, index) => {
                            let yearVolume = lazy(data.item).omit(["name","region","units"]).values().toArray();
                            productVolumes[yearVolume[0]] = yearVolume[1];
                        });

                        //console.log("productName",productName);
                        //console.log("productSlug",productSlug);
                        //console.log("productVolumes",productVolumes);

                        return (
                            <section id={"all-production-" + productSlug } className="chart-item">
                                {productName}
                            </section>
                        );

                    })}
  
                </div>
            
        
            }

        </section>
    );  
}

export default NationalAllProduction;