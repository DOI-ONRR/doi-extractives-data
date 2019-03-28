import React from 'react'
import PropTypes from 'prop-types'
import MediaQuery from 'react-responsive'

import styles from './StackedBarChartWithMap.module.scss'

const StackedBarChartWithMap = props => {
  let { chartTitle, chart, chartContentDetails, mapTitle, map, legend } = props
  //console.log(props);

  return (
    <div className={styles.root}>
      <div className={styles.chartContainer}>
        {chartTitle}
        {chart}
        {chartContentDetails}
      </div>
      <div className={styles.mapLegendContainer}>
        {mapTitle}
        <div className={styles.mapContainer}>
          {map}
        </div>
        <div className={styles.legendContainer}>
          {legend}
        </div>
      </div>
    </div>
  )
}

StackedBarChartWithMap.propTypes = {
  /** React component to use to render the chart title */
  chartTitle: PropTypes.element,
  /** React component to use to render the chart */
  chart: PropTypes.element,
  /** React component to use to render the chart content details */
  chartContentDetails: PropTypes.element,
  /** React component to use to render the map title */
  mapTitle: PropTypes.element,
  /** React component to use to render the map */
  map: PropTypes.element,
  /** React component to use to render the legend */
  legend: PropTypes.element,

}

export default StackedBarChartWithMap
