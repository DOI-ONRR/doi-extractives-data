import React from 'react';
import Link from '../../utils/temp-link';

import styles from "./WhatsNew.module.css";

const WhatsNew = (props) => (
  <section className={styles.root+" slab-delta"}>
  	<div className="container-page-wrapper">
			<h2>What's new</h2>
			<p>In our latest release on July 12, 2018, we made the following changes:</p>
      <ul className="list-bullet ribbon-card-top-list">
        <li>Added <Link to="#">2017 federal calendar year production data</Link> to make sure you have the latest</li>
        <li>Revised <Link to="#">search results</Link> to make it easier to find what you're looking for</li>
      </ul>
		</div>
	</section>
);

export default WhatsNew;