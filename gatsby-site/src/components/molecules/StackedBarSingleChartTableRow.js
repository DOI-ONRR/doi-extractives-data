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
					{this.props.descriptionLink &&
						<p><Link to={this.props.descriptionLink.to}>{this.props.descriptionLink.name}</Link></p>
					}
					
				</td>
				{(this.props.chartData !== undefined && this.props.chartData.length > 0) ?
					<td>
						<StackedBar {...this.props} />
						<ChartLegend {...this.props} className="stacked-bar-legend" />
					</td>
					:
					<td>
						There is no data about disbursements to {this.props.name} in {this.props.year}.
					</td>
				}
			</tr>
		);
	}
}

export default StackedBarSingleChartTableRow;