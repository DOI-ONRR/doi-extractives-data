import React from 'react';
import Link from '../../utils/temp-link';

import styles from "./WhatsNew.module.css";

const WhatsNew = (props) => (
  <section className={styles.root+" slab-delta"}>
  	<div className="container-page-wrapper">
			<h2>What's new</h2>
			<p>In our latest release on February 14, 2019, we made the following changes:</p>
        <ul className="list-bullet ribbon-card-top-list">
          <li>Updated the status of the <Link to="/how-it-works/land-and-water-conservation-fund/">Land and Water Conservation Fund</Link></li>
        </ul>  
      <p>In our release on February 7, 2019, we made the following changes:</p>  
        <ul className="list-bullet ribbon-card-top-list">
          <li>Published a <Link to="/blog">third blog post about usability testing training</Link>. This post covers how we're expanding our capacity to perform usability testing.</li>
          <li>Updated <Link to="/downloads/federal-revenue-by-location/">fiscal year revenue data</Link> through 2018</li>
          <li>Updated monthly production and revenue data</li>
          <li>Converted <Link to="/how-it-works/revenues/#federal-lands-and-waters">revenue streams and rates</Link> image to table for accessibility</li>
        </ul>
      <p>Review our <a href="https://github.com/ONRR/doi-extractives-data/releases">full release details</a>.</p>
		</div>
	</section>
);

export default WhatsNew;
