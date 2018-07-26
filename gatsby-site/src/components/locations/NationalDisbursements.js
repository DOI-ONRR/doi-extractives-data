import React from 'react';
import Link from 'components/utils/temp-link';

import slugify from 'slugify';
import lazy from 'lazy.js';
import utils from 'js/utils';

import DataAndDocs from 'components/layouts/DataAndDocs';
import GlossaryTerm from 'components/utils/glossary-term.js';
import StickyHeader from 'components/layouts/StickyHeader';
import YearSelector from 'components/selectors/YearSelector';

import FEDERAL_DISBURSEMENTS from '../../../static/data/federal_disbursements.yml';

const YEAR = 2017;


const NationalDisbursements = (props) => {

	return (
		<section id="federal-disbursements">
			<h2>Federal disbursements</h2>

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
                <YearSelector years={[2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007]} classNames="flex-row-icon" />
            </StickyHeader>


		</section>
	);
}

export default NationalDisbursements;