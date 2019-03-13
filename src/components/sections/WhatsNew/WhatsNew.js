import React from 'react';
import Link from '../../utils/temp-link';

import styles from "./WhatsNew.module.css";

const WhatsNew = (props) => (
  <section className={styles.root+" slab-delta"}>
  	<div className="container-page-wrapper">
			<h2>What's new</h2>
			<p>In our latest release on March 13, 2019, we made the following changes:</p>
        <ul className="list-bullet ribbon-card-top-list">
          <li>Updated monthly production and revenue data</li>
          <li>Published a <Link to="/blog/becoming-a-product-manager/">new blog post about a unique path to digital product management</Link></li>
          <li>Updated the status of the <Link to="/how-it-works/land-and-water-conservation-fund/">Land and Water Conservation Fund</Link> after new legislation was signed into law</li>
          <li>Updated <Link to="/how-it-works/coal-excise-tax/">Coal Excise Tax rates</Link> and replaced a chart image with tabular data for accessibility</li>
        </ul>
      <p>Review our <a href="https://github.com/ONRR/doi-extractives-data/releases">full release details</a>.</p>
		</div>
	</section>
);

export default WhatsNew;
