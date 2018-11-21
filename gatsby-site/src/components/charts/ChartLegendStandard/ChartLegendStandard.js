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
		let data = this.props.data;
		let sortOrder = (this.props.displayConfig && this.props.displayConfig.sortOrder) ? this.props.displayConfig.sortOrder : Object.keys(data);
		// reverse the order to show from bottom to top per requirements
		sortOrder = sortOrder.slice().reverse();

		let styleMap = this.props.displayConfig && this.props.displayConfig.styleMap;
		let units = this.props.displayConfig && this.props.displayConfig.units;

		let total = 0;
		return(
			<table className={styles.chartLegendStandard}>
				<thead>
      		<tr>
        		<th colSpan="2">Source</th>
        		<th>{this.props.dataKey && this.props.dataKey+(units === "$" ? "" : " ("+units+")")}</th>
        	</tr>
      	</thead>
				<tbody>
					{
						sortOrder.map((key, index) => {
							if(data[key]){
								total += this.props.data[key];
								return(
									<tr key={key}  >
										<td>
											<div className={(styleMap && styleMap[key])} />
										</td>
										<td>
											{this.getKeyDisplayName(key)}:
										</td>
										<td>
											{ this.props.dataFormatFunc ?
												this.props.dataFormatFunc(this.props.data[key])
												:
												data[key]
											}
										</td>
									</tr>
								);
							}
							else {
								return(
									<tr key={key}  >
										<td>
											<div className={(styleMap && styleMap[key])} />
										</td>
										<td>
											{this.getKeyDisplayName(key)}:
										</td>
										<td>
											-
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
				</tbody>
			</table>
		);
	}
}

ChartLegendStandard.propTypes = {
	/** Units label to display for the values */
	units: PropTypes.string,
	/** Array of key value pairs */
	data: PropTypes.object.isRequired,
	/** Defines the display name/info of the data keys in the chart. Keys should match the data keys */
	displayNames: PropTypes.object,
	/** A function that will be applied on each data item of the chart data */
	dataFormatFunc: PropTypes.func,
	/** Specify a class name to be added to the outer element */
	className: PropTypes.string
}

export default ChartLegendStandard;