import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { setDataSelectedById as setDataSelectedByIdAction } from '../../../state/reducers/data-sets'

import CONSTANTS from '../../../js/constants'

import styles from './StackedBarChart.module.css'

import stackedBarChart from '../../../js/bar-charts/stacked-bar-chart'

class StackedBarChart extends React.Component {
  state = {
    dataSet: this.props.dataSet,
  }

  componentDidMount () {
    // This is a hack to get the correct width of the html element in the dev environment.
    setTimeout(this.delay.bind(this), 1)
  }

  delay () {
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
  }

  componentDidUpdate () {
    if (this.state.dataSet) {
      let { data, selectedDataKey, units, xAxisLabels } = this.state.dataSet
      let { styleMap, sortOrder, maxBarSize } = { ...this.props }
      stackedBarChart.update(ReactDOM.findDOMNode(this),
        { styleMap, sortOrder, maxBarSize, selectedDataKey, units, xAxisLabels, barSelectedCallback: this.barSelectedHandler.bind(this) },
        data)
    }
    else {
      let { data, ...rest } = { ...this.props }
      stackedBarChart.update(ReactDOM.findDOMNode(this), ...rest, data)
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
      ((dataSet.lastUpdated !== newDataSet.lastUpdated)) ||
      ((dataSet.selectedDataKey !== newDataSet.selectedDataKey) ||
      dataSet.lastUpdated === undefined)
    )
  }

  componentWillUnmount () {

  }

  barSelectedHandler (data) {
    this.props.setSelectedData([{ id: this.state.dataSet.dataSetId, dataKey: Object.keys(data)[0], syncId: this.state.dataSet.syncId }])
  }

  render () {
    return (
      <div className={styles.stackedBarChart} />
    )
  }
}

StackedBarChart.propTypes = {
  /** Data set id to be used for populating and updating state. This is the preferred method. */
  dataSetId: PropTypes.string,
  /** The max width of the bar */
  maxBarSize: PropTypes.number,
  /** The order to display the stacked bar keys */
  sortOrder: PropTypes.array,
  /** The map of data keys to style classes */
  styleMap: PropTypes.object,
  /** Function to be called when a bar is selected */
  barSelectedCallback: PropTypes.func,
  /** Function to be called when a bar is hovered */
  barHoveredCallback: PropTypes.func,
  /** This will define the name to be placed under columns */
  groups: PropTypes.object,
  /** The data to populate the chart */
  data: PropTypes.array,
  /** The chart bar to be set to selected */
  selectedDataKey: PropTypes.string,
  /** The units to display on the max extent line */
  units: PropTypes.string,
  /** The labels to display in the xAxis */
  xAxisLabels: PropTypes.object,
}

export default connect(
  (state, ownProps) => ({
    dataSet: state[CONSTANTS.DATA_SETS_STATE_KEY][ownProps.dataSetId],
  }),
  dispatch => ({
    setSelectedData: payload => dispatch(setDataSelectedByIdAction(payload)),
  }))(StackedBarChart)
