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
		console.log(this.state, this.props);
		return (
			<div className={styles.root}>
				DisplayYear
			</div>
		);
	}
}

DisplayYear.propTypes = {
	/** fiscal year or calendar year */
	type: PropTypes.oneOf(['fiscal', 'calendar']),
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