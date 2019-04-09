import React from 'react'

import styles from './ChartTitle.module.scss'

const ChartTitle = props => (
  <div className={styles.chartTitle}>
    {props.children}
  </div>
)

export default ChartTitle
