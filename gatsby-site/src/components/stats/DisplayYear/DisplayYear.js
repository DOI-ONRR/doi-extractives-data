import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import styles from "./DisplayYear.module.css"

import CONSTANTS from '../../../js/constants';
import utils from '../../../js/utils';

class DisplayYear extends React.Component{

	state = {
		FiscalYear: this.props.FiscalYear,
		CalendarYear: this.props.CalendarYear,
	}

	render() {
		let years = (this.props['accounting-type'] === 'calendar')? this.state.CalendarYear : this.state.FiscalYear;
		
		let displayYearValue = '';

		switch(this.props['data-set-key'].toLowerCase()) {
			case 'disbursements':
				displayYearValue = years.disbursementsAll;
				break;
		}

		return (
			<span className={styles.root}>
				{displayYearValue}
			</span>
		);
	}
}

DisplayYear.propTypes = {
	/** fiscal year or calendar year */
	'accounting-type': PropTypes.oneOf(['fiscal', 'calendar']),
	/** Data Set Key to find the year values */
	'data-set-key': PropTypes.string.isRequired,
}

DisplayYear.defaultProps = {
	type: 'calendar'
}

export default connect(
  state => ({
    "FiscalYear": state[CONSTANTS.DATA_SETS_STATE_KEY]["FiscalYear"],
    "CalendarYear": state[CONSTANTS.DATA_SETS_STATE_KEY]["CalendarYear"],
  }),
  dispatch => ({})
)(DisplayYear);