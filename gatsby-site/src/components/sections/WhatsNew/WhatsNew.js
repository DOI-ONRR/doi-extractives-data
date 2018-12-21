import React from 'react';
import Link from '../../utils/temp-link';

import styles from "./WhatsNew.module.css";

const WhatsNew = (props) => (
  <section className={styles.root+" slab-delta"}>
  	<div className="container-page-wrapper">
			<h2>What's new</h2>
			<p>In our latest release on December 20, 2018, we made the following changes:</p>
      <ul className="list-bullet ribbon-card-top-list">
        <li>Published a <Link to="/blog">second blog post about rebuilding our homepage</Link>. This post covers how we're migrating to a new framework to build this site.</li>
        <li>Added <Link to="/explore/#revenue">total annual revenue</Link> to our revenue summary</li>
        <li>Updated monthly revenue data</li>
        <li>Fixed redirect URL problems</li>
      </ul>
      <p>Review our <a href="https://github.com/ONRR/doi-extractives-data/releases">full release details</a>.</p>
		</div>
	</section>
);

export default WhatsNew;