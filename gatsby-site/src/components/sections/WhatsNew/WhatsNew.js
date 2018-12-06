import React from 'react';
import Link from '../../utils/temp-link';

import styles from "./WhatsNew.module.css";

const WhatsNew = (props) => (
  <section className={styles.root+" slab-delta"}>
  	<div className="container-page-wrapper">
			<h2>What's new</h2>
			<p>In our latest release on December 6, 2018, we made the following changes:</p>
      <ul className="list-bullet ribbon-card-top-list">
        <li>Launched a <Link to="/blog">blog about how we work on this site</Link></li>
        <li>Updated monthly production data</li>
        <li>Added documentation about <Link to="/downloads/federal-production-by-month/#monthly-totals-and-annual-totals">monthly and annual production volumes</Link></li>
      </ul>
      <p>Review our <a href="https://github.com/ONRR/doi-extractives-data/releases">full release details</a>.</p>
		</div>
	</section>
);

export default WhatsNew;