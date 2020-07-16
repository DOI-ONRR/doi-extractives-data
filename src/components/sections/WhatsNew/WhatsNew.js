import React from 'react'
import Link from '../../utils/temp-link'

import styles from './WhatsNew.module.css'

const WhatsNew = props => (
  <section className={styles.root + ' slab-delta'}>
  	<div className="container-page-wrapper">
      <h2>What's new</h2>
      <p>In our latest release on July 17, 2020, we made the following changes:</p>
      <ul className="list-bullet ribbon-card-top-list">
        <li>Updated <Link to="/downloads/revenue-by-month">monthly revenue data</Link> through June 2020</li>
        <li>Updated <Link to="/downloads/production-by-month">monthly production data</Link> through March 2020</li>
        <li>Added <Link to="/downloads/revenue-by-company"> calendar year 2019 revenue by comppany download file</Link></li>
        <li>Added <Link to="/blog/Annie">blog post from our intern discussing her journey working with our team</Link></li>
      </ul>

      <p>Review our <a href="https://github.com/ONRR/doi-extractives-data/releases">full release details</a>.</p>
    </div>
  </section>
)

export default WhatsNew
