import React from 'react';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import Link from '../../utils/temp-link';

import lazy from 'lazy.js';

import * as OPT_IN_STATE_REVENUES from '../../../data/opt_in_state_revenues';
import OPT_IN_STATE_FUNDS from '../../../data/opt_in_state_funds.yml';

import DataAndDocs from 'components/layouts/DataAndDocs';

import utils from '../../../js/utils';

const StateDisbursements = (props) => {
	let revenueYear = props.usStateData.state_revenue_year || 2014;
	let revenueFunds = OPT_IN_STATE_REVENUES[props.usStateData.unique_id].funds;
	let revenueTotal = revenueFunds.Total.All[revenueYear];

	return (
		<div>
			{revenueFunds &&
				<div>

					{ReactHtmlParser(props.usStateFields.state_disbursements)}

					<h4>Distribution of {props.usStateData.title} state revenues ({ revenueYear })</h4>
					
					<p>
						In { revenueYear }, the state of {props.usStateData.title} distributed <strong>{utils.formatToDollarInt(revenueTotal)} in state revenue from natural resource extraction</strong> to state and local funds.
					</p>

					<table is="bar-chart-table" class="table-basic">
						<thead>
							<tr>
							  <th><strong>State fund</strong></th>
							  <th className="num"><strong>Distribution</strong></th>
							</tr>
						</thead>

						{
							(lazy(revenueFunds).toArray()).map((fund, index) => {

								let fundType = fund[0];
								let fundName = fundType;
								let fundSlug = utils.formatToSlug(fundName);
								let fundSources = fund[1];
								let fundInfo = OPT_IN_STATE_FUNDS[props.usStateData.unique_id] && OPT_IN_STATE_FUNDS[props.usStateData.unique_id][fundType];
								let fundDollars = fundSources.All[revenueYear];

								return (

									<tbody key={index} id={"revenue-disbursement-fund-"+fundSlug} className="table-accordion-group">
										<tr>
											{fundInfo ?
												<td>
													<button is="aria-toggle" aria-controls={"fund-"+fundSlug} aria-expanded="false" class="not-button-like">{ fundName }</button>
												</td>
												:
												<td>
													{ fundName }
												</td>
											}
											<td className="numeric" data-value={fundDollars} data-year-values={ JSON.stringify(fundSources.All) }>
												{ utils.formatToDollarInt(fundDollars) }
											</td>
										</tr>
										{fundInfo &&
											<tr id={"fund-"+fundSlug} >
												<td colSpan="2">{fundInfo}</td>
											</tr>
										}
									</tbody>

								);

							})
						}
					</table>

				</div>
			}

			{props.usStateFields.state_saving_spending &&
				<div>
					<h4 id="saving-and-spending">Saving and spending revenue from extraction</h4>
					<p>Many states choose to establish permanent mineral trust funds, which can help governments dependent on revenue from natural resources smooth revenue and investments across boom and bust cycles.</p>

					{ReactHtmlParser(props.usStateFields.state_saving_spending)}
				</div>
			}

		</div>
	);
};

export default StateDisbursements;