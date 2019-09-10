import React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import Helmet from 'react-helmet'
import Link, { withPrefix } from '../components/utils/temp-link'

import { hydrate as hydateDataManagerAction, groupByYear as groupDataSetsByYearAction } from '../state/reducers/data-sets'

import * as CONSTANTS from '../js/constants'

import hastReactRenderer from '../js/hast-react-renderer'

import utils from '../js/utils'

import { PageToc } from '../components/navigation/PageToc'
import GlossaryTerm from '../components/utils/glossary-term'
import StickyHeader from '../components/layouts/StickyHeader'
import { StickyWrapper } from '../components/utils/StickyWrapper'
import YearDropDown from '../components/selectors/YearDropDown'
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

const PRODUCTION_BY_YEAR_CONFIG = {
  options: {
    includeDisplayNames: true,
    selectedDataKeyIndex: 'last',
    syncId: PRODUCTION_SYNC_ID,
  },
  filter: {
    sumBy: 'Commodity',
  }
}

const CHART_STYLE_MAP = {
  'bar': styles.chartBar,
}

const MAX_CHART_BAR_SIZE = 29.6

class OffshoreRegion extends React.Component {
  constructor (props) {
    super(props)
    this.region = this.props.pageContext.markdown.frontmatter.unique_id
    this.dataSetsProduction = []
    this.productionComponents = []
    this.hydrate()
  }

  hydrate () {
    let dataSetsToHydrate = []
    let dataSetsToGroupByYear = []

    this.props.pageContext.data.commodities.map(commodity => {
      let dataSetId = PRODUCTION_SYNC_ID + '_' + commodity.name
      let units = commodity.volumes[0].data.Units
      this.addProductionComponents(dataSetId, commodity.name, units)

      this.dataSetsProduction.push({ id: dataSetId, title: commodity.name })

      dataSetsToHydrate.push({ key: dataSetId, data: commodity.volumes })

      dataSetsToGroupByYear.push({ id: dataSetId, sourceKey: dataSetId, ...PRODUCTION_BY_YEAR_CONFIG })
    })

    this.props.hydateDataManager(dataSetsToHydrate)

    this.props.groupDataSetsByYear(dataSetsToGroupByYear)
  }

  addProductionComponents (id, title, units) {
    let components = {}

    components.dataSetId = id
    components.chartTitle = <ChartTitle>{title && title.toUpperCase()}</ChartTitle>
    components.chart = <StackedBarChart
      dataSetId={id}
      styleMap={CHART_STYLE_MAP}
      maxBarSize={MAX_CHART_BAR_SIZE}
    />
    components.chartContentDetails = <ChartSelectedContentDetails
      dataSetId={id}
      render={dataSet => (this.getChartContentDetailsHtml(dataSet))}
    />

    components.mapTitle = <ChartTitle>{this.region && this.region.toUpperCase()} OFFSHORE REGION PRODUCTION</ChartTitle>

    let shortUnits = (units === 'barrels') ? 'bbl' : units

    components.map = <OffshoreCountyMap isCaption={true} productKey={title + ' (' + shortUnits + ')'} usStateMarkdown={this.props.pageContext.markdown} units={units} />

    components.legend = <Legend dataSetId={id} render={dataSet => (this.getMapLegendTitle(dataSet))}/>

    this.productionComponents.push(components)
  }

  getChartContentDetailsHtml (dataSet) {
    let data = dataSet.data.find(item => Object.keys(item)[0] === dataSet.selectedDataKey)

    let commodity = (data) ? Object.keys(data[dataSet.selectedDataKey][0])[0] : undefined

    let commodityVolume = (commodity) ? data[dataSet.selectedDataKey][0][commodity] : undefined

    return (
      <span className={styles.chartSelectedContentDetails}>
        <span className={styles.chartSelectedContentDetailsHighlight}>{utils.formatToCommaInt(commodityVolume)}</span>
        {' ' + dataSet.units} of {commodity.toLowerCase()} were produced in the {this.region} offshore region in
        <span className={styles.chartSelectedContentDetailsHighlight}>{' ' + dataSet.selectedDataKey}</span>.
      </span>
    )
  }

  getMapLegendTitle (dataSet) {
    let data = dataSet.data.find(item => Object.keys(item)[0] === dataSet.selectedDataKey)

    let commodity = (data) ? Object.keys(data[dataSet.selectedDataKey][0])[0] : undefined

    let commodityVolume = (commodity) ? data[dataSet.selectedDataKey][0][commodity] : undefined

    return (
      <figcaption className={styles.legendTitle}>
        {utils.toTitleCase(this.region)} offshore region production of {commodity.toLowerCase()} in {dataSet.selectedDataKey} ({dataSet.units})
      </figcaption>
    )
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
              // title
              { name: 'og:title', content: title + ' | Natural Resources Revenue Data' },
              { name: 'twitter:title', content: title },
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
                {this.productionComponents
                  ? <div>
                    <StickyWrapper bottomBoundary="#production" innerZ="10000">
                      <StickyHeader headerText={'Energy production in the entire state of ' + title}>
                        <YearDropDown dataSetId={this.productionComponents[0].dataSetId} />
                      </StickyHeader>
                    </StickyWrapper>
                    <div className="chart-selector-wrapper">
                      <div className="chart-description">
                        <p>
                            ONRR collects detailed data about natural resources produced in the {title}.
                        </p>
                        <p>
                          <DownloadDataLink to="/downloads/federal-production/">Downloads and documentation</DownloadDataLink>
                        </p>
                      </div>
                    </div>
                    {
                      this.productionComponents.map((components, index) => {
                        return (
                          <div key={index + '_' + components.dataSetId} style={{ width: '100%', display: 'inline-block' }}>
                            <StackedBarChartWithMap
                              chartTitle={components.chartTitle}
                              chart={components.chart}
                              chartContentDetails={components.chartContentDetails}
                              mapTitle={components.mapTitle}
                              map={components.map}
                              legend={components.legend}
                            />
                          </div>
                        )
                      })
                    }
                  </div>
                  : <p>ONRR collects detailed data about natural resources produced on federal lands and waters. According to that data, there was no natural resource production in the { title }.</p>
                }

              </section>
            </div>
            <MediaQuery minWidth={768}>
              <div className="container-right-3">
              </div>
            </MediaQuery>
            <MediaQuery maxWidth={767}>
              <div style={{ position: 'absolute', width: '100%', top: '-45px' }}>
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
