import React from 'react'
import Link from '../../utils/temp-link'

import styles from './WhatsNew.module.css'

const WhatsNew = props => (
  <section className={styles.root + ' slab-delta'}>
  	<div className="container-page-wrapper">
      <h2>What's new</h2>
      <p>In our latest release on June 27, 2019, we made the following changes:</p>
      <ul className="list-bullet ribbon-card-top-list">
        <li>Added <Link to="downloads/disbursements/">file with monthly disbursements through May 2019</Link></li>
        <li>Published <Link to="blog/open-data-useful/">blog post on making open data useful</Link></li>
      </ul>

      <p>Review our <a href="https://github.com/ONRR/doi-extractives-data/releases">full release details</a>.</p>
    </div>
  </section>
)

export default WhatsNew
