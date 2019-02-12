import React from 'react';
import { connect } from 'react-redux';

import * as CONSTANTS from '../js/constants';

import { hydrate as hydateDataManagerAction } from '../state/reducers/data-sets';

import hastReactRenderer from '../js/hast-react-renderer';

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
		return (
			<div>
        {hastReactRenderer(this.props.pathContext.markdown.htmlAst)}  
      </div>
		);
	}
}
export default connect(
  state => ({}),
  dispatch => ({  hydateDataManager: (dataSets) => dispatch(hydateDataManagerAction(dataSets)),
              }),
)(HowItWorksDefault);
