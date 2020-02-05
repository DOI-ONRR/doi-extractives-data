import React from 'react'
import Link from '../../utils/temp-link'

import styles from './WhatsNew.module.css'

const WhatsNew = props => (
  <section className={styles.root + ' slab-delta'}>
  	<div className="container-page-wrapper">
      <h2>What's new</h2>
      <p>In our latest release on February 6, 2020, we made the following changes:</p>
      <ul className="list-bullet ribbon-card-top-list">
        <li>Added calendar year revenue data for 2019</li>
        <li>Added disbursements data for December 2019</li>
        <li>Added blog post about being tool agnostic</li>
      </ul>

      <p>Review our <a href="https://github.com/ONRR/doi-extractives-data/releases">full release details</a>.</p>
    </div>
  </section>
)

export default WhatsNew
