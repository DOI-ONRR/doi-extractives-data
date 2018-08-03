import React from 'react';
import ReactDOM from 'react-dom';

import stackedBar from 'js/bar-charts/stacked-bar';

class StackedBar extends React.Component {

	componentDidMount() {
		stackedBar.create(ReactDOM.findDOMNode(this), 
			{	height: '15px', 
				keys: this.props.chartKeys, 
				keysClassNames: this.props.keysClassNames,
				keysOrder: this.props.keysOrder,
				chartDataMaxValue: this.props.chartDataMaxValue
			}, 
			this.props.chartData);
	}

	componentDidUpdate() {
		//console.log("Component Did Update");
		stackedBar.update(ReactDOM.findDOMNode(this), this.props.chartData);
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