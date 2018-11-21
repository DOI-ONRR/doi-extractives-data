import React from 'react';
import Link from '../../utils/temp-link';

import styles from "./WhatsNew.module.css";

const WhatsNew = (props) => (
  <section className={styles.root+" slab-delta"}>
  	<div className="container-page-wrapper">
			<h2>What's new</h2>
			<p>In our latest release on November 21, 2018, we made the following changes:</p>
      <ul className="list-bullet ribbon-card-top-list">
        <li>Released this new homepage, publishing yearly and monthly data summaries for high-demand commodities</li>
        <li>Introduced a new <Link to="/how-it-works/#disbursements">disbursements section</Link> to provide information about the disbursements process</li>
        <li>Introduced <Link to="/downloads/federal-revenue-by-month/">revenue by month data file and documentation</Link></li>
      </ul>
      <p>Review our <a href="https://github.com/ONRR/doi-extractives-data/releases">full release details</a>.</p>
		</div>
	</section>
);

export default WhatsNew;