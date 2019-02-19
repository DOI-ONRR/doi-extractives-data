import React from 'react';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import Helmet from 'react-helmet';

import * as CONSTANTS from '../js/constants';

import hastReactRenderer from '../js/hast-react-renderer';

import utils from '../js/utils';

import {PageToc} from '../components/navigation/PageToc'

class DefaultTemplate extends React.Component {
	render () {
		let title = this.props.pathContext.markdown.frontmatter.title || "Natural Resources Revenue Data";
		console.log(this.props.pathContext.markdown.frontmatter);
		return (
			<main>
        <Helmet
            title={title}
            meta={[
                // title
                { name: "og:title", content: title},
                { name: "twitter:title", content: title},
            ]}

            />
				<section className='layout-content container-page-wrapper container-margin'>
					<article className="container-left-9">
						{hastReactRenderer(this.props.pathContext.markdown.htmlAst)}
					</article>
					<MediaQuery minWidth={481}>	
						<div className="container-right-3">			
							<PageToc scrollOffset={190}/>
						</div>
					</MediaQuery>
					<MediaQuery maxWidth={481}>	
						<div style={{position:'absolute', width: '100%', top: '-45px'}}>			
							<PageToc scrollOffset={190}/>
						</div>
					</MediaQuery>
				</section>
			</main>
		);
	}
}
export default connect(
  state => ({}),
  dispatch => ({}),
)(DefaultTemplate);