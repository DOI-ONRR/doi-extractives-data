import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'

import { hydateDisbursements as hydateDisbursementsAction } from '../../state/reducers/disbursements'

import MobileNav from '../../components/layouts/MobileNav'
import { PageToc } from '../../components/navigation/PageToc'
import StateMap from '../../components/maps/StateMap'
import FederalLandOwnershipLegend from '../../components/maps/FederalLandOwnershipLegend'
import LocationSelector from '../../components/selectors/LocationSelector'
import GlossaryTerm from '../../components/utils/glossary-term.js'
import NationalFederalProduction from '../../components/locations/NationalFederalProduction'
import NationalRevenue from '../../components/locations/NationalRevenue'
import NationalDisbursements from '../../components/sections/NationalDisbursements'

import { withPrefixSVG } from '../../components/utils/temp-link'

import DefaultLayout from '../../components/layouts/DefaultLayout'

const PAGE_ID = 'US'
const PAGE_TITLE = 'Explore data'
const NATIONAL_PAGE = true
const NAV_TITLE = 'Nationwide'
const NAV_ITEMS = [
  {
    name: 'title',
    mobileName: 'top',
    title: 'Top'
  },
  {
    name: 'production',
    title: 'Production',
    subNavItems: [
      {
        name: 'federal-production',
        title: 'Federal lands and waters'
      }
    ]
  },
  {
    name: 'revenue',
    title: 'Revenue',
    subNavItems: [
      {
        name: 'federal-revenue',
        title: 'Federal land'
      },
    ]
  },
  {
    name: 'federal-disbursements',
    title: 'Disbursements',
    subNavItems: [
      {
        name: 'by-fund',
        title: 'Disbursements by recipient'
      }
    ]
  },
]

class ExplorePage extends React.Component {
  constructor (props) {
    super(props)

    this.hydrate()
  }

  hydrate () {
    this.props.hydateDisbursements(this.props.data.Federal_Disbursements.byYear)
  }

  componentDidMount () {
    const script1 = document.createElement('script')

    script1.src = withPrefixSVG('/public/js/main.min.js')
    script1.async = false

    document.body.appendChild(script1)

    const script2 = document.createElement('script')

    script2.src = withPrefixSVG('/public/js/state-pages.min.js')
    script2.async = false

    document.body.appendChild(script2)
  }

  render () {
    return (
      <DefaultLayout>
        <main id="main-content" className="layout-state-pages national-page">
          <Helmet
            title="Explore data | Natural Resources Revenue Data"
            meta={[
              // title
              { name: 'og:title', content: 'Explore data | Natural Resources Revenue Data' },
              { name: 'twitter:title', content: 'Explore data | Natural Resources Revenue Data' },
            ]}

          />

          <section id="title" className="slab-delta">
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
                    </GlossaryTerm>.
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

              <section>
                <h2 className="state-page-overview">Production</h2>

                <NationalFederalProduction allProducts={this.props.data.FederalProductionByProduct.group} allYears={this.props.data.FederalProductionByYear.group}/>

              </section>

              <NationalRevenue
                stateId={PAGE_ID}
                stateName={PAGE_TITLE}
                isNationalPage={NATIONAL_PAGE}
                revenueGroupByCommodity={this.props.data.RevenueGroupByCommodity.group}
                revenueGroupByCalendarYear={this.props.data.RevenueGroupByCalendarYear.group} />

              <NationalDisbursements />

            </div>

            <div className="container-right-3 sticky sticky_nav sticky_nav-padded">
              <PageToc displayTitle="national data" bottomBoundary="main-body" excludeClassNames={['ribbon-card-top-text-header', 'chart-title']}/>
            </div>

          </section>
        </main>
      </DefaultLayout>
    )
  }
}

export default connect(
  state => ({}),
  dispatch => ({ hydateDisbursements: disbursements => dispatch(hydateDisbursementsAction(disbursements)) })
)(ExplorePage)

// eslint-disable-next-line no-undef
export const query = graphql`
  query StateMapsQuery {
    offshore_data:allMarkdownRemark (filter:{fileAbsolutePath: {regex: "/offshore_regions/"}} sort:{fields: [frontmatter___title], order: ASC}) {
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
    states_data:allMarkdownRemark (filter:{fileAbsolutePath: {regex: "/states/"}} sort:{fields: [frontmatter___title], order: ASC}) {
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
    FederalProductionByProduct:  allProductVolumesCalendarYear (filter:{LandCategory:{eq:"Federal"}}){
      group(field: ProductName) {
        id: fieldValue
        edges {
          node {
            id
            ProductName
            ProductionDate
            ProductionYear
            Units
            LongUnits
            Volume
            Withheld
            LandCategory
          }
        }
      }
    }
    FederalProductionByYear:allProductVolumesCalendarYear (filter:{LandCategory:{eq:"Federal"}}){
      group(field: ProductionYear) {
        id: fieldValue
        edges {
          node {
            id
          }
        }
      }
    }
    Federal_Disbursements:allFederalDisbursements {
      byYear:group(field:Year){
        Year:fieldValue
        disbursements:edges {
          disbursement:node {
            Year
            Fund
            Source
            Disbursement
          }
        }
      }
    }
    RevenueGroupByCalendarYear:allResourceRevenuesCalendarYear (filter:{
    LandClass: {ne: "Native American"}}){
      group(field: CalendarYear) {
        id:fieldValue
        edges {
          node {
            id
          }
        }
      }
    }
    RevenueGroupByCommodity:allResourceRevenuesCalendarYear (filter:{
    LandClass: {ne: "Native American"}}){
      group(field: Commodity) {
        id:fieldValue
        edges {
          node {
            id
            Commodity
            Revenue
            CalendarYear
            RevenueType
          }
        }
      }
    }
  }
`
