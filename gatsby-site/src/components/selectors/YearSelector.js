import React from 'react';
import { withPrefix } from 'components/utils/temp-link'

const YearSelector = (props) => {

    const selectClassNames = {className:"chart-selector "+props.classNames}
   
    function onChangeHandler(e) {
        e.stopPropagation();
        console.log("Year Selected: ",e.target.value);
    }

    return (
        <select {...selectClassNames} onChange={onChangeHandler.bind(this)}>
            {props.years.map((year, index) => (
                <option key={index} value={year}>{ year}</option>
            ))}
        </select>
    );

};

export default YearSelector;