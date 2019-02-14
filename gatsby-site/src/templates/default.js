import React from 'react';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';

import { hydrate as hydateDataManagerAction } from '../state/reducers/data-sets';

import * as CONSTANTS from '../js/constants';

import hastReactRenderer from '../js/hast-react-renderer';

import utils from '../js/utils';

import {PageToc} from '../components/navigation/PageToc'

class DefaultTemplate extends React.Component {

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
		return (
			<main>
				<section className='layout-content container-page-wrapper container-margin'>
					<article className="container-left-9">
						{hastReactRenderer(this.props.pathContext.markdown.htmlAst)}
					</article>
					<MediaQuery minWidth={481}>	
						<div className="container-right-3">			
							<PageToc scrollOffset={-10}/>
						</div>
					</MediaQuery>
					<MediaQuery maxWidth={481}>	
						<div style={{position:'absolute', width: '100%', top: '-45px'}}>			
							<PageToc scrollOffset={-10}/>
						</div>
					</MediaQuery>
				</section>
			</main>
		);
	}
}
export default connect(
  state => ({}),
  dispatch => ({  hydateDataManager: (dataSets) => dispatch(hydateDataManagerAction(dataSets)),
              }),
)(DefaultTemplate);