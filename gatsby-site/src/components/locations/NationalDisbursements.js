import React from 'react';
import Link from 'components/utils/temp-link';

import slugify from 'slugify';
import lazy from 'lazy.js';
import utils from 'js/utils';

import DataAndDocs from 'components/layouts/DataAndDocs';
import GlossaryTerm from 'components/utils/glossary-term.js';
import StickyHeader from 'components/layouts/StickyHeader';
import YearSelector from 'components/selectors/YearSelector';
import StackedBarSingleChartTableRow from 'components/molecules/StackedBarSingleChartTableRow';

import FEDERAL_DISBURSEMENTS from '../../../static/data/federal_disbursements.yml';
import FUND_NAMES from '../../../static/data/fund_names.yml';

const YEAR = 2017;

const KEYS_FOR_DISBURSEMENTS_ORDER = ['Onshore','GOMESA','Offshore','8(g)'];
const KEYS_FOR_DISBURSEMENTS_CLASSNAMES = {'Onshore': 'stacked-bar-color-0',
										'GOMESA': 'stacked-bar-color-1',
										'Offshore': 'stacked-bar-color-3',
										'8(g)': 'stacked-bar-color-3'};
const KEYS_FOR_DISBURSEMENTS_LEGEND = {
	'Offshore' : 'Other offshore'
};

KEYS_FOR_DISBURSEMENTS_LEGEND['8(g)'] = () => (<span><GlossaryTerm>8(g)</GlossaryTerm> offshore</span>);
KEYS_FOR_DISBURSEMENTS_LEGEND['GOMESA'] = () => (<span><GlossaryTerm>GOMESA</GlossaryTerm> offshore</span>);

const NationalDisbursements = (props) => {

	let disbursementsForSelectedYear = props.allDisbursements.find((disbursementsByYear) => parseInt(disbursementsByYear.Year) === YEAR);
	let maxDisbursementValueForYear = 0;

	if(disbursementsForSelectedYear){
		maxDisbursementValueForYear = Math.max.apply(Math, disbursementsForSelectedYear.disbursements.map((disbursementData, index) => {
			return Math.round(disbursementData.disbursement.Disbursement);
		}));
	}

	return (
		<section id="federal-disbursements">
			<h2 className="stacked-bar">Federal disbursements</h2>

			<p>After collecting revenue from natural resource extraction, the Office of Natural Resources Revenue (ONRR) distributes that money to different agencies, funds, and local governments for public use. This process is called “disbursement.”
				
				{FEDERAL_DISBURSEMENTS.US && 
					<strong>
						{" "}In {YEAR} , ONRR disbursed a total of {utils.formatToDollarInt(FEDERAL_DISBURSEMENTS.US.All.All[YEAR])}
					</strong>
				}
			</p>
			<p>
				<Link to="/downloads/disbursements/" className="data-downloads">
					<DataAndDocs />
				</Link>
			</p>

            <StickyHeader headerText='Disbursements by recipient'>
                <YearSelector years={[2017,2016,2015,2014]} classNames="flex-row-icon" />
            </StickyHeader>

            <table className="article_table">
            	<thead>
            		<tr>
	            		<th>Recipient</th>
	            		<th>Amount</th>
	            	</tr>
            	</thead>
            	<tbody>
	            {disbursementsForSelectedYear &&


	            	
	            	lazy(FUND_NAMES).toArray().map((fund, index) => {

	            		let chartData = [];
	            		let chartKeys = [];

	            		let fundData = {};
	            		let fundTotal = 0;

	            		let fundLink;

						disbursementsForSelectedYear.disbursements.map((disbursementData, index) => {
							if(disbursementData.disbursement.Fund.toLowerCase() === fund[0].toLowerCase()){
								let disbursementValue = Math.round(disbursementData.disbursement.Disbursement);
								fundData[disbursementData.disbursement.Source] = Math.round(disbursementData.disbursement.Disbursement);
								fundTotal += disbursementValue;
								chartKeys.push(disbursementData.disbursement.Source);
							}
						});

						if(fund[0] === "Land & Water Conservation") {
							fundLink = <Link to="/how-it-works/">How this fund works</Link>
						}
						else if(fund[0] === "Historic Preservation") {
							fundLink = <Link to="/how-it-works/">How this fund works</Link>
						}

						chartData.push(fundData);

	            		return (<StackedBarSingleChartTableRow 
	            					key={index} 
	            					name={fund[1].name}
	            					description={fund[1].description} 
	            					descriptionLink={fundLink}
	            					keysClassNames={KEYS_FOR_DISBURSEMENTS_CLASSNAMES}
	            					keysOrder={KEYS_FOR_DISBURSEMENTS_ORDER}
	            					keysLegendDisplay = {KEYS_FOR_DISBURSEMENTS_LEGEND}
	            					chartData={chartData}
	            					chartDataMaxValue={2512808179}
	            					chartKeys={chartKeys}/>);
	            	})
	            }
	            </tbody>
	        </table>
            

		</section>
	);
}

export default NationalDisbursements;

const hydrateFundDisbursementsData = () => {

};