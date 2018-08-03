import React from 'react';
import ReactDOM from 'react-dom';

import utils from 'js/utils';

class ChartLegend extends React.Component {

	getKeyDisplayName(key){
		if(this.props.keysLegendDisplay[key]) {
			if(typeof this.props.keysLegendDisplay[key] === 'function') {
				return this.props.keysLegendDisplay[key]();
			}
			else
			{
				return this.props.keysLegendDisplay[key];
			}
		}
		return key;
	}

	render() {
		let keys = Object.keys(this.props.chartData[0]);
		let total = 0;
		return(
			<table className={this.props.className}>
				<tbody>
					{
						keys.map((key, index) => {
							total += this.props.chartData[0][key];
							return(
								<tr key={key} className={this.props.keysClassNames[key]} >
									<td>
										<div/>
									</td>
									<td>
										{this.getKeyDisplayName(key)}:
									</td>
									<td>
										{utils.formatToDollarInt(this.props.chartData[0][key])}
									</td>
								</tr>
							);
						})
					}
					<tr>
						<td>
						</td>
						<td>
							Total:
						</td>
						<td>
							{utils.formatToDollarInt(total)}
						</td>
					</tr>
				</tbody>
			</table>
		);
	}
}

export default ChartLegend;