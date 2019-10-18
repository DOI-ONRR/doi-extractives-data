import React from 'react'
import Link from '../../utils/temp-link'

import styles from './WhatsNew.module.css'

const WhatsNew = props => (
  <section className={styles.root + ' slab-delta'}>
  	<div className="container-page-wrapper">
      <h2>What's new</h2>
      <p>In our latest release on October 7, 2019, we made the following changes:</p>
      <ul className="list-bullet ribbon-card-top-list">
        <li>Fixed a bug with explore data disbursements </li>
      </ul>
      <p>In our release on October 3, 2019, we made the following changes:</p>
      <ul className="list-bullet ribbon-card-top-list">
        <li>Fixed a bug with disbursements trends on the homepage</li>
      </ul>
      <p>In our release on September 30, 2019, we made the following changes:</p>
      <ul className="list-bullet ribbon-card-top-list">
        <li>Improved accessibility of homepage charts and navigation</li>
        <li>Added <Link to="/blog">blog post about building technical capacity with team members</Link></li>
        <li>Improved data documentation</li>
        <li>Refactored data query structure for disbursements</li>
      </ul>

      <p>Review our <a href="https://github.com/ONRR/doi-extractives-data/releases">full release details</a>.</p>
    </div>
  </section>
)

export default WhatsNew
