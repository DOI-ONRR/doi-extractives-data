import React from 'react';

import hastReactRenderer from '../js/hast-react-renderer';

class HowItWorksDefault extends React.Component {
	render () {
		return (
			<div>{hastReactRenderer(this.props.pathContext.markdown.htmlAst)}</div>
		);
	}
}
export default HowItWorksDefault;