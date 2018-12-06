import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'

import styles from "./StackedBarChart.module.css"

import stackedBarChart from '../../../js/bar-charts/stacked-bar-chart';

class StackedBarChart extends React.Component {

	componentDidMount() {
		let {data, ...rest } = {...this.props};

		stackedBarChart.create(ReactDOM.findDOMNode(this), ...rest, data);
	}

	componentDidUpdate() {
		let {data, ...rest } = {...this.props};

		stackedBarChart.update(ReactDOM.findDOMNode(this), ...rest, data);
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
    /** Function to be called when a bar is selected */
    barSelectedCallback: PropTypes.func,
    /** Function to be called when a bar is hovered */
    barHoveredCallback: PropTypes.func,
    /** This will define the name to be placed under columns */
    groups: PropTypes.object,
    /** The data to populate the chart */
    data: PropTypes.array,
    /** The max width of the bar */
    maxBarSize: PropTypes.number,
    /** The chart bar to be set to selected */
    selectedDataKey: PropTypes.string,
    /** The order to display the stacked bar keys */
    sortOrder: PropTypes.array,
    /** The map of data keys to style classes */
    styleMap: PropTypes.object,
    /** The units to display on the max extent line */
    units: PropTypes.string,
    /** The labels to display in the xAxis */
    xAxisLabels: PropTypes.object,
}

export default StackedBarChart;
