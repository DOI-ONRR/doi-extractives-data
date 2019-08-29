import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import CONSTANTS from '../../../js/constants'

import { setDataSelectedById as setDataSelectedByIdAction } from '../../../state/reducers/data-sets'

import yearTheme from './YearDropDown.module.scss'
import standardTheme from './StandardDropDown.module.scss'

/***
 * This drop down is integrated with our redux store and can use the dataSet object to get all its info and state change.
 * It is also possible to not use a data set and juist pass in the needed info via props.
 *
 ***/
class DropDown extends React.Component {
  state = {
    selectedKey: findSelectedKey(this.props),
    defaultKey: findDefaultKey(this.props),
    options: getOptions(this.props),
    dataSet: this.props.dataSet,
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      selectedKey: findSelectedKey(nextProps),
    	defaultKey: findDefaultKey(nextProps),
    	options: getOptions(nextProps),
    	dataSet: nextProps.dataSet,
    })
  }

  onChangeHandler (e, key) {
    e.stopPropagation()

    if (this.state.dataSet) {
    	this.props.setSelectedOption([{ id: this.state.dataSet.dataId, dataKey: e.target.value, syncId: this.state.dataSet.syncId }])
    }

    if (this.props.action) {
    	this.props.action(e.target.value)
    }
  }

  render () {
  	let { options, selectedKey, defaultKey } = this.state
    let styles = (this.props.theme === 'year') ? yearTheme : standardTheme
    defaultKey = (selectedKey !== undefined) ? undefined : defaultKey

    return (
      <div className={styles.root}>
        <select onChange={this.onChangeHandler.bind(this)} defaultValue={defaultKey} value={selectedKey}>
          {options &&
						options.map((option, index) => {
						  let name, value, placeholder

						  if (typeof option === 'string' || typeof option === 'number') {
						    name = value = option
						  }
						  else if (typeof option === 'object') {
						    name = option.name
						    value = option.key
						    placeholder = option.placeholder
						  }

						  return (
						    <React.Fragment>
						      {placeholder
						        ? <option className={styles.option} key={index + '_' + value} value={value} disabled selected hidden>
						          {name}
						        </option>
						        : <option className={styles.option} key={index + '_' + value} value={value} >
						          {name}
						        </option>
						      }
						    </React.Fragment>
						  )
						})
          }
        </select>
      </div>
    )
  }
}

DropDown.propTypes = {
  /** Array of objects or strings for all the options. The default selected value should be mark as default: true */
  options: PropTypes.array,
  /** Data set Id to be used for populating and updating selected state. If dataSet is used options is ignored. */
  dataSetId: PropTypes.string,
  /** Function to call on change. */
  action: PropTypes.func,
  /** Sorting options in the list */
  sortType: PropTypes.oneOf(['ascending', 'descending', 'none']),
  theme: PropTypes.oneOf(['year', 'standard']),
  defaultOptionIndex: PropTypes.number
}

DropDown.defaultProps = {
  sortType: 'descending',
  theme: 'standard'
}

export default connect(
  (state, ownProps) => ({
  	dataSet: state[CONSTANTS.DATA_SETS_STATE_KEY][ownProps.dataSetId],
  }),
  dispatch => ({
  	setSelectedOption: payload => dispatch(setDataSelectedByIdAction(payload)),
  }))(DropDown)

const findDefaultKey = props => {
  let defaultKey
  let { options, dataSet, defaultOptionIndex, defaultOptionValue } = props
  if (dataSet) {
    defaultKey = dataSet.selectedDataKey
  }
  else if (options && defaultOptionIndex) {
    defaultKey = options[defaultOptionIndex]
  }
  else if (options && defaultOptionValue) {
    defaultKey = defaultOptionValue
  }
  else if (options) {
    defaultKey = options.find((option, index) => {
      return (typeof option === 'string' || typeof option === 'number') ? index === 0 : option.default
    })
    defaultKey = (typeof defaultKey === 'object') ? defaultKey.key : defaultKey
  }
  return defaultKey
}

const findSelectedKey = props => {
  let selectedKey
  let { options, dataSet, selectedOptionIndex, selectedOptionValue } = props
  if (dataSet) {
    selectedKey = dataSet.selectedDataKey
  }
  else if (options && selectedOptionValue) {
    selectedKey = selectedOptionValue
  }
  else if (options && selectedOptionIndex) {
    selectedKey = options[selectedOptionIndex]
  }
  return selectedKey
}

const getOptions = props => {
  let { options, dataSet, sortType } = props

  if (dataSet) {
    options = dataSet.data.map(item => Object.keys(item)[0])
  }

  if (sortType !== 'none' && options) {
    options.sort()
    if (sortType === 'descending') {
      options.reverse()
    }
  }

  return options
}
