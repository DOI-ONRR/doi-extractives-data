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
      (this.state.dataSet !== undefined && (this.state.dataSet.lastUpdated !== nextProps.dataSet.lastUpdated)) ||
      (this.state.dataSet.selectedDataKey !== nextProps.dataSet.selectedDataKey)
    )
  }

  render () {
    return (
      <div className={styles.root}>
        {this.props.render(this.state.dataSet)}
      </div>
    )
  }
}

ChartSelectedContentDetails.propTypes = {
  /** The text to use for the content details.  */
  contentType: PropTypes.oneOf(['offshore-production']),
  /** Data set id to be used for populating and updating state. */
  dataSetId: PropTypes.string.isRequired,
}

export default connect(
  (state, ownProps) => ({
    dataSet: state[CONSTANTS.DATA_SETS_STATE_KEY][ownProps.dataSetId],
  }),
  dispatch => ({}))(ChartSelectedContentDetails)
