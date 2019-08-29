import React from 'react'
import Link from '../../utils/temp-link'

import styles from './WhatsNew.module.css'

const WhatsNew = props => (
  <section className={styles.root + ' slab-delta'}>
  	<div className="container-page-wrapper">
      <h2>What's new</h2>
      <p>In our latest release on August 29, 2019, we made the following changes:</p>
      <ul className="list-bullet ribbon-card-top-list">
        <li>Redesigned homepage tab layout, based on user input</li>
        <li>Added disbursements trends summary on homepage</li>
        <li>Changed U.S. map from land ownership to data map showing revenue by state</li>
        <li>Updated revenue rates and links</li>
        <li>Fixed disbursements bug on explore data</li>
      </ul>

      <p>Review our <a href="https://github.com/ONRR/doi-extractives-data/releases">full release details</a>.</p>
    </div>
  </section>
)

export default WhatsNew
