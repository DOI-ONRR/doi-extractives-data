import React from 'react'
import Link from '../../utils/temp-link'

import styles from './WhatsNew.module.css'

const WhatsNew = props => (
  <section className={styles.root + ' slab-delta'}>
  	<div className="container-page-wrapper">
      <h2>What's new</h2>
      <p>In our latest release on April 30, 2020, we made the following changes:</p>
      <ul className="list-bullet ribbon-card-top-list">
        <li>Updated <Link to="/downloads/disbursements-by-month">monthly disbursements data through March 2020</Link></li>
        <li>Added <Link to="/blog/adding-a-product">blog post on our team's approach as we start managing another website</Link></li>
      </ul>

      <p>Review our <a href="https://github.com/ONRR/doi-extractives-data/releases">full release details</a>.</p>
    </div>
  </section>
)

export default WhatsNew
