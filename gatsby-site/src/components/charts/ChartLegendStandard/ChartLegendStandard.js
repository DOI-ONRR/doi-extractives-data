import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import utils from '../../../js/utils';

import styles from "./ChartLegendStandard.module.css"

/**
 * Chart Legend Standard is used to display rows of data keys and values. Each data key can be 
 * associated with a format function, a css class and a display name.
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
		let {data, styleMap, units, sortOrder, headerName} = this.props;
		// reverse the order to show from bottom to top per requirements
		sortOrder = (sortOrder) ? sortOrder.slice().reverse() : Object.keys(data);

		let total = 0;

		return(
			<table className={styles.chartLegendStandard}>
				<thead>
      		<tr>
        		<th colSpan="2">{headerName || ""}</th>
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
											{this.getKeyDisplayName(key)}
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
											{this.getKeyDisplayName(key)}
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
							Total
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
	/** Array of key value pairs */
	data: PropTypes.object.isRequired,
	/** A function that will be applied on each data item of the chart data */
	dataFormatFunc: PropTypes.func,
	/** Defines the display name/info of the data keys in the chart. Keys should match the data keys */
	displayNames: PropTypes.object,
	/** Define the name of the header that display above the data keys **/
	headerName: PropTypes.string,
	/** Specify the sort order of the data keys **/
	sortOrder: PropTypes.array,
	/** Map data keys to a style class **/
	styleMap: PropTypes.styleMap,
	/** Units label to display for the values */
	units: PropTypes.string,
}

export default ChartLegendStandard;