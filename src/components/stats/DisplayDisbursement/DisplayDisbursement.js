import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import styles from "./DisplayDisbursement.module.css"

import CONSTANTS from '../../../js/constants';
import utils from '../../../js/utils';

class DisplayDisbursement extends React.Component{

	state = {
		FiscalYear: this.props.FiscalYear,
		Disbursements: this.props.Disbursements,
	}

	componentWillReceiveProps(nextProps) {
		this.setState({...nextProps});
	}

	render() {
		let filter = (typeof this.props.filter === 'string')? JSON.parse(this.props.filter) : this.props.filter;

		let disbursementValue = filterSourceData(this.state.Disbursements, filter, this.state.FiscalYear);

		return (
			<span className={styles.root}>
				{disbursementValue}
			</span>
		);
	}
}


export default connect(
  state => ({
    "FiscalYear": state[CONSTANTS.DATA_SETS_STATE_KEY][CONSTANTS.FISCAL_YEAR_KEY][CONSTANTS.DISBURSEMENTS_ALL_KEY],
    "Disbursements": state[CONSTANTS.DATA_SETS_STATE_KEY][CONSTANTS.SOURCE_DATA_STATE_KEY][CONSTANTS.DISBURSEMENTS_ALL_KEY],
  }),
  dispatch => ({})
)(DisplayDisbursement);


const filterSourceData = (data, filter, fiscalYear) => {

	// Make a deep copy
	let filteredSource = JSON.parse(JSON.stringify(data));

	// Filter the fund
	if(filter.Fund){
		filteredSource = filteredSource.filter((item) => {
			return item.data.Fund === filter.Fund;
		});
	}

	// Filter Year
	if(filter.Year === undefined){
		filteredSource = filteredSource.filter((item) => {
			return item.data.Year === fiscalYear;
		});
	}

	let total = utils.sumBy(filteredSource, "data.Disbursement");
	
	let formattedTotal = utils.formatToSigFig_Dollar(total, 1);

	return formattedTotal;
}