import React from 'react'
import Link from '../../utils/temp-link'

import styles from './WhatsNew.module.css'

const WhatsNew = props => (
  <section className={styles.root + ' slab-delta'}>
  	<div className="container-page-wrapper">
      <h2>What's new</h2>
      <p>In our latest release on May 15, 2019, we made the following changes:</p>
      <ul className="list-bullet ribbon-card-top-list">
        <li>Updated <Link to="/how-it-works/federal-revenue-by-company/2018/">company revenue data to 2018</Link></li>
        <li>Updated <Link to="/explore/revenue/">revenue detail table</Link> for improved functionality</li>
        <li>Updated <Link to="/how-it-works/renewables/">renewables content</Link></li>
        <li>Added revenue trends section</li>
        <li>Added Native American production data to homepage production charts</li>
        <li>Updated monthly production data (now through January 2019)</li>
        <li>Updated monthly revenue data (now through April 2019)</li>
      </ul>
      <p>Review our <a href="https://github.com/ONRR/doi-extractives-data/releases">full release details</a>.</p>
    </div>
  </section>
)

export default WhatsNew
