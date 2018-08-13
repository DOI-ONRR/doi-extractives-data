import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import stackedBar from '../../js/bar-charts/stacked-bar';

class StackedBar extends React.Component {

	componentDidMount() {
		stackedBar.create(ReactDOM.findDOMNode(this), 
			{ ...this.props }, 
			this.props.chartData);
	}

	componentDidUpdate() {
		stackedBar.update(ReactDOM.findDOMNode(this), 
			{ ...this.props },
			this.props.chartData);
	}

	componentWillUnmount() {
		stackedBar.destroy(ReactDOM.findDOMNode(this));
	}

	render() {
		return(
			<div className={"stacked-bar "+this.props.className}>
			</div>
		);
	}
}

StackedBar.propTypes = {
	/** Array of key value pairs */
	chartData: PropTypes.array.isRequired,
	/** A number to use for relative sizing of the bar. Default is the max value of the chart data array */
	maxValue: PropTypes.number,
	/** Specify the height of the bar with units in a string format */
	height: PropTypes.string,
	/** The display names for the data including sort order */
	displayNames: PropTypes.object,
	/** Specify a class name to be added to the outer element */
	className: PropTypes.string
}

StackedBar.defaultProps = {
	height: '15px',
};

export default StackedBar;