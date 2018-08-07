'use strict';

import React from 'react';
import Link from 'components/utils/temp-link';

import { connect } from 'react-redux';
import { selectYear } from 'store/reducers/disbursements';

import slugify from 'slugify';
import lazy from 'lazy.js';
import utils from 'js/utils';

import DataAndDocs from 'components/layouts/DataAndDocs';
import GlossaryTerm from 'components/utils/glossary-term.js';
import StickyHeader from 'components/layouts/StickyHeader';
import YearSelector from 'components/atoms/YearSelector';
import StackedBarSingleChartTableRow from 'components/molecules/StackedBarSingleChartTableRow';

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

		return (
			<section id="federal-disbursements">
				<h2>Federal disbursements</h2>

				<p>After collecting revenue from natural resource extraction, the Office of Natural Resources Revenue (ONRR) distributes that money to different agencies, funds, and local governments for public use. This process is called “disbursement.”
					
					{((this.state.disbursements !== undefined) && (disbursementsForYear !== undefined)) &&
						<strong>
							{" "}In {this.state.year} , ONRR disbursed a total of {utils.formatToDollarInt(disbursementsForYear.total)}
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
	            	<tbody>
	            	{disbursementsForYear &&
	            		disbursementsForYear.disbursements.map((fundDisbursements, index ) => {

	            			for(let fundKey in fundDisbursements) {
			            		return (<StackedBarSingleChartTableRow 
			            					key={index+fundKey} 
			            					year={this.state.year}
			            					name={fundDisbursements[fundKey].name}
			            					description={fundDisbursements[fundKey].description} 
			            					descriptionLink={fundDisbursements[fundKey].link}
			            					keysClassNames={KEYS_FOR_DISBURSEMENTS_CLASSNAMES}
			            					keysLegendDisplay = {KEYS_FOR_DISBURSEMENTS_LEGEND}
			            					chartData={fundDisbursements[fundKey].disbursements}
			            					maxValue={disbursementsForYear.highestFundValue}/>);
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
  state => ({ 	year: state.disbursements.year,
  				years: state.disbursements.years,
  				disbursements: state.disbursements.disbursements})
)(NationalDisbursements);
