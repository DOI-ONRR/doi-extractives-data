import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { setDataSelectedById as setDataSelectedByIdAction } from '../../../state/reducers/data-sets'

import CONSTANTS from '../../../js/constants'

import styles from './Legend.module.scss'

import blockLegend from '../../../js/legends/block-legend'

class Legend extends React.Component {
  state = {
    dataSet: this.props.dataSet,
  }

  componentDidMount () {
    if (this.state.dataSet) {
      let { data, selectedDataKey, units, xAxisLabels } = this.state.dataSet
      let { styleMap, sortOrder, maxBarSize } = { ...this.props }
      blockLegend.create(ReactDOM.findDOMNode(this),
        { styleMap, sortOrder, maxBarSize, selectedDataKey, units, xAxisLabels },
        data)
    }
  }

  /*delay () {
    if (this.state.dataSet) {
      let { data, selectedDataKey, units, xAxisLabels } = this.state.dataSet
      let { styleMap, sortOrder, maxBarSize } = { ...this.props }
      stackedBarChart.create(ReactDOM.findDOMNode(this),
        { styleMap, sortOrder, maxBarSize, selectedDataKey, units, xAxisLabels, barSelectedCallback: this.barSelectedHandler.bind(this) },
        data)
    }
    else {
      let { data, ...rest } = { ...this.props }
      stackedBarChart.create(ReactDOM.findDOMNode(this), ...rest, data)
    }
  }*/

  componentDidUpdate () {
    if (this.state.dataSet) {
      let { data, selectedDataKey, units, xAxisLabels } = this.state.dataSet
      let { styleMap, sortOrder, maxBarSize } = { ...this.props }
      blockLegend.update(ReactDOM.findDOMNode(this),
        { styleMap, sortOrder, maxBarSize, selectedDataKey, units, xAxisLabels },
        data)
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      dataSet: nextProps.dataSet,
    })
  }

  shouldComponentUpdate (nextProps, nextState) {
    let dataSet = this.state.dataSet || this.props.data
    let newDataSet = nextProps.dataSet || nextProps.data
  
    return (
      (dataSet === undefined && newDataSet !== undefined) ||
      (dataSet.lastUpdated !== newDataSet.lastUpdated ||
      dataSet.selectedDataKey !== newDataSet.selectedDataKey ||
      dataSet.lastUpdated === undefined)
    )
  }

  componentWillUnmount () {

  }


  render () {
    //console.log(this.props, this.state)

    return (
      <span className={styles.root}>
        {this.state.dataSet && this.props.render(this.state.dataSet)}
      </span>
    )
  }
}

Legend.propTypes = {
  /** Data set id to be used for populating and updating state. This is the preferred method. */
  dataSetId: PropTypes.string, 
}

export default connect(
  (state, ownProps) => ({
    dataSet: state[CONSTANTS.DATA_SETS_STATE_KEY][ownProps.dataSetId],
  }),
  dispatch => ({
    setSelectedData: payload => dispatch(setDataSelectedByIdAction(payload)),
  }))(Legend)
