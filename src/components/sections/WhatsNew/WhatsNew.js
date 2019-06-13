import React from 'react'
import Link from '../../utils/temp-link'

import styles from './WhatsNew.module.css'

const WhatsNew = props => (
  <section className={styles.root + ' slab-delta'}>
  	<div className="container-page-wrapper">
      <h2>What's new</h2>
      <p>In our latest release on June 13, 2019, we made the following changes:</p>
      <ul className="list-bullet ribbon-card-top-list">
        <li>Added csv option for all <Link to="downloads/">downloads</Link></li>
        <li>Updated <Link to="downloads/federal-production/">calendar year production file to include 2003-2018 data</Link></li>
        <li>Updated homepage graphs with monthly revenue through May 2019 and production through February 2019 </li>
        <li>Updated <Link to="downloads/federal-disbursements-by-month/"> monthly disbursements file through April 2019</Link></li>
      </ul>

      <p>Review our <a href="https://github.com/ONRR/doi-extractives-data/releases">full release details</a>.</p>
    </div>
  </section>
)

export default WhatsNew
