import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import * as CONSTANTS from '../js/constants';

import { hydrate as hydateDataManagerAction } from '../state/reducers/data-sets';

import hastReactRenderer from '../js/hast-react-renderer';
import {PageToc} from '../components/navigation/PageToc'

import CoalIcon from '-!svg-react-loader!../img/svg/icon-coal.svg';
import OilGasIcon from '-!svg-react-loader!../img/svg/icon-oil.svg';
import MineralsIcon from '-!svg-react-loader!../img/svg/icon-hardrock.svg';
import RenewablesIcon from '-!svg-react-loader!../img/svg/icon-renewables.svg';
import ChevronIcon from '-!svg-react-loader!../img/svg/chevron-lt.svg';


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

	render () {
    let title = this.props.pathContext.markdown.frontmatter.title || "Natural Resources Revenue Data";
		return (
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
        <div className='pre-footer'>
          <section className="container-page-wrapper">
            <ul>
              <h3>Choose a resource to explore:</h3>
              <li><a href="/how-it-works/coal/"><CoalIcon /> Coal</a></li>
              <li><a href="/how-it-works/offshore-oil-gas/"><OilGasIcon /> Oil &amp; Gas</a></li>
              <li><a href="/how-it-works/minerals/"><MineralsIcon /> Nonenergy Minerals</a></li>
              <li><a href="/how-it-works/offshore-renewables/"><RenewablesIcon /> Renewables</a></li>
              <li><a href="/how-it-works/"><ChevronIcon /> Back to How it works</a></li>
            </ul>
          </section>
        </div>
      </div>
		);
	}
}
export default connect(
  state => ({}),
  dispatch => ({  hydateDataManager: (dataSets) => dispatch(hydateDataManagerAction(dataSets)),
              }),
)(HowItWorksDefault);
