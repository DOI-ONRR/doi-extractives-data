import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'

import styles from "./StackedBarChart.module.css"

import stackedBarChart from '../../../js/bar-charts/stacked-bar-chart';

class StackedBarChart extends React.Component {

	componentDidMount() {
		let {data} = this.props;

		stackedBarChart.create(ReactDOM.findDOMNode(this), 
			...this.props, 
			data);
	}

	componentDidUpdate() {
		let {data} = this.props;

		stackedBarChart.update(ReactDOM.findDOMNode(this), 
			...this.props, 
			data);
	}

	componentWillUnmount() {
	
	}

	shouldComponentUpdate(nextProps) {
		// Do a basic check to see if data has changed
		return !( (this.props.data.length === nextProps.data.length) &&
			(JSON.stringify(nextProps.data[0]) === JSON.stringify(this.props.data[0])) &&
			(JSON.stringify(nextProps.data[nextProps.data.length-1]) === JSON.stringify(this.props.data[this.props.data.length-1])) );
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
    /** Display configuration options */
    displayConfig: PropTypes.object,
    /** Function to be called when a bar is selected */
    barSelectedCallback: PropTypes.func

}


export default StackedBarChart;