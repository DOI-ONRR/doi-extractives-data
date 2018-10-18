import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'

import styles from "./StackedBarChart.module.css"

import stackedBarChart from '../../../js/bar-charts/stacked-bar-chart';

const dataKeyToClassNameMap = {
	'Federal onshore': styles.stackedBarChart_onshore,
	'Federal offshore': styles.stackedBarChart_offshore,
	'Native American': styles.stackedBarChart_native_american,
};

class StackedBarChart extends React.Component {

	componentDidMount() {
		let barClassNames = this.props.barClassNames || styles.stackedBarChart_bar;
		let barSelectedClassNames = this.props.barSelectedClassNames || styles.selected;
		let classNamesMap = this.props.classNamesMap || dataKeyToClassNameMap;

		stackedBarChart.create(ReactDOM.findDOMNode(this), 
			{ 	
				barClassNames: barClassNames, 
				barSelectedClassNames: barSelectedClassNames,
				barSelectedCallback: this.props.barSelectedCallback,
				classNamesMap: classNamesMap, 
				...this.props }, 
			this.props.data);
	}

	componentDidUpdate() {

		stackedBarChart.update(ReactDOM.findDOMNode(this), 
			{ 	
				barClassNames: barClassNames, 
				barSelectedClassNames: barSelectedClassNames,
				barSelectedCallback: this.props.barSelectedCallback,
				classNamesMap: classNamesMap, 
				...this.props }, 
			this.props.data);
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
    /** The data to populate the chart */
    data: PropTypes.array,
    /** The data set to be selected on page load. */
    defaultSelected: PropTypes.string,

}


export default StackedBarChart;