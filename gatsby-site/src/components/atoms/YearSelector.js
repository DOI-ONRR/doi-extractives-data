import React from 'react';
import { withPrefix } from 'components/utils/temp-link'

import { connect } from 'react-redux';
import { yearSelected as yearSelectedAction } from 'state/app';

const YearSelector = (props) => {

    const selectClassNames = {className:"chart-selector "+props.classNames}
   
    function onChangeHandler(e) {
        e.stopPropagation();
        props.yearSelected(parseInt(e.target.value), props.scope);
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
  dispatch => ({ yearSelected: (year, scope) => dispatch(yearSelectedAction(year, scope)) }),
)(YearSelector);