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

import iconCirclePlus from "img/icons/icon-circled-plus.svg";
import iconCircleMinus from "img/icons/icon-circled-minus.svg";

import COMMODITY_NAMES from 'data/commodity_names.yml';

import GLOSSARY_TERMS from 'data/terms.yml';

// @todo: pass in years from data
const years = [2017,2016,2015,2014,2013,2012,2011,2010,2009,2008];
const year = "2017";
const YEAR_RANGE = "[2008, 2017]";

// @todo: use graphql to import data
import FEDERAL_PRODUCTION_DATA from '../../../static/data/national_federal_production.yml';

import PRODUCTION_UNITS from '../../../static/data/production_units.yml';


const NationalFederalProduction = (props) => {
    let withHeldProducts = [];

    function verifyWithheldData(product){
        for(let i in years) {
            if(product[1].volume[years[i]] !== null && product[1].volume[years[i]] !== undefined) {
                return false;
            }
        }
        return true;
    }

    function getWithheldProductsHtml(){
        let withheldProductItems = [];

        for(let index in withHeldProducts){
            let yearString = "(";

            let yearsArray = lazy(withHeldProducts[index][1].volume).keys().toArray();

            let numbersAreConsecutive = true;
            for(var i = 1; i < yearsArray.length; i++) {
                if(parseInt(yearsArray[i]) - parseInt(yearsArray[i-1]) != 1) {
                    numbersAreConsecutive = false;
                    break;
                }
            }

            if(numbersAreConsecutive && yearsArray.length > 1){
                yearString += "'"+yearsArray[0].substring(2)+"-"+"'"+yearsArray[yearsArray.length-1].substring(2)+")";
            }
            else {
                yearsArray.map((year,index) => {
                    yearString += "'"+year.substring(2)+",";
                });
                yearString = yearString.substring(0, yearString.length-1)+")";
                
            }

            withheldProductItems.push(<li key={index}>{withHeldProducts[index][1].name || withHeldProducts[index][0]}{" "+yearString }</li>);
        }

        return withheldProductItems;
    }


    return (
        

        <section id="federal-production" is="year-switcher-section" className="federal production">

            <section className="county-map-table" is="year-switcher-section">
                <StickyHeader headerText='Production on federal land nationwide'>
                    <YearSelector years={years} classNames="flex-row-icon" />
                </StickyHeader>

                <div className="chart-selector-wrapper">
                    <div className="chart-description">
                        <p>
                            The Office of Natural Resources Revenue collects detailed data about natural resource <GlossaryTerm>production</GlossaryTerm> on federal lands and waters.
                        </p>
                        <p>
                            <Link to="/downloads/federal-production" >
                                <DataAndDocs />
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="chart-list">
                    {lazy(FEDERAL_PRODUCTION_DATA.US.products).toArray().map((product, index) => {
                        // Checks to verify if we have no data for a product for all years
                        let allYearsWithheld = verifyWithheldData(product); 
                        if(allYearsWithheld) {
                            withHeldProducts.push(product);
                            return; // return nothing if there is no data to display for this product
                        }

                        let productName = product[1].name || product[0];
                        let productSlug = slugify(product[0], {lower:true, remove: /[$*_+~.()'"!\-:@,]/g});
                        productSlug = productSlug.replace('/', '-');
                        let productionValues = product[1].volume;
                        let volume = productionValues[year];
                        let units = product[1].units.toLowerCase();
                        let shortUnits = PRODUCTION_UNITS[units] ? PRODUCTION_UNITS[units].short : units;
                        let longUnits = PRODUCTION_UNITS[units] ? PRODUCTION_UNITS[units].long : units;
                        let termUnits = PRODUCTION_UNITS[units] && PRODUCTION_UNITS[units].term;
                        let suffixUnits = PRODUCTION_UNITS[units] ? PRODUCTION_UNITS[units].suffix : '';
                        let titleUnits = PRODUCTION_UNITS[units] && PRODUCTION_UNITS[units].title;
                        let chartToggle = 'federal-production-figures-chart-'+productSlug;
                        let glossaryTerm = (termUnits) ? filterTerms(termUnits)[0] : termUnits;

                        return (
                            <section key={index} id={"national-federal-production-"+productSlug} className="product chart-item">
                                <ChartTitle 
                                    isIcon={true}
                                    units={longUnits}
                                    chartUnitsTitle ={titleUnits}
                                    chartValues={productionValues}
                                    chartToggle={chartToggle} >{productName}</ChartTitle>

                                <figure className="chart" id={chartToggle}>
                                    <eiti-bar-chart
                                        aria-controls={"national-federal-production-figures-"+productSlug+" national-federal-production-withheld" }
                                        data={JSON.stringify(productionValues)}
                                        x-range={YEAR_RANGE}
                                        x-value={2017}
                                        data-units={longUnits}>
                                    </eiti-bar-chart>
                                    <figcaption id={"national-federal-production-figures-"+productSlug }>
                                        <span className="caption-data">
                                            <span className="eiti-bar-chart-y-value" data-format=",">{productionValues[year] ? (productionValues[year]).toLocaleString() : 0}{' '}</span>
                                            {glossaryTerm ?
                                                <GlossaryTerm termKey={termUnits}>{longUnits}</GlossaryTerm> :
                                                longUnits
                                            }
                                            {' '}of {productName.toLowerCase()} {suffixUnits} were produced on federal land in <span className="eiti-bar-chart-x-value">{ year }</span>.
                                        </span>
                                        <span className="caption-no-data" aria-hidden="true">
                                            There is no data about production of {productName.toLowerCase()} {suffixUnits} on federal land in <span className="eiti-bar-chart-x-value">{ year }</span>.
                                        </span>
                                        <span className="caption-withheld" aria-hidden="true">
                                            Data about {productName.toLowerCase()} {suffixUnits} production on federal land in <span className="eiti-bar-chart-x-value">{ year }</span> is withheld.
                                        </span>
                                    </figcaption>
                                </figure>
                            </section>
                        );


                    })}

                    <section id="national-federal-production-withheld" className="product chart-item withheld-list">
                        <h3 className="chart-title">Data withheld</h3>
                        <p>
                            Production volume was <GlossaryTerm>withheld</GlossaryTerm> for the
                            following products:
                        </p>
                        <ul id="federal-production-withheld-products" className="expandable">
                            {getWithheldProductsHtml()}
                        </ul>
                        <button is="aria-toggle"
                                aria-expanded="false"
                                aria-toggles="aria-expanded"
                                aria-controls="federal-production-withheld-products"
                                className="aria-toggle-large aria-toggle-white">
                        <span className="hide-expanded">
                            <img className="aria-toggle-icon" alt="icon with a plus sign" src={iconCirclePlus}/>
                            Show all { withHeldProducts.length } {withHeldProducts.length > 1 ? " products" : " product"} 
                        </span>
                        <span className="show-expanded">
                            <img className="aria-toggle-icon" alt="icon with a minus sign" src={iconCircleMinus}/>
                            Close
                        </span>
                        </button>
                    </section>



                </div>
            </section>
        </section>
    );  
}

export default NationalFederalProduction;
