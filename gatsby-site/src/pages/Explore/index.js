import React from 'react';

import NavList from 'components/layouts/NavList';
import MobileNav from 'components/layouts/MobileNav';
import StateMap from 'components/maps/StateMap';
import FederalLandOwnershipLegend from 'components/maps/FederalLandOwnershipLegend';
import LocationSelector from 'components/selectors/LocationSelector';
import GlossaryTerm from 'components/utils/glossary-term.js';
import NationalAllProduction from 'components/locations/NationalAllProduction';
import NationalFederalProduction from 'components/locations/NationalFederalProduction';
import NationalRevenue from 'components/locations/NationalRevenue';
import NationalGDP from 'components/locations/NationalGDP';
import NationalJobs from 'components/locations/NationalJobs';

import { withPrefix } from 'components/utils/temp-link';

const PAGE_ID = 'US';
const PAGE_TITLE = 'Explore data';
const NATIONAL_PAGE = true;
const NAV_TITLE = "Nationwide";
const NAV_ITEMS = [
    {
        name: "title",
        mobileName: "top",
        title: "Top"
    },
    {
        name: "production",
        title: "Production",
        subNavItems: [
            {
                name: "all-production",
                title: "Nationwide"
            },
            {
                name: "federal-production",
                title: "Federal lands and waters"
            }
        ]
    },
    {
        name: "revenue",
        title: "Revenue",
        subNavItems: [
            {
                name: "federal-revenue",
                title: "Federal land"
            },
            {
                name: "federal-tax-revenue",
                title: "Federal tax revenue"
            }
        ]
    },
    {
        name: "federal-disbursements",
        title: "Disbursements",
        subNavItems: [
            {
                name: "by-fund",
                title: "Disbursements by fund"
            }
        ]
    },
    {
        name: "economic-impact",
        title: "Economic impact",
        subNavItems: [
            {
                name: "gdp",
                title: "GDP"
            },
            {
                name: "employment",
                title: " Wage and salary jobs"
            },
            {
                name: "self-employment",
                title: "Self-employment"
            }
        ]
    }
];

class ExplorePage extends React.Component {

  componentDidMount() {
    const script1 = document.createElement("script");

    script1.src = withPrefix("/public/js/main.min.js");
    script1.async = false;

    document.body.appendChild(script1);

    const script2 = document.createElement("script");

    script2.src = withPrefix("/public/js/state-pages.min.js");
    script2.async = false;

    document.body.appendChild(script2);
  }

  render () {
    return (

        <main id="national" className="layout-state-pages national-page">
            <section  id="title" className="slab-delta">
                <div className="container-page-wrapper landing-section_top ribbon ribbon-column">
                    <div className="container-left-8 ribbon-hero ribbon-hero-column">
                        <h1>Explore data</h1>
                        <figure>
                            <StateMap 
                                ownership={true} 
                                no_outline={true} 
                                offshore_regions={this.props.data.offshore_data.offshore_regions} 
                                states={this.props.data.states_data.states}/>
                        </figure>
                        <aside className="wide">
                            <FederalLandOwnershipLegend land={true} />
                        </aside>
                    </div>
                    <div className="container-right-4 ribbon-card-column ribbon-card state_pages-ribbon-card">
                        <figure className="ribbon-card-top">
                            <h2 className="ribbon-card-top-text-header">Land ownership</h2>
                            <p>
                                Natural resource ownership, governance, and revenues are closely tied to land ownership. 
                                Federal land represents {this.props.data.land_stats_data.states[0].state_data.federal_percent}%
                                of all U.S. land, mostly concentrated in western states.
                            </p>
                            <p>
                                Data on this site covers production, revenue, and disbursements for <GlossaryTerm termKey="federal land">federal lands and waters
                                </GlossaryTerm>, as well as nationwide production and economic impact.
                            </p>
                        </figure>
                        <figcaption className="ribbon-card-bottom state_pages-select">
                            <label htmlFor="location-selector" className="ribbon-card-top-text-header">Explore state or offshore data:</label>
                            <LocationSelector 
                                default='Choose location' 
                                states={this.props.data.states_data.states}
                                offshore_regions={this.props.data.offshore_data.offshore_regions}/>
                        </figcaption>
                    </div>
                </div>
            </section>
            <section className="container-page-wrapper">
                <div className="container-left-9">

                    <MobileNav navItems={NAV_ITEMS} navTitle={NAV_TITLE} />

                    <section id="production">
                        <h2 className="state-page-overview">Production</h2>
                        <p>
                        The United States is among the world's top producers of natural gas, oil, and coal. The U.S. is also a global leader in renewable energy production.
                        </p>

                        <NationalAllProduction allProducts={this.props.data.US_Production.byProduct} />

                        <NationalFederalProduction allProducts={this.props.data.Federal_Production.byProduct} />

                    </section>

                    <NationalRevenue 
                        stateId={PAGE_ID} 
                        stateName={PAGE_TITLE}
                        isNationalPage={NATIONAL_PAGE} />

                    <section id="economic-impact">

                        <h2>Economic impact</h2>

                        <p>This data covers <GlossaryTerm termKey="Gross domestic product (GDP)">gross domestic product</GlossaryTerm> and two different types of jobs data.</p>

                        <NationalGDP />

                        <NationalJobs stateId={PAGE_ID} />

                    </section>

                </div>

                <div className="container-right-3 sticky sticky_nav sticky_nav-padded">
                    <h3 className="state-page-nav-title container">
                        <div className="nav-title">National data</div>
                    </h3>
                    <nav>
                        <NavList navItems={NAV_ITEMS} />
                    </nav>
                </div>


            </section>
        </main>
    );
  }
}

export default ExplorePage

export const query = graphql`
  query StateMapsQuery {
    offshore_data:allMarkdownRemark (filter:{id: {regex: "/offshore_regions/"}}) {
      offshore_regions:edges {
        offshore_region:node {
          frontmatter {
            title
            unique_id
            permalink
            is_cropped
          }
        }
      }
    }
    states_data:allMarkdownRemark (filter:{id: {regex: "/states/"}}) {
      states:edges {
        state:node {
          frontmatter {
            title
            unique_id
            is_cropped
          }
        }
      }
    }
    land_stats_data:allLandStatsYaml(filter:{state:{eq:"US"}}) {
      states:edges {
        state_data:node {
          state
          total_acres
          federal_acres
          federal_percent
        }
      }
    }
	US_Production:allAllProductionXlsxProducts(filter:{region:{eq:"US"}}) {
      byProduct:group(field:product){
        productName:fieldValue
        productData:edges{
          item:node {
            year
            region
            volume
            units
            name:product
          }
        }
      }
	}
    Federal_Production:allFederalProductionXlsxCyFederalProductionVolumes {
      byProduct:group(field: Product) {
        product_units:fieldValue
        productData:edges {
          item:node {
            volume:Production_Volume
            product_units:Product
          }
        }
      }
    }
  }
`;