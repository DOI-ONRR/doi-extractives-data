import React from 'react';
import ReactDOM from 'react-dom';

import stackedBar from 'js/bar-charts/stacked-bar';

class StackedBar extends React.Component {

	componentDidMount() {
		stackedBar.create(ReactDOM.findDOMNode(this), 
			{	height: '15px', ...this.props }, 
			this.props.chartData);
	}

	componentDidUpdate() {
		stackedBar.update(ReactDOM.findDOMNode(this), 
			{	height: '15px', ...this.props },
			this.props.chartData);
	}

	componentWillUnmount() {
		stackedBar.destroy(ReactDOM.findDOMNode(this));
	}

	render() {
		return(
			<div className='stacked-bar'>
			</div>
		);
	}
}

export default StackedBar;