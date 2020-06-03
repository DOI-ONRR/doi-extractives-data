import React from 'react'
import Link from '../../utils/temp-link'

import styles from './WhatsNew.module.css'

const WhatsNew = props => (
  <section className={styles.root + ' slab-delta'}>
  	<div className="container-page-wrapper">
      <h2>What's new</h2>
      <p>In our latest release on June 3, 2020, we made the following changes:</p>
      <ul className="list-bullet ribbon-card-top-list">
        <li>Released our new <Link to="https://nrrd-beta.app.cloud.gov/exploredata">beta site</Link></li>
        <li>Updated <Link to="/downloads/disbursements-by-month">monthly disbursements data through April 2020</Link></li>
        <li>Added <Link to="https://nrrd-beta.app.cloud.gov/downloads/production">calenday year 2019 production data file</Link> on our beta site</li>
      </ul>

      <p>Review our <a href="https://github.com/ONRR/doi-extractives-data/releases">full release details</a>.</p>
    </div>
  </section>
)

export default WhatsNew
