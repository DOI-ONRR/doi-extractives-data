import React from 'react'
import Link from '../../utils/temp-link'

import styles from './WhatsNew.module.css'

const WhatsNew = props => (
  <section className={styles.root + ' slab-delta'}>
  	<div className="container-page-wrapper">
      <h2>What's new</h2>
      <p>In our latest release on April 18, 2019, we made the following changes:</p>
      <ul className="list-bullet ribbon-card-top-list">
        <li>Fixed browser bugs and styling issues on <Link to="explore/revenue/">revenue data table</Link></li>
        <li>Fixed bug on homepage revenue bar charts</li>
        <li>Published <Link to="/blog/county-choropleth-prototype/">blog post about mapping revenue data by county</Link></li>
      </ul>
      <p>Review our <a href="https://github.com/ONRR/doi-extractives-data/releases">full release details</a>.</p>
    </div>
  </section>
)

export default WhatsNew
