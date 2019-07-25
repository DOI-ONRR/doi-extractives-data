import React from 'react'
import Link from '../../utils/temp-link'

import styles from './WhatsNew.module.css'

const WhatsNew = props => (
  <section className={styles.root + ' slab-delta'}>
  	<div className="container-page-wrapper">
      <h2>What's new</h2>
      <p>In our latest release on July 25, 2019, we made the following changes:</p>
      <ul className="list-bullet ribbon-card-top-list">
        <li>Published <Link to="blog/intern-blog-post/">blog post on our summer intern's experiences and contributions</Link></li>
        <li>Added <Link to="archive">an archive page</Link> for content we no longer maintain</li>
      </ul>

      <p>Review our <a href="https://github.com/ONRR/doi-extractives-data/releases">full release details</a>.</p>
    </div>
  </section>
)

export default WhatsNew
