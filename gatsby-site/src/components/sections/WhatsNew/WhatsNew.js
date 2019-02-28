import React from 'react';
import Link from '../../utils/temp-link';

import styles from "./WhatsNew.module.css";

const WhatsNew = (props) => (
  <section className={styles.root+" slab-delta"}>
  	<div className="container-page-wrapper">
			<h2>What's new</h2>
			<p>In our latest release on February 28, 2019, we made the following changes:</p>
        <ul className="list-bullet ribbon-card-top-list">
          <li>Updated the status of the <Link to="/how-it-works/land-and-water-conservation-fund/">Land and Water Conservation Fund</Link> following legislative action</li>
          <li>Refactors some supporting content to new framework</li>
          <li>Updated <a href="https://github.com/ONRR/doi-extractives-data/wiki/Content-guide">content guide</a> to encourage consistent use of grammar and style</li>
          <li>Minor content edits and updates</li>
        </ul>
      <p>Review our <a href="https://github.com/ONRR/doi-extractives-data/releases">full release details</a>.</p>
		</div>
	</section>
);

export default WhatsNew;
