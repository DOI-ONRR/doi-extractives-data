import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import utils from '../../../js/utils';

import styles from "./ChartLegendStandard.module.css"


/**
 * Chart Legend Standard is used to display rows of data keys and values. Each data key can be 
 * associated with a format function, a color(using css) and a display name.
 */
class ChartLegendStandard extends React.Component {

	getKeyDisplayName(key){
		if(this.props.displayNames && this.props.displayNames[key]) {
			if(typeof this.props.displayNames[key].displayName === 'function') {
				return this.props.displayNames[key].displayName();
			}
			else
			{
				return this.props.displayNames[key].displayName;
			}
		}
		return key;
	}

	render() {
		let keys = (this.props.displayNames)? Object.keys(this.props.displayNames) : Object.keys(this.props.data[0]);
		let total = 0;
		return(
			<table className={styles.chartLegendStandard}>
				<thead>
				{this.props.header &&
            		<tr>
	            		<th colSpan="2">{this.props.header[0]}</th>
	            		<th>{this.props.header[1]}</th>
	            	</tr>
				}
            	</thead>
				<tbody>
					{
						keys.map((key, index) => {
							if(this.props.data[0][key]){
								total += this.props.data[0][key];
								return(
									<tr key={key}  >
										<td>
											<div className={"chart-legend-"+index} />
										</td>
										<td>
											{this.getKeyDisplayName(key)}:
										</td>
										<td>
											{ this.props.dataFormatFunc ?
												this.props.dataFormatFunc(this.props.data[0][key])
												:
												this.props.data[0][key]
											}
										</td>
									</tr>
								);
							}
						})
					}
					<tr className={styles.chartLegendStandard_TotalRow}>
						<td colSpan="2">
							Total:
						</td>
						<td>
							{ this.props.dataFormatFunc ?
								this.props.dataFormatFunc(total)
								:
								total
							}
						</td>
					</tr>
					{this.props.additionalData && 
						this.props.additionalData.map((data, index) => {
							return (
								<tr key={index} className="chart-legend-additional-data-row">
									<td />
									<td>{data.name}:</td>
									<td>{data.value}</td>
								</tr>)
						})
					}
				</tbody>
			</table>
		);
	}
}

ChartLegendStandard.propTypes = {
	/** Array 1 to 2 values */
	header: PropTypes.array,
	/** Array of key value pairs */
	data: PropTypes.array.isRequired,
	/** Defines the display name/info of the data keys in the chart. Keys should match the data keys */
	displayNames: PropTypes.object,
	/** A function that will be applied on each data item of the chart data */
	dataFormatFunc: PropTypes.func,
	/** Specify a class name to be added to the outer element */
	className: PropTypes.string
}

export default ChartLegendStandard;