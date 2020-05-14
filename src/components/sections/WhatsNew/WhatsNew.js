import React from 'react'
import Link from '../../utils/temp-link'

import styles from './WhatsNew.module.css'

const WhatsNew = props => (
  <section className={styles.root + ' slab-delta'}>
  	<div className="container-page-wrapper">
      <h2>What's new</h2>
      <p>In our latest release on May 14, 2020, we made the following changes:</p>
      <ul className="list-bullet ribbon-card-top-list">
        <li>Updated <Link to="/downloads/revenue-by-month">monthly revenue data through April 2020</Link></li>
                <li>Updated <Link to="/downloads/production-by-month">monthly production data through January 2020</Link></li>
                <li>Added <Link to="/blog/adding-a-product">blog post on our virtual student intern's experience with us</Link></li>
      </ul>

      <p>Review our <a href="https://github.com/ONRR/doi-extractives-data/releases">full release details</a>.</p>
    </div>
  </section>
)

export default WhatsNew
