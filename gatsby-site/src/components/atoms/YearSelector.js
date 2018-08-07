import React from 'react';
import { withPrefix } from 'components/utils/temp-link'

import { connect } from 'react-redux';

const YearSelector = (props) => {

    const selectClassNames = {className:"chart-selector "+props.classNames}
   
    function onChangeHandler(e) {
        e.stopPropagation();
        props.selectYear(parseInt(e.target.value), props.selectYearAction);
    }

    return (
        <select {...selectClassNames} onChange={onChangeHandler.bind(this)}>
            {props.years.map((year, index) => (
                <option key={index} value={year}>{ year}</option>
            ))}
        </select>
    );

};

export default connect(
  state => ({}),
  dispatch => ({ selectYear: (year, action) => dispatch(action(year)) }),
)(YearSelector);