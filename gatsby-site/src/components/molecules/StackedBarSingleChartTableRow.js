import React from 'react';
import StackedBar from 'components/atoms/StackedBar';
import ChartLegend from 'components/atoms/ChartLegend';

import Link from 'components/utils/temp-link';

// class names added to make current css work with intended

class StackedBarSingleChartTableRow extends React.Component {

	render() {

		return(
			<tr>
				<td className="bureau">
					<h4 className="chart-title" style={{'margin':'0px'}}>{this.props.name}</h4>
					{this.props.description}<br/>
					{this.props.descriptionLink}
				</td>
				<td>
					<StackedBar {...this.props} />
					<ChartLegend {...this.props} className="stacked-bar-legend" />
				</td>
			</tr>
		);
	}
}

export default StackedBarSingleChartTableRow;