import React from 'react'
import Helmet from 'react-helmet'
import Link from '../components/utils/temp-link'
import { withPrefixSVG } from '../components/utils/temp-link'

import { DownloadDataLink } from '../components/layouts/icon-links/DownloadDataLink'

import DefaultLayout from '../components/layouts/DefaultLayout'
import GlossaryTerm from '../components/utils/glossary-term.js'

class HowItWorksRevenueByCompany extends React.Component {
  componentDidMount () {
    const script1 = document.createElement('script')

    script1.src = withPrefixSVG('/public/js/main.min.js')
    script1.async = false

    document.body.appendChild(script1)

    const script3 = document.createElement('script')

    script3.src = withPrefixSVG('/public/js/explore.min.js')
    script3.async = false

    document.body.appendChild(script3)

    const script2 = document.createElement('script')

    script2.src = withPrefixSVG('/public/js/company-revenue.min.js')
    script2.async = false

    document.body.appendChild(script2)
  }

  render () {
    const title = this.props.pathContext.markdown.frontmatter.title || 'Federal Revenue by Company'
    const reportYear = this.props.pathContext.markdown.frontmatter.report_year || 2018

    return (
      <DefaultLayout>
  			<div>
          <Helmet
            title={title}
            meta={[
              // title
              { name: 'og:title', content: title },
              { name: 'twitter:title', content: title },
            ]}

          />

          <section id="companies" data-year={reportYear} className="explore-subpage container container-margin">
            <section className="explore-subpage-nav container">
              <div className="explore-subpage-tabs">
                <ul>
                  <li className={(reportYear === 2013) ? 'explore-subpage-tab active' : 'explore-subpage-tab'}>
                    <Link to="/how-it-works/federal-revenue-by-company/2013/">2013</Link>
                  </li>
                  <li className={(reportYear === 2014) ? 'explore-subpage-tab active' : 'explore-subpage-tab'}>
                    <Link to="/how-it-works/federal-revenue-by-company/2014/">2014</Link>
                  </li>
                  <li className={(reportYear === 2015) ? 'explore-subpage-tab active' : 'explore-subpage-tab'}>
                    <Link to="/how-it-works/federal-revenue-by-company/2015/">2015</Link>
                  </li>
                  <li className={(reportYear === 2016) ? 'explore-subpage-tab active' : 'explore-subpage-tab'}>
                    <Link to="/how-it-works/federal-revenue-by-company/2016/">2016</Link>
                  </li>
                  <li className={(reportYear === 2017) ? 'explore-subpage-tab active' : 'explore-subpage-tab'}>
                    <Link to="/how-it-works/federal-revenue-by-company/2017/">2017</Link>
                  </li>
                  <li className={(reportYear === 2018) ? 'explore-subpage-tab active' : 'explore-subpage-tab'}>
                    <Link to="/how-it-works/federal-revenue-by-company/2018/">2018</Link>
                  </li>
                </ul>
              </div>
            </section>
            <section className="container-page-wrapper">
              <div className="container-left-4">
                <div>
                  <div>
                    <Link className="breadcrumb" to="/how-it-works/">How it works</Link>
                    /
                  </div>

                  <h1>Federal Revenue by Company</h1>

                  <p>Explore revenues on federal lands and waters in {reportYear} by commodity, revenue type, and company.</p>

                  <p>This data comes from the Department of the Interior's Office of Natural Resources Revenue and is calendar year data.</p>

                  <p>Choose a commodity or revenue type to filter the list of revenues. To search for a specific company, start typing the name of the company.</p>

                  <p>This is <GlossaryTerm>calendar year</GlossaryTerm> data.</p>

                  <DownloadDataLink to="/downloads/federal-revenue-by-company/">Downloads and documentation</DownloadDataLink>
                </div>
              </div>

              <div className="container-right-8">

                <div className="sticky sticky_nav sticky_nav-show_mobile filters-wrapper container" data-toggler="filters" aria-expanded="false">
                  <button class="toggle-filters toggle-desktop" is="eiti-toggle" aria-controls="filters" data-expanded-text="Hide filters" data-collapsed-text="Show filters" data-toggler="filters">Show filters</button>

                  <form id="filters" aria-hidden="true" className="filters">

                    <div className="filters-heading">
                      <h2 className="h3">Filter revenue</h2>
                    </div>

                    <div className="container-left-6">
                      <div id="commodity-filter" className="filter">
                        <label htmlFor="commodity-selector">Commodity</label>
                        <select id="commodity-selector" name="commodity">
                          <option value="">All commodities</option>
                        </select>
                      </div>
                    </div>

                    <div className="container-left-6" style={{ marginRight: 0 }}>
                      <div id="type-filter" className="filter filters-last">
                        <label htmlFor="type-selector">Revenue Type</label>
                        <select id="type-selector" name="type">
                          <option value="">All</option>
                        </select>
                      </div>
                    </div>

                  </form>

                  <h1 data-filter-description="" className="filter-description">
                    <span href="#type-selector" className="filter-part" data-key="type">All revenue</span>
                    {' '}from{' '}
                    <span href="#commodity-selector" className="filter-part" data-key="commodity">all commodities</span>
                    {' '}extraction on federal lands and waters ({reportYear})
                  </h1>

                  <div className="container">
                    <button class="toggle-filters toggle" is="eiti-toggle" aria-controls="filters" data-expanded-text="Hide filters" data-toggler="filters" data-collapsed-text="Show filters">Show filters</button>
                  </div>

                </div>

                <div className="filter-description_wrapper">
                  <h1 data-filter-description="" className="filter-description filter-description_open">
                    <span href="#type-selector" className="filter-part" data-key="type">All revenue</span>
                    from
                    <span href="#commodity-selector" className="filter-part" data-key="commodity">all commodities</span>
                    extraction on federal lands and waters ({reportYear})
                  </h1>
                </div>

                <div className="explore-exploration slab-alpha">

                  <div className="container">
                    <div className="filter-summary_title">
                      <h2 className="h3 region-title">Total revenues by type</h2>
                    </div>
                    <table id="revenue-types" className="revenue-type-list subregions">
                    </table>
                  </div>

                  <div className="container">
                    <section className="filter-search_section">
                      <h2 className="h3 region-title">Companies</h2>
                      <div className="filter-search_form">
                        <label htmlFor="company-name-filter">Filter by company name:</label>
                        <input className="filter-search" type="search" name="search" id="company-name-filter" />
                      </div>
                    </section>
                    <table id="companies" className="company-list subregions">
                    </table>
                  </div>

                </div>

              </div>
            </section>

          </section>

        </div>
      </DefaultLayout>
    )
  }
}
export default HowItWorksRevenueByCompany
