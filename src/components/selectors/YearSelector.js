import React from 'react'
import { withPrefix } from '../utils/temp-link'

import { connect } from 'react-redux'

const YearSelector = props => {
  const selectClassNames = { className: 'chart-selector ' + props.classNames }
  const selectName = 'selectYear'
  const selectLabel = 'Select Year'

  function onChangeHandler (e) {
    e.stopPropagation()
    if (props.selectYearAction) {
      props.selectYear(parseInt(e.target.value), props.selectYearAction)
    }
  }

  return (
    <select {...selectClassNames} onChange={onChangeHandler.bind(this)} name={selectName} aria-label={selectLabel}>
      {props.years.map((year, index) => (
        <option key={index} value={year}>{ year}</option>
      ))}
    </select>
  )
}

export default connect(
  state => ({}),
  dispatch => ({ selectYear: (year, action) => dispatch(action(year)) })
)(YearSelector)
