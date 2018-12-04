import React from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'

import styles from "./StackedBarChart.module.css"

import { selectData as selectDataAction } from '../../../state/reducers/data-sets';

import stackedBarChart from '../../../js/bar-charts/stacked-bar-chart';

class StackedBarChart extends React.Component {

	componentDidMount() {
		let {data, barSelectedCallback, ...rest } = {...this.props};

		stackedBarChart.create(ReactDOM.findDOMNode(this), 
			{...rest, barSelectedCallback: this.barSelected.bind(this)}, 
			data);
	}

	componentDidUpdate() {
		let {data, barSelectedCallback, ...rest } = {...this.props};

		stackedBarChart.update(ReactDOM.findDOMNode(this), 
			{...rest, barSelectedCallback: this.barSelected.bind(this)}, 
			data);
	}

	componentWillUnmount() {
	
	}

	barSelected(key, data) {
		console.log("barSelected");
		this.props.dataSelected(key, data);
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


export default connect(
  state => ({}),
  dispatch => ({
  	dataSelected: (key, data) => dispatch(selectDataAction(key, data)),
  })
)(StackedBarChart);;