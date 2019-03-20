import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import * as CONSTANTS from '../js/constants';

import { hydrate as hydateDataManagerAction } from '../state/reducers/data-sets';

import hastReactRenderer from '../js/hast-react-renderer';
import {PageToc} from '../components/navigation/PageToc'

import { withPrefixSVG } from '../components/utils/temp-link';


import DefaultLayout from '../components/layouts/DefaultLayout'

class HowItWorksDefault extends React.Component {

  constructor(props){
    super(props);

    this.hydrateStore();
  }

  /**
   * Add the data to the redux store to enable 
   * the components to access filtered data using the 
   * reducers
   **/
  hydrateStore(){
    this.props.hydateDataManager([
      {key: CONSTANTS.DISBURSEMENTS_ALL_KEY, data: this.props.pathContext.disbursements},
    ]);
  }

  componentDidMount() {
    const script1 = document.createElement("script");

    script1.src = withPrefixSVG("/public/js/main.min.js");
    script1.async = false;

    document.body.appendChild(script1);
  }

	render () {
    let title = this.props.pathContext.markdown.frontmatter.title || "Natural Resources Revenue Data";
		return (
      <DefaultLayout>
  			<div>
          <Helmet
              title={title}
              meta={[
                  // title
                  { name: "og:title", content: title},
                  { name: "twitter:title", content: title},
              ]}

              />
          {hastReactRenderer(this.props.pathContext.markdown.htmlAst)} 
        </div>
      </DefaultLayout>
		);
	}
}
export default connect(
  state => ({}),
  dispatch => ({  hydateDataManager: (dataSets) => dispatch(hydateDataManagerAction(dataSets)),
              }),
)(HowItWorksDefault);
