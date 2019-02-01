import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { filterDataSets as filterDataSetsAction } from '../../../state/reducers/data-sets';

import styles from "./DisplayDisbursement.module.css"

import CONSTANTS from '../../../js/constants';
import utils from '../../../js/utils';

class DisplayDisbursement extends React.Component{

	state = {
		FiscalYear: this.props.FiscalYear,
		CalendarYear: this.props.CalendarYear,
	}

	render() {
		console.log(this.props);

		return (
			<span className={styles.root}>
				DisplayDisbursement
			</span>
		);
	}
}


export default connect(
  state => ({
    "FiscalYear": state[CONSTANTS.DATA_SETS_STATE_KEY]["FiscalYear"],
    "CalendarYear": state[CONSTANTS.DATA_SETS_STATE_KEY]["CalendarYear"],
  }),
  dispatch => ({
    filterData: (configs) => dispatch( filterDataSetsAction(configs) ),
  })
)(DisplayDisbursement);