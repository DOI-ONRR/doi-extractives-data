'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Link from '../utils/temp-link';

import { connect } from 'react-redux';
import { selectYear } from '../../store/reducers/disbursements';

import slugify from 'slugify';
import lazy from 'lazy.js';
import utils from '../../js/utils';

import DataAndDocs from '../layouts/DataAndDocs';
import GlossaryTerm from '../utils/glossary-term.js';
import StickyHeader from '../layouts/StickyHeader';
import YearSelector from '../atoms/YearSelector';
import StackedBarSingleChartTableRow from '../tables/StackedBarSingleChartTableRow';

import fundedByCongress from '../../data/funded_by_congress.yml';
import fundExplanation from '../../data/fund_explanation.yml';


/** Define data display attributes */
const DATA_KEYS = {
	ONSHORE: 'Onshore',
	GOMESA: 'GOMESA',
	EIGHT_G: '8(g)',
	OFFSHORE: 'Offshore',
};
// Also sets the default order to display in the legend based on order below
const LEGEND_NAMES = {
	[DATA_KEYS.ONSHORE]: 
		{
			displayName: 'Onshore',
			sortOrderNum: 0
		},
	[DATA_KEYS.GOMESA]: 
		{
			displayName: () => (<span><GlossaryTerm>GOMESA</GlossaryTerm> offshore</span>),
			sortOrderNum: 1
		},
	[DATA_KEYS.EIGHT_G]: 
		{
			displayName: () => (<span><GlossaryTerm>8(g)</GlossaryTerm> offshore</span>),
			sortOrderNum: 2
		},
	[DATA_KEYS.OFFSHORE]: 
		{
			displayName: 'Other offshore',
			sortOrderNum: 3
		},
};

class NationalDisbursements extends React.Component{

	state = {
		year: this.props.year,
		years: this.props.years,
		disbursements: this.props.disbursements
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.year !== this.state.year) {
			this.setState({	year: nextProps.year, 
							years: nextProps.years,
							disbursements: nextProps.disbursements});
		}
	}

	render(){
		let disbursementsForYear = this.state.disbursements[this.state.year];
		let fundedByCongressForYear = fundedByCongress[this.state.year];
		let noDataExplanation = fundExplanation[this.state.year];

		return (
			<section id="federal-disbursements">
				<h2>Federal disbursements</h2>

				<p>After collecting revenue from natural resource extraction, the Office of Natural Resources Revenue (ONRR) distributes that money to different agencies, funds, and local governments for public use. This process is called “disbursement.”
					
					{((this.state.disbursements !== undefined) && (disbursementsForYear !== undefined)) &&
						<strong>
							{" "}In {this.state.year}, ONRR disbursed a total of {utils.formatToDollarInt(disbursementsForYear.total)}
						</strong>
					}
				</p>
				<p>
					<Link to="/downloads/disbursements/" className="data-downloads">
						<DataAndDocs />
					</Link>
				</p>

	            <StickyHeader headerId="by-fund" headerText='Disbursements by recipient'>
	                <YearSelector years={this.state.years} classNames="flex-row-icon" selectYearAction={selectYear} />
	            </StickyHeader>

	            <table className="article_table">
	            	<thead>
	            		<tr>
		            		<th>Recipient</th>
		            		<th>Amount</th>
		            	</tr>
	            	</thead>
	            	<tbody className="disbursement-stacked-bar">
	            	{disbursementsForYear &&
	            		disbursementsForYear.disbursements.map((fundDisbursements, index ) => {

	            			for(let fundKey in fundDisbursements) {
	            				let fundAdditionalData;
	            				if(fundedByCongressForYear && fundedByCongressForYear[fundKey]) {
	            					fundAdditionalData = [];
	            					fundAdditionalData.push(
	            						{
	            							name: "Funded by Congress",
	            							value: utils.formatToDollarInt(fundedByCongressForYear[fundKey])
	            						});
								}
								
								let fundNoDataExplanation;
								if(noDataExplanation && noDataExplanation.fund === fundKey) {
									fundNoDataExplanation = noDataExplanation.explanation;
								}

			            		return (<StackedBarSingleChartTableRow 
			            					key={index+fundKey} 
			            					year={this.state.year}
			            					name={fundDisbursements[fundKey].name}
			            					description={fundDisbursements[fundKey].description} 
			            					descriptionLink={fundDisbursements[fundKey].link}
			            					legendNames = {LEGEND_NAMES}
			            					legendDataFormatFunc = {utils.formatToDollarInt}
			            					chartData={fundDisbursements[fundKey].disbursements}
			            					maxValue={disbursementsForYear.highestFundValue}
			            					additionalData={fundAdditionalData}
											noDataExplanation={fundNoDataExplanation}
			            					/>);
	            			}
	            		})
	            	}
		            </tbody>
		        </table>

			</section>
		);
	}
	
}

NationalDisbursements.propTypes = {
	/** The current year selected in the drop down. CONNECTED BY STORE. */
	year: PropTypes.number,
	/** All the years the data is available. CONNECTED BY STORE. */
	years: PropTypes.array,
	/** All the disbursements.  CONNECTED BY STORE. */
	disbursements:  PropTypes.object,
}


export default connect(
  state => ({ 	year: state.disbursements.year,
  				years: state.disbursements.years,
  				disbursements: state.disbursements.disbursements})
)(NationalDisbursements);
