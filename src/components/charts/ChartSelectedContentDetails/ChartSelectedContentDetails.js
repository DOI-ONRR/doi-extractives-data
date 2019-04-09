import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import CONSTANTS from '../../../js/constants'

import styles from './ChartSelectedContentDetails.module.scss'

class ChartSelectedContentDetails extends React.Component {
  state = {
    dataSet: this.props.dataSet,
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      dataSet: nextProps.dataSet,
    })
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (
      (this.state.dataSet !== undefined) && 
      (this.state.dataSet.lastUpdated !== nextProps.dataSet.lastUpdated ||
      this.state.dataSet.selectedDataKey !== nextProps.dataSet.selectedDataKey)
    )
  }

  render () {
    return (
      <div className={styles.root}>
        {this.state.dataSet && this.props.render(this.state.dataSet)}
      </div>
    )
  }
}

ChartSelectedContentDetails.propTypes = {
  /** Data set id to be used for populating and updating state. */
  dataSetId: PropTypes.string.isRequired,
}

export default connect(
  (state, ownProps) => ({
    dataSet: state[CONSTANTS.DATA_SETS_STATE_KEY][ownProps.dataSetId],
  }),
  dispatch => ({}))(ChartSelectedContentDetails)
