import React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import Helmet from 'react-helmet'
import Link, { withPrefix } from '../components/utils/temp-link'

import { hydrate as hydateDataManagerAction, groupByYear as groupDataSetsByYearAction } from '../state/reducers/data-sets'

import * as CONSTANTS from '../js/constants'

import hastReactRenderer from '../js/hast-react-renderer'

import utils from '../js/utils'

import SectionOffshoreProduction from '../components/locations/SectionOffshoreProduction'
import SectionOffshoreRevenue from '../components/locations/SectionOffshoreRevenue'

import { PageToc } from '../components/navigation/PageToc'
import GlossaryTerm from '../components/utils/glossary-term'
import RevenueTypeTable from '../components/locations/RevenueTypeTable'
import RevenueProcessTable from '../components/locations/RevenueProcessTable'
import StickyHeader from '../components/layouts/StickyHeader'
import { StickyWrapper } from '../components/utils/StickyWrapper'
import YearDropDown from '../components/selectors/DropDown'
import { DownloadDataLink } from '../components/layouts/icon-links/DownloadDataLink'
import StackedBarChartWithMap from '../components/layouts/charts/StackedBarChartWithMap'
import { ChartTitle } from '../components/charts/ChartTitle'
import { StackedBarChart } from '../components/charts/StackedBarChart'
import ChartSelectedContentDetails from '../components/charts/ChartSelectedContentDetails'
import OffshoreCountyMap from '../components/maps/CountyMaps'
import Legend from '../components/charts/Legend'

import DefaultLayout from '../components/layouts/DefaultLayout'

import styles from '../css-global/base-theme.module.scss'

const PRODUCTION_SYNC_ID = 'offshoreProduction'

class OffshoreRegion extends React.Component {
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
    let title = this.props.pageContext.markdown.frontmatter.title || 'Natural Resources Revenue Data'
    let regionId = this.props.pageContext.markdown.frontmatter.unique_id

    return (
      <DefaultLayout>
        <main id={'offshore-region-' + regionId} className="container-page-wrapper layout-state-pages">
          <Helmet
            title={title}
            meta={[
              // type
              { name: 'og:type', content: 'website' },

              // title
              { name: 'og:title', content: title + ' | Natural Resources Revenue Data' },
              { name: 'twitter:title', content: title + ' | Natural Resources Revenue Data' },

              // img
              { name: 'og:image', content: meta_image },
              { name: 'twitter:card', content: 'summary_large_image' },
              { name: 'twitter:image', content: meta_image },

              // description
              { name: 'og:description', content: 'This site provides open data about natural resource management on federal lands and waters in the United States, including oil, gas, coal, and other extractive industries.' },
              { name: 'twitter:description', content: 'This site provides open data about natural resource management on federal lands and waters in the United States, including oil, gas, coal, and other extractive industries.' },
            ]}

          />
          <section className="container">
            <Link to="/explore/" className="breadcrumb link-charlie">Explore data</Link> /
            <h1>{title}</h1>
            <div className="container-left-9">

              <section id="overview" className="section-top">
                <p>
                    Unlike land (which can be owned by states, local governments, corporations, or private individuals), the waters and submerged lands of the <GlossaryTerm>Outer Continental Shelf</GlossaryTerm> are entirely administered by the federal government. This means that all <Link to="/how-it-works/offshore-oil-gas/">offshore drilling</Link> and <Link to="/how-it-works/offshore-renewables/">renewable energy generation</Link> takes place in federal waters.
                </p>
              </section>
              <section id="production">
                <h2>Production</h2>
                <SectionOffshoreProduction usStateMarkdown={this.props.pageContext.markdown}
                  production={this.props.pageContext.commoditiesProduction}
                  countyProduction={this.props.pageContext.commoditiesOffshoreCode}
                  productionYears={this.props.pageContext.commodityProductionYears}/>

              </section>
              <section id="federal-revenue" is="year-switcher-section" class="federal revenue">
                <SectionOffshoreRevenue usStateMarkdown={this.props.pageContext.markdown}
                  commodities={this.props.pageContext.commodities}
                  commoditiesCounty={this.props.pageContext.commoditiesCounty}
                  commodityYears={this.props.pageContext.commodityYears}/>

              </section>
            </div>
            <MediaQuery minWidth={768}>
              <div className="container-right-3">
                <PageToc displayTitle={this.props.pageContext.markdown.frontmatter.title } excludeClassNames={['sticky-header-wrapper', 'chart-title']} scrollOffset={190}/>
              </div>
            </MediaQuery>
            <MediaQuery maxWidth={767}>
              <div style={{ position: 'absolute', width: '100%', top: '-45px' }}>
                <PageToc displayTitle={this.props.pageContext.markdown.frontmatter.title } excludeClassNames={['sticky-header-wrapper', 'chart-title']} scrollOffset={190}/>
              </div>
            </MediaQuery>
          </section>
        </main>
      </DefaultLayout>
    )
  }
}
export default connect(
  state => ({}),
  dispatch => ({
    hydateDataManager: dataSets => dispatch(hydateDataManagerAction(dataSets)),
    groupDataSetsByYear: configs => dispatch(groupDataSetsByYearAction(configs)),
  }))(OffshoreRegion)
