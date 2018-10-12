import React from 'react';

import styles from "./ChartTitle.module.css"

const ChartTitle = (props) => (
	<div className={styles.chartTitle}>
		{props.children}
	</div>
);

export default ChartTitle;