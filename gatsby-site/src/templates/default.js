import React from 'react';
import { connect } from 'react-redux';

import * as CONSTANTS from '../js/constants';

import hastReactRenderer from '../js/hast-react-renderer';

import utils from '../js/utils';

class DefaultTemplate extends React.Component {
	render () {
		console.log(this.props);
		return (
			<main>
				<section className='layout-content container-page-wrapper container-margin'>
					<article className="container-left-7 container-shift-reverse-2">
						{hastReactRenderer(this.props.pathContext.markdown.htmlAst)}
					</article>
				</section>
			</main>
		);
	}
}
export default connect(
  state => ({}),
  dispatch => ({}),
)(DefaultTemplate);