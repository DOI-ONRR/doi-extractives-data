import React from 'react'
import Link from '../../utils/temp-link'

import styles from './WhatsNew.module.css'

const WhatsNew = props => (
  <section className={styles.root + ' slab-delta'}>
  	<div className="container-page-wrapper">
      <h2>What's new</h2>
      <p>In our latest release on December 3, 2019, we made the following changes:</p>
      <ul className="list-bullet ribbon-card-top-list">
        <li>Changed the data behind homepage revenue trend lines for consistency</li>
          <li>Added <Link to="/blog">blog post about building a database for our site</Link></li>
      </ul>

      <p>Review our <a href="https://github.com/ONRR/doi-extractives-data/releases">full release details</a>.</p>
    </div>
  </section>
)

export default WhatsNew
