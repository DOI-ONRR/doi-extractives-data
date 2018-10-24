import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

import {KeyStatsSection} from '../components/sections/KeyStatsSection';
import {WhatsNew} from '../components/sections/WhatsNew';
import {Tabordion, Tab} from '../components/layouts/Tabordion';

class HomePage extends React.Component {

	render() {
		return (
      <main>
        <Helmet
            title="Home | Natural Resources Revenue Data"
            meta={[
                // title
                { name: "og:title", content: "Home | Natural Resources Revenue Data"},
                { name: "twitter:title", content: "Home | Natural Resources Revenue Data"},
            ]}

            />

        <Tabordion>
          <Tab id="tab-overview" name="Overview"> 
            <p>When companies extract natural resources on federal lands and offshore areas, they pay bonuses, rent, and royalties to the federal government. The government distributes these funds for public use in a variety of ways.</p>
          </Tab>
          <Tab id="tab-production" name="Production"> 
            <p>The United States is among the world's top producers of natural gas, oil, and coal. The U.S. is also a global leader in renewable energy production. We have data for energy and mineral production on federal lands and waters and Native American lands and energy production for all owners.</p>
          </Tab>
          <Tab id="tab-revenue" name="Revenue"> 
            <p>Companies pay a wide range of fees, rates, and taxes to extract natural resources in the U.S. The amounts differ depending on the ownership of the resources. They are usually called "revenue" because they represent revenue to the American public.</p>
          </Tab>
          <Tab id="tab-disbursements" name="Disbursements"> 
            <p>After collecting revenue from natural resource extraction, the Office of Natural Resources Revenue (ONRR) distributes that money to different agencies, funds, and local governments for public use. This process is called “disbursement.”</p>
          </Tab>
        </Tabordion>

        <KeyStatsSection></KeyStatsSection>

        <WhatsNew />
      </main>
		);
	}
}

export default connect(
  state => ({}),
)(HomePage);