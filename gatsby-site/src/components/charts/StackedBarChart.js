import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'

import styles from "./StackedBarChart.module.css"

import stackedBarChart from '../../js/bar-charts/stacked-bar-chart';

const data = [
	{"'08": [{"Federal onshore": 50, "Federal offshore": 100, "Native American":75}]},
	{"'09": [{"Federal onshore": 10, "Federal offshore": 30, "Native American":15}]},
	{"'10": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
	{"'11": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
	{"'12": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
	{"'13": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
	{"'14": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
	{"'15": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
	{"'16": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
	{"'17": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
	{"'18": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
];

const classNamesMap = {
	'Federal onshore': styles.stackedBarChart_onshore,
	'Federal offshore': styles.stackedBarChart_offshore,
	'Native American': styles.stackedBarChart_native_american,
};

class StackedBarChart extends React.Component {

	barSelected(data) {
		console.log("Bar Selected", data);
	}
	

	componentDidMount() {
		stackedBarChart.create(ReactDOM.findDOMNode(this), 
			{ 	barClassNames: styles.stackedBarChart_bar, 
				barSelectedClassNames: styles.selected,
				barSelectedCallback: this.barSelected.bind(this),
				classNamesMap, 
				...this.props }, 
			data);
	}

	componentDidUpdate() {

	}

	componentWillUnmount() {
	}

	render() {
		return(
			<div className={styles.stackedBarChart}>
			</div>
		);
	}
}

StackedBarChart.propTypes = {

}


export default StackedBarChart;