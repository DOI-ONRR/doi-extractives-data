import React from 'react'
import PropTypes from 'prop-types'
import MediaQuery from 'react-responsive'

import styles from './StackedBarChartWithMap.module.scss'

const StackedBarChartWithMap = props => {
  let { chartTitle, chart, chartContentDetails, mapTitle, map } = props

  return (
    <div className={styles.root}>
      <div className={styles.chartContainer}>
        {chartTitle}
        {chart}
        {chartContentDetails}
      </div>
      <div className={styles.mapContainer}>
        {mapTitle}
        {map}
      </div>
    </div>
  )
}

StackedBarChartWithMap.propTypes = {
  /** React component to use to render the chart title */
  chartTitle: PropTypes.element,
  /** React component to use to render the chart */
  chart: PropTypes.element,
  /** React component to use to render the chart content detials */
  chartContentDetails: PropTypes.element,
  /** React component to use to render the chart content detials */
  mapTitle: PropTypes.element,
  /** React component to use to render the chart content detials */
  map: PropTypes.element,

}

export default StackedBarChartWithMap
