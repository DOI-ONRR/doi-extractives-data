import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

import {KeyStatsSection} from '../components/sections/KeyStatsSection';
import {WhatsNew} from '../components/sections/WhatsNew';

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

        <KeyStatsSection></KeyStatsSection>

        <WhatsNew />
      </main>
		);
	}
}

export default connect(
  state => ({}),
)(HomePage);