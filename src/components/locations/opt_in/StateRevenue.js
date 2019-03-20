import React from 'react'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser'
import Link from '../../utils/temp-link'

import lazy from 'lazy.js'

import * as OPT_IN_STATE_REVENUES from '../../../data/opt_in_state_revenues'
import OPT_IN_STATE_STREAMS from '../../../data/opt_in_state_streams.yml'

import DataAndDocs from 'components/layouts/DataAndDocs'

import utils from '../../../js/utils'

const StateRevenue = props => {
  let revenueYear = props.usStateData.state_revenue_year || 2014
  let revenueStreams = OPT_IN_STATE_REVENUES[props.usStateData.unique_id].streams
  let revenueTotal = revenueStreams.All.Total[revenueYear]

  return (
    <div>

      {revenueStreams &&
				<div>
				  {ReactHtmlParser(props.usStateFields.state_revenue)}

				  <h4>{props.usStateData.title} revenue streams ({revenueYear})</h4>

				  <p>
						In { revenueYear }, the state of {props.usStateData.title} collected <strong>{utils.formatToDollarInt(revenueTotal)} in state revenue from natural resource extraction</strong> (this includes both tax and non-tax revenue). Counties also collect and distribute their own revenue from natural resource extraction.
				  </p>

				  <p>
				    <Link to={'/downloads/USEITI_' + props.usStateData.title + '_revenue_streams.pdf'} className="data-downloads">
				      <DataAndDocs> Download: {props.usStateData.title} revenue streams (PDF)</DataAndDocs>
				    </Link>
				  </p>

				  <table is="bar-chart-table" class="table-basic">
				    <thead>
				      <tr>
							  <th><strong>Revenue stream</strong></th>
							  <th className="num"><strong>Amount collected</strong></th>
				      </tr>
				    </thead>

				    {
				      (lazy(revenueStreams).toArray()).map((stream, index) => {
				        let streamType = stream[0]
				        let streamName = streamType
				        if (streamName === 'All') {
				          streamName = 'Total'
				        }
				        let streamSlug = utils.formatToSlug(streamName)
				        let streamSources = stream[1]
				        let streamInfo = OPT_IN_STATE_STREAMS[props.usStateData.unique_id] && OPT_IN_STATE_STREAMS[props.usStateData.unique_id][streamType]
				        let streamDollars = streamSources.Total[revenueYear]

				        return (

				          <tbody key={index} id={'revenue-disbursement-stream-' + streamSlug} className="table-accordion-group">
				            <tr>
				              {streamInfo
				                ? <td>
				                  <button is="aria-toggle" aria-controls={'stream-' + streamSlug} aria-expanded="false" class="not-button-like">{ streamName }</button>
				                </td>
				                :												<td>
				                  { streamName }
				                </td>
				              }
				              <td className="numeric" data-value={streamDollars} data-year-values={ JSON.stringify(streamSources.Total) }>
				                { utils.formatToDollarInt(streamDollars) }
				              </td>
				            </tr>
				            {streamInfo &&
											<tr id={'stream-' + streamSlug} >
											  <td colSpan="2">{streamInfo}</td>
											</tr>
				            }
				          </tbody>

				        )
				      })
				    }

				  </table>
				</div>

      }

      {props.usStateFields.state_revenue_sustainability &&
				<div>
				  <h4 id="revenue-sustainability">Revenue sustainability</h4>

				  {ReactHtmlParser(props.usStateFields.state_revenue_sustainability)}
				</div>
      }

      {props.usStateFields.state_tax_expenditures &&
				<div>
				  <h4 id="tax-expenditures">Tax expenditures</h4>
				  <p>
						Tax expenditure programs are policy instruments that reduce state and local revenue through changes to the tax code (for example, tax credits, exemptions, preferential tax rates, or deferrals of tax liability).
				  </p>
				  {ReactHtmlParser(props.usStateFields.state_tax_expenditures)}
				</div>
      }

    </div>
  )
}

export default StateRevenue
