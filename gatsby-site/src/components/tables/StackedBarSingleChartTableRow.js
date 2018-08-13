import React from 'react';
import PropTypes from 'prop-types';

import StackedBar from '../charts/StackedBar';
import ChartLegend from '../charts/ChartLegend';

import Link from '../utils/temp-link';

// class names added to make current css work with intended styling

class StackedBarSingleChartTableRow extends React.Component {

	render() {
		return(
			<tr className={this.props.className}>
				<td className="bureau">
					<h4 className="chart-title" style={{'margin':'0px'}}>{this.props.name}</h4>
					{this.props.description}<br/>
					{this.props.descriptionLink &&
						<p><Link to={this.props.descriptionLink.to}>{this.props.descriptionLink.name}</Link></p>
					}
					
				</td>
				{(this.props.chartData !== undefined && this.props.chartData.length > 0) ?
					<td>
						<StackedBar height={this.props.barHeight} maxValue={this.props.maxValue} chartData={this.props.chartData} />
						<ChartLegend
							displayNames={this.props.legendNames} 
							dataFormatFunc={this.props.legendDataFormatFunc}
							chartData={this.props.chartData}
							className="stacked-bar-legend" />
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

StackedBarSingleChartTableRow.propTypes = {
	/** This will appear on the left side of the table row */
	name: PropTypes.string,
	/** This will appear on the left side of the table row under the name*/
	description: PropTypes.string,
	/** This will appear on the left side of the table row under the dscription and will be a link to a url */
	descriptionLink:  PropTypes.shape({
						/** Url string for the href */
						to: PropTypes.string,
						/** Text to display for the Link */
						name: PropTypes.string }),
	/** Array of key value pairs */
	chartData: PropTypes.array.isRequired,
	/** A number to use for relative sizing of the bar. Default is the max value of the chart data array */
	maxValue: PropTypes.number,
	/** Specify the height of the bar with units in a string format */
	barHeight: PropTypes.string,
	/** Specify a class name to be added to the outer element */
	className: PropTypes.string
}

export default StackedBarSingleChartTableRow;