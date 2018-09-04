import React from 'react';
import Link from '../components/utils/temp-link'
import Helmet from 'react-helmet';

import { connect } from 'react-redux';

import SectionOverview from  '../components/locations/SectionOverview'

const StatePages = (props) => {
	console.log(props);
	const usStateData = props.pathContext.stateData.frontmatter;
    return (
		<main id={"state-"+usStateData.unique_id} className="container-page-wrapper layout-state-pages">
            <Helmet
                title={usStateData.title+" | Natural Resources Revenue Data"}
                meta={[
                    // title
                    { name: "og:title", content: (usStateData.title+" | Natural Resources Revenue Data")},
                    { name: "twitter:title", content: (usStateData.title+" | Natural Resources Revenue Data")},
                ]}

                />
			<section className="container">
				<div>
					<Link className="breadcrumb" to="/explore/">Explore data</Link> /
				</div>
				<h1 id="title">{usStateData.title}</h1>
				<div className="container-left-9">
					<section id="overview" className="section-top">

						<SectionOverview usStateData={usStateData} />

					</section>
				</div>
			</section>
		</main>
    );

};

export default connect(
  state => ({}),
  dispatch => ({}),
)(StatePages);