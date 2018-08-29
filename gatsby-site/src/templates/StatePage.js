import React from 'react';
//import { withPrefix } from '../utils/temp-link'

import { connect } from 'react-redux';

const StatePages = (props) => {
	console.log(props);
    return (
        <div>
        	State Pages
        </div>
    );

};

export default connect(
  state => ({}),
  dispatch => ({}),
)(StatePages);