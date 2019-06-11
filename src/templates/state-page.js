import React from 'react'
import Link from '../components/utils/temp-link'
import { withPrefix } from '../components/utils/temp-link'
import { withPrefixSVG } from '../components/utils/temp-link'

import Helmet from 'react-helmet'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser'
import { connect } from 'react-redux'

import NavList from '../components/layouts/NavList'
import StickyHeader from '../components/layouts/StickyHeader'
import { StickyWrapper } from '../components/utils/StickyWrapper'
import SectionOverview from '../components/locations/SectionOverview'
import SectionAllProduction from '../components/locations/SectionAllProduction'
import SectionFederalProduction from '../components/locations/SectionFederalProduction'
import SectionRevenue from '../components/locations/SectionRevenue'
import SectionDisbursements from '../components/locations/SectionDisbursements'
import StateDisbursements from '../components/locations/opt_in/StateDisbursements'
import SectionGDP from '../components/locations/SectionGDP'
import SectionJobs from '../components/locations/SectionJobs'
import SectionExports from '../components/locations/SectionExports'
import SectionStateGovernance from '../components/locations/SectionStateGovernance'
import MobileNav from '../components/layouts/MobileNav'
import GlossaryTerm from '../components/utils/glossary-term.js'

import ALL_US_STATES_PRODUCTION from '../data/state_all_production.yml'
import * as TOP_STATE_PRODUCTS from '../data/top_state_products'

import utils from '../js/utils'

import DefaultLayout from '../components/layouts/DefaultLayout'

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
        title: 'Federal land'
      },
      {
        name: 'state-production',
        title: 'State land'
      }
    ]
  },
  {
    name: 'revenue',
    title: 'Revenue',
    subNavItems: [
      {
        name: 'federal-revenue',
        title: 'Federal revenue'
      },
      {
        name: 'state-revenue',
        title: 'State revenue'
      }
    ]
  },
  {
    name: 'disbursements',
    title: 'Disbursements',
    subNavItems: [
      {
        name: 'federal-disbursements',
        title: 'Federal disbursements'
      },
      {
        name: 'state-disbursements',
        title: 'State disbursements'
      }
    ]
  },
  {
    name: 'state-governance',
    title: 'State Governance',
    subNavItems: [
      {
        name: 'understanding-land-ownership',
        title: 'Land ownership'
      },
      {
        name: 'state-agencies',
        title: 'State agencies'
      },
      {
        name: 'state-laws-and-regulations',
        title: 'State laws and regulations'
      },
      {
        name: 'fiscal-costs-of-extractive-activity',
        title: 'Fiscal costs'
      }
    ]
  }
]

class StatePages extends React.Component {
  constructor (props) {
    super(props)

    this.usStateMarkdown = props.pathContext.stateMarkdown
    this.usStateData = this.usStateMarkdown.frontmatter
    	this.usStateFields = this.usStateMarkdown.fields || {}
  }

  componentDidMount () {
    const script1 = document.createElement('script')

    script1.src = withPrefix('/public/js/main.min.js')
    script1.async = false

    document.body.appendChild(script1)

    const script2 = document.createElement('script')

    script2.src = withPrefix('/public/js/state-pages.min.js')
    script2.async = false

    document.body.appendChild(script2)
  }

  render () {
	    return (
      <DefaultLayout>
      <main id={'state-' + this.usStateData.unique_id} className="container-page-wrapper layout-state-pages">
	            <Helmet
	                title={this.usStateData.title + ' | Natural Resources Revenue Data'}
	                meta={[
	                    // title
	                    { name: 'og:title', content: (this.usStateData.title + ' | Natural Resources Revenue Data') },
	                    { name: 'twitter:title', content: (this.usStateData.title + ' | Natural Resources Revenue Data') },
	                ]}

	                />
        <section className="container">
          <div>
            <Link className="breadcrumb" to="/explore/">Explore data</Link> /
          </div>
          <h1 id="title">{this.usStateData.title}</h1>
          <div className="container-left-9">
            <section id="overview" className="section-top">

              <SectionOverview usStateMarkdown={this.usStateMarkdown} />

            </section>

            <MobileNav navItems={NAV_ITEMS} navTitle={this.usStateData.title} />

            <section id="production">
              <h2>Production</h2>

              <SectionFederalProduction usStateMarkdown={this.usStateMarkdown} />

              {this.usStateFields.state_land &&
								<div id="production-state-land">
								  <StickyWrapper bottomBoundary="#production-state-land" innerZ="10000">
									   <StickyHeader headerText={'Production on state land in ' + this.usStateData.title} />
								  </StickyWrapper>
								  { ReactHtmlParser(this.usStateFields.state_land) }
								</div>
              }

              { ReactHtmlParser(this.usStateFields.state_land_production) }

              <SectionRevenue usStateMarkdown={this.usStateMarkdown} />

              <section id="disbursements" className="disbursements">
                <h2>Disbursements</h2>

                <SectionDisbursements usStateMarkdown={this.usStateMarkdown} />

                <section id="state-disbursements" className="disbursements">
                  <StickyWrapper bottomBoundary="#state-disbursements" innerZ="10000">
									   <StickyHeader headerText='State disbursements' />
                  </StickyWrapper>
                  {this.usStateData.opt_in
                    ? <StateDisbursements usStateData={this.usStateData} usStateFields={this.usStateFields} />
                    :										<p>We don’t have detailed data about how states or local governments distribute revenue from natural resource extraction.</p>
                  }
                </section>
              </section>
              <section>
                <SectionStateGovernance usStateMarkdown={this.usStateMarkdown} />
              </section>
              <svg width="0" height="0">
                <defs>
                  <clipPath id="state-outline">
                    <use xlinkHref={withPrefixSVG('/maps/states/all.svg#state-' + this.usStateData.unique_id)}></use>
                  </clipPath>
                </defs>
              </svg>
            </section>
          </div>

          <div className="container-right-3 sticky sticky_nav sticky_nav-padded">
            <h3 className="state-page-nav-title container">
              <div className="nav-title">{this.usStateData.title}</div>
            </h3>
            <nav>
              <NavList navItems={NAV_ITEMS} />
            </nav>
          </div>
        </section>
      </main>
      </DefaultLayout>
	    )
  }
}

export default connect(
  state => ({}),
  dispatch => ({})
)(StatePages)

/* @TODO: replace hardcoded year value */
const KeyAllProductionSummary = props => {
  const usStateProducts = ALL_US_STATES_PRODUCTION[props.usStateData.unique_id].products
  const usStateTopProducts =
        (TOP_STATE_PRODUCTS[props.usStateData.unique_id] && TOP_STATE_PRODUCTS[props.usStateData.unique_id]['all_production'])
          ? TOP_STATE_PRODUCTS[props.usStateData.unique_id]['all_production'][2016] : undefined

  let getProductListItems = () => {
    return (
      <ul>
        {usStateTopProducts &&
                    usStateTopProducts.map((product, index) => {
                      return (<li key={index}>{utils.getDisplayName_CommodityName(product.name)}: #{product.rank} in the nation ({Math.floor(product.percent)}% of U.S. production)</li>)
                    })
        }
      </ul>
    )
  }

  return (
    <div>
      {usStateTopProducts &&
                <div>
                  <p>{props.usStateData.title} ranks among the top five states in the U.S. for production of:</p>
                  {getProductListItems()}
                </div>
      }
    </div>
  )
}
