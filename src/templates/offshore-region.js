import React from 'react'
import Helmet from 'react-helmet'
import { useDispatch } from 'react-redux'

import Link, { withPrefix } from '../components/utils/temp-link'

import { hydrate as hydateDataManagerAction, groupByYear as groupDataSetsByYearAction } from '../state/reducers/data-sets'

import utils from '../js/utils'

import { PageToc } from '../components/navigation/PageToc'
import DefaultLayout from '../components/layouts/DefaultLayout'
import GlossaryTerm from '../components/utils/glossary-term'
import StickyHeader from '../components/layouts/StickyHeader'
import { StickyWrapper } from '../components/utils/StickyWrapper'
// import YearDropDown from '../components/selectors/YearDropDown'
import { DownloadDataLink } from '../components/layouts/icon-links/DownloadDataLink'
import StackedBarChartWithMap from '../components/layouts/charts/StackedBarChartWithMap'
import { ChartTitle } from '../components/charts/ChartTitle'
import { StackedBarChart } from '../components/charts/StackedBarChart'
import ChartSelectedContentDetails from '../components/charts/ChartSelectedContentDetails'
import OffshoreCountyMap from '../components/maps/CountyMaps'
import Legend from '../components/charts/Legend'

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

const OffshoreRegion = ({ pageContext }) => {
  const dispatch = useDispatch()

  const title = pageContext.markdown.frontmatter.title || 'Offshore Region'
  const regionId = pageContext.markdown.frontmatter.unique_id

  let productionComponents = []

  const hydrate = () => {
    let dataSetsToHydrate = []
    let dataSetsToGroupByYear = []

    pageContext.data.commodities.map(commodity => {
      let dataSetId = PRODUCTION_SYNC_ID + '_' + commodity.name
      let units = commodity.volumes[0].data.Units
      addProductionComponents(dataSetId, commodity.name, units)

      dataSetsToHydrate.push({ key: dataSetId, data: commodity.volumes })

      dataSetsToGroupByYear.push({ id: dataSetId, sourceKey: dataSetId, ...PRODUCTION_BY_YEAR_CONFIG })
    })

    dispatch(hydateDataManagerAction(dataSetsToHydrate))

    dispatch(groupDataSetsByYearAction(dataSetsToGroupByYear))
  }

  const addProductionComponents = (id, commodityName, units) => {
    let components = {}

    components.dataSetId = id
    components.chartTitle = <ChartTitle>{commodityName && commodityName.toUpperCase()}</ChartTitle>
    components.chart = <StackedBarChart
      dataSetId={id}
      styleMap={CHART_STYLE_MAP}
      maxBarSize={MAX_CHART_BAR_SIZE}
    />
    components.chartContentDetails = <ChartSelectedContentDetails
      dataSetId={id}
      render={dataSet => (getChartContentDetailsHtml(dataSet))}
    />

    components.mapTitle = <ChartTitle>{title.toUpperCase()} PRODUCTION</ChartTitle>

    let shortUnits = (units === 'barrels') ? 'bbl' : units

    components.map = <OffshoreCountyMap isCaption={true} productKey={commodityName + ' (' + shortUnits + ')'} usStateMarkdown={pageContext.markdown} units={units} />

    components.legend = <Legend dataSetId={id} render={dataSet => (getMapLegendTitle(dataSet))}/>

    productionComponents.push(components)
  }

  const getChartContentDetailsHtml = dataSet => {
    let data = dataSet.data.find(item => Object.keys(item)[0] === dataSet.selectedDataKey)

    let commodity = (data) ? Object.keys(data[dataSet.selectedDataKey][0])[0] : undefined

    let commodityVolume = (commodity) ? data[dataSet.selectedDataKey][0][commodity] : undefined

    return (
      <span className={styles.chartSelectedContentDetails}>
        <span className={styles.chartSelectedContentDetailsHighlight}>{utils.formatToCommaInt(commodityVolume)}</span>
        {' ' + dataSet.units} of {commodity.toLowerCase()} were produced in the {title} in
        <span className={styles.chartSelectedContentDetailsHighlight}>{' ' + dataSet.selectedDataKey}</span>.
      </span>
    )
  }

  const getMapLegendTitle = dataSet => {
    let data = dataSet.data.find(item => Object.keys(item)[0] === dataSet.selectedDataKey)

    let commodity = (data) ? Object.keys(data[dataSet.selectedDataKey][0])[0] : undefined

    return (
      <figcaption className={styles.legendTitle}>
        {utils.toTitleCase(title)} production of {commodity.toLowerCase()} in {dataSet.selectedDataKey} ({dataSet.units})
      </figcaption>
    )
  }

  hydrate()

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
                Unlike land (which can be owned by states, local governments, corporations, or private individuals)
                , the waters and submerged lands of the <GlossaryTerm>Outer Continental Shelf</GlossaryTerm> are entirely administered by the federal government. This means that all <Link to="/how-it-works/offshore-oil-gas/">offshore drilling</Link> and <Link to="/how-it-works/offshore-renewables/">renewable energy generation</Link> takes place in federal waters.
              </p>
            </section>
            <section id="production">
              <h2>Production</h2>
              {productionComponents
                ? <div>
                  <StickyWrapper bottomBoundary="#production" innerZ="10000">
                    <StickyHeader headerText={'Energy production in the entire state of ' + title}>
                      Year Drop Down
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
                    productionComponents.map((components, index) => {
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
        </section>
      </main>
    </DefaultLayout>
  )
}

export default OffshoreRegion
