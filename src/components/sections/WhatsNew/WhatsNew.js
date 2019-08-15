import React from 'react'
import Link from '../../utils/temp-link'

import styles from './WhatsNew.module.css'

const WhatsNew = props => (
  <section className={styles.root + ' slab-delta'}>
  	<div className="container-page-wrapper">
      <h2>What's new</h2>
      <p>In our latest release on August 19, 2019, we made the following changes:</p>
      <ul className="list-bullet ribbon-card-top-list">
        <li>Published <Link to="blog/beyond-open-data/">blog post on how we're going beyond recent government mandates to provide open data </Link></li>
        <li>Updated monthly revenue and production data</li>
        <li>Updated <Link to="explore/#production/">production</Link> and <Link to="explore/#revenue/">revenue</Link>data through 2018</li>
      </ul>

      <p>Review our <a href="https://github.com/ONRR/doi-extractives-data/releases">full release details</a>.</p>
    </div>
  </section>
)

export default WhatsNew
