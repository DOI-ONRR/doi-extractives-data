import React from 'react'
import Link from '../../utils/temp-link'

import styles from './WhatsNew.module.css'

const WhatsNew = props => (
  <section className={styles.root + ' slab-delta'}>
  	<div className="container-page-wrapper">
      <h2>What's new</h2>
      <p>In our latest release on April 25, 2019, we made the following change:</p>
      <ul className="list-bullet ribbon-card-top-list">
        <li>Added Fiscal Year 2019 GOMESA Disbursement data</li>
        <li>Added <Link to="how-it-works/gomesa/">Fiscal Year 2019 GOMESA disbursement data</Link></li>
      </ul>
      <p>In our release on April 23, 2019, we made the following changes:</p>
      <ul className="list-bullet ribbon-card-top-list">
        <li>Added fiscal year view to homepage annual revenue and production bar charts</li>
        <li>Added download file for <Link to="downloads/native-american-revenue/">Native American revenue data</Link></li>
      </ul>
      <p>Review our <a href="https://github.com/ONRR/doi-extractives-data/releases">full release details</a>.</p>
    </div>
  </section>
)

export default WhatsNew
