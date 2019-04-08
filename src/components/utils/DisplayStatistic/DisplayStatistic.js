import React from 'react'
import { connect } from 'react-redux'

import { filterDataSets as filterDataSetsAction } from '../../../state/reducers/data-sets'

import styles from './DisplayStatistic.module.scss'

import CONSTANTS from '../../../js/constants'
import utils from '../../../js/utils'

class DisplayStatistic extends React.Component {
  constructor (props) {
    super(props)

    this.FilteredResultsId = Date.now().toString()

    this.filter = (typeof this.props.filter === 'string') ? JSON.parse(this.props.filter) : this.props.filter
    this.options = (typeof this.props.options === 'string') ? JSON.parse(this.props.options) : this.props.options

    this.state = {
      text: this.getFilteredData(this.filter)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.FilteredResults) {
      if (this.options) {
        this.setState({ text: utils[this.options.format](nextProps.FilteredResults[this.FilteredResultsId]) })
      }
      else {
        this.setState({ text: nextProps.FilteredResults[this.FilteredResultsId] })
      }
    }
  }

  getFilteredData (filter) {
    let text = ''

    if (filter.dataAttribute === 'FiscalYear') {
      text = this.props['FiscalYear'][filter.sourceKey]
    }
    else {
      this.props.filterData([{
        id: this.FilteredResultsId,
        sourceKey: filter.sourceKey,
        options: {
        },
        filter: {
          sumBy: filter.sumBy,
          where: filter.where,
          select: filter.dataAttribute,
        }
      }])
    }

    return text
  }

  render () {
    return (
      <span>
        {this.state.text}
      </span>
    )
  }
}

export default connect(
  state => ({
    'FiscalYear': state[CONSTANTS.DATA_SETS_STATE_KEY]['FiscalYear'],
    'FilteredResults': state[CONSTANTS.DATA_SETS_STATE_KEY]['FilteredResults'],
  }),
  dispatch => ({
    filterData: configs => dispatch(filterDataSetsAction(configs)),
  })
)(DisplayStatistic)
