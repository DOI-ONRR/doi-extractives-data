import React from 'react'
import Link from '../../utils/temp-link'

import styles from './WhatsNew.module.css'

const WhatsNew = props => (
  <section className={styles.root + ' slab-delta'}>
  	<div className="container-page-wrapper">
      <h2>What's new</h2>
      <p>In our latest release on April 9, 2019, we made the following changes:</p>
      <ul className="list-bullet ribbon-card-top-list">
        <li>Updated site codebase</li>
        <li>Updated production data download file to FY2018</li>
        <li>Added download file for monthly disbursements</li>
      </ul>
      <p>Review our <a href="https://github.com/ONRR/doi-extractives-data/releases">full release details</a>.</p>
    </div>
  </section>
)

export default WhatsNew
