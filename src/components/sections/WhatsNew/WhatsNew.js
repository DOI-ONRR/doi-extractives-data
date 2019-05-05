import React from 'react'
import Link from '../../utils/temp-link'

import styles from './WhatsNew.module.css'

const WhatsNew = props => (
  <section className={styles.root + ' slab-delta'}>
  	<div className="container-page-wrapper">
      <h2>What's new</h2>
      <p>In our latest release on May 3, 2019, we made the following changes:</p>
      <ul className="list-bullet ribbon-card-top-list">
        <li>Updated state disbursements data to 2018</li>
        <li>Updated <Link to="/downloads/federal-disbursements-by-month/">monthly disbursements file</Link></li>
        <li>Added multiple pathways to <Link to="/explore/revenue/">revenue detail table</Link></li>
        <li>Added <Link to="/blog/journey-mapping/">blog post about journey maps as communication tools</Link></li>
      </ul>
      <p>Review our <a href="https://github.com/ONRR/doi-extractives-data/releases">full release details</a>.</p>
    </div>
  </section>
)

export default WhatsNew
