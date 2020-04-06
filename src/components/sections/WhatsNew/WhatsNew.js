import React from 'react'
import Link from '../../utils/temp-link'

import styles from './WhatsNew.module.css'

const WhatsNew = props => (
  <section className={styles.root + ' slab-delta'}>
  	<div className="container-page-wrapper">
      <h2>What's new</h2>
      <p>In our latest release on March 30, 2020, we made the following changes:</p>
      <ul className="list-bullet ribbon-card-top-list">
        <li>Updated <Link to="/downloads/federal-production">fiscal year production data through 2019</Link></li>
        <li>Added <Link to="/how-it-works/gomesa/#revenue-sharing">2020 GOMESA disbursements to states and local governments</Link></li>
      </ul>

      <p>Review our <a href="https://github.com/ONRR/doi-extractives-data/releases">full release details</a>.</p>
    </div>
  </section>
)

export default WhatsNew
