import React from 'react';
import Link from 'components/utils/temp-link';

import { connect } from 'react-redux';

import slugify from 'slugify';
import lazy from 'lazy.js';
import utils from 'js/utils';

import DataAndDocs from 'components/layouts/DataAndDocs';
import GlossaryTerm from 'components/utils/glossary-term.js';
import StickyHeader from 'components/layouts/StickyHeader';
import YearSelector from 'components/atoms/YearSelector';
import StackedBarSingleChartTableRow from 'components/molecules/StackedBarSingleChartTableRow';

import FUND_NAMES from '../../../../static/data/fund_names.yml';


const KEYS_FOR_DISBURSEMENTS_ORDER = ['Onshore','GOMESA','Offshore','8(g)'];
const KEYS_FOR_DISBURSEMENTS_CLASSNAMES = {'Onshore': 'stacked-bar-color-0',
										'GOMESA': 'stacked-bar-color-1',
										'Offshore': 'stacked-bar-color-3',
										'8(g)': 'stacked-bar-color-3'};
const KEYS_FOR_DISBURSEMENTS_LEGEND = {
	'Onshore': 'Onshore',
	'Offshore' : 'Other offshore'
};

KEYS_FOR_DISBURSEMENTS_LEGEND['8(g)'] = () => (<span><GlossaryTerm>8(g)</GlossaryTerm> offshore</span>);
KEYS_FOR_DISBURSEMENTS_LEGEND['GOMESA'] = () => (<span><GlossaryTerm>GOMESA</GlossaryTerm> offshore</span>);

const YEAR_SELECTOR_SCOPE = "federal-disbursements";

class NationalDisbursements extends React.Component{

	state = {
		year: this.props.defaultYear,
		disbursementsByFundForSelectedYear: this.getDisbursementsByFundForYear(this.props.defaultYear)
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.yearScope.scope === YEAR_SELECTOR_SCOPE && nextProps.yearScope.year !== this.state.year) {

			this.setState({	year: nextProps.yearScope.year, 
							disbursementsByFundForSelectedYear: this.getDisbursementsByFundForYear(nextProps.yearScope.year)
						});
		}
	}

	getDisbursementsByFundForYear(year){
		let disbursementsForSelectedYear = this.props.allDisbursements.find((disbursementsByYear) => parseInt(disbursementsByYear.Year) === year);
		
		let disbursementsByFund = utils.groupBy(disbursementsForSelectedYear.disbursements, "disbursement.Fund");

		setYearAndFundTotals(disbursementsByFund);

		return (disbursementsByFund);
	}

	render(){

		return (
			<section id="federal-disbursements">
				<h2>Federal disbursements</h2>

				<p>After collecting revenue from natural resource extraction, the Office of Natural Resources Revenue (ONRR) distributes that money to different agencies, funds, and local governments for public use. This process is called “disbursement.”
					
					{this.state.disbursementsByFundForSelectedYear && 
						<strong>
							{" "}In {this.state.year} , ONRR disbursed a total of {utils.formatToDollarInt(this.state.disbursementsByFundForSelectedYear.yearTotal)}
						</strong>
					}
				</p>
				<p>
					<Link to="/downloads/disbursements/" className="data-downloads">
						<DataAndDocs />
					</Link>
				</p>

	            <StickyHeader headerId="by-fund" headerText='Disbursements by recipient'>
	                <YearSelector years={[2017,2016,2015,2014]} classNames="flex-row-icon" scope={YEAR_SELECTOR_SCOPE} />
	            </StickyHeader>

	            <table className="article_table">
	            	<thead>
	            		<tr>
		            		<th>Recipient</th>
		            		<th>Amount</th>
		            	</tr>
	            	</thead>
	            	<tbody>
	            	{
	            		lazy(this.state.disbursementsByFundForSelectedYear).toArray().map((fundDisbursements, index) => {

	            			if(FUND_NAMES[fundDisbursements[0]]){
		            			let fundName = FUND_NAMES[fundDisbursements[0]].name;
		            			let fundDescription = FUND_NAMES[fundDisbursements[0]].description;

		            			let fundLink;
								
								if(fundDisbursements[0]=== "Land & Water Conservation") {
									fundLink = <Link to="/how-it-works/">How this fund works</Link>
								}
								else if(fundDisbursements[0] === "Historic Preservation") {
									fundLink = <Link to="/how-it-works/">How this fund works</Link>
								}

								let fundData = {};

								fundDisbursements[1].map((fundDisbursment, index) => {
									fundData[fundDisbursment.disbursement.Source] = fundDisbursment.disbursement.Disbursement;
								})

			            		return (<StackedBarSingleChartTableRow 
			            					key={index+fundName} 
			            					name={fundName}
			            					description={fundDescription} 
			            					descriptionLink={fundLink}
			            					keysClassNames={KEYS_FOR_DISBURSEMENTS_CLASSNAMES}
			            					keysOrder={KEYS_FOR_DISBURSEMENTS_ORDER}
			            					keysLegendDisplay = {KEYS_FOR_DISBURSEMENTS_LEGEND}
			            					chartData={[fundData]}
			            					maxValue={this.state.disbursementsByFundForSelectedYear.yearFundMaxTotal}/>);
	            			}
	            		})

	            	}
		            </tbody>
		        </table>
	            

			</section>
		);
	}
	
}

export default connect(
  state => ({ defaultYear: state.app.defaultYear, yearScope: state.app.yearScope }),
  dispatch => ({}),
)(NationalDisbursements);

function setYearAndFundTotals(disbursements){
	let yearTotal = 0;
	let yearFundMaxTotal = 0;

	for(let fundKey in disbursements) {
		disbursements[fundKey].fundTotal = 0;

		disbursements[fundKey].map((fundData, index) => {
			fundData.disbursement.Disbursement = Math.round(fundData.disbursement.Disbursement);
			disbursements[fundKey].fundTotal += fundData.disbursement.Disbursement;
		});

		yearTotal += disbursements[fundKey].fundTotal;
		yearFundMaxTotal = (yearFundMaxTotal > disbursements[fundKey].fundTotal)? yearFundMaxTotal : disbursements[fundKey].fundTotal;
	}

	disbursements.yearTotal = yearTotal;
	disbursements.yearFundMaxTotal = yearFundMaxTotal;
}
