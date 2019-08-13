import React from 'react'
import PropTypes from 'prop-types'

import Paper from '@material-ui/core/Paper'
import {
  SummaryState,
  IntegratedSummary,
  TreeDataState,
  CustomTreeData
} from '@devexpress/dx-react-grid'
import {
  Grid,
  Table,
  TableHeaderRow,
  TableTreeColumn,
  TableSummaryRow,
  TableFixedColumns
} from '@devexpress/dx-react-grid-material-ui'

const getChildRows = (row, rootRows) => {
  const childRows = rootRows.filter(r => r.parentId === (row ? row.id : undefined))
  return childRows.length ? childRows : null
}
const getDefaultExpandedRowIds = rows => {
  let rowIds = []

  rows.forEach((r, i) => (r.parentId === undefined) && rowIds.push(i))

  return rowIds
}

const summaryCalculator = (type, rows, getValue) => {
  if (type === 'sum') {
    if (!rows.length) {
      return null
    }
    const filteredRows = rows.filter(r => r.parentId !== undefined)
    return IntegratedSummary.defaultCalculator(type, filteredRows, getValue)
  }
  return IntegratedSummary.defaultCalculator(type, rows, getValue)
}

class TreeTable extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      columns: [
        { name: 'rev', title: 'Revenue Type' },
        { name: 'name', title: 'Name' },
        { name: 'sex', title: 'Sex' },
        { name: 'FY2019', title: 'FY 2019' },
        { name: 'car', title: 'Car' },
        { name: 'car2', title: 'Car' },
        { name: 'car3', title: 'Car' },
      ],
      rows: [
	        { id: 1, rev: 'Onshore', name: 'All', sex: 'male', FY2019: 12111 },
	        { id: 2, parentId: 1, rev: 'Onshore', name: 'name', sex: 'male', FY2019: 1212 },
	        { id: 3, parentId: 1, rev: 'Onshore', name: 'name', sex: 'female', FY2019: 12 },
	        { id: 4, rev: 'Offshore', name: 'All', sex: 'both', FY2019: 33333 },
	        { id: 5, parentId: 4, rev: 'Offshore', name: 'name', sex: 'none', FY2019: 333 },
	      ],
      totalSummaryItems: [
        { columnName: 'FY2019', type: 'sum' },
      ],
      treeSummaryItems: [
        { columnName: 'FY2019', type: 'sum' },
        { columnName: 'rev', type: 'count' },
      ],
      tableColumnExtensions: [
        { columnName: 'rev', width: 300 },
      ],
      tableFixedColumns: ['rev'],
    }
  }

  render () {
    const {
      rows, columns, tableColumnExtensions, treeSummaryItems, totalSummaryItems, tableFixedColumns
    } = this.state

  	return (
  		<div style={{ color: 'white' }}>
        <Grid
          rows={rows}
          columns={columns}
        >
          <TreeDataState
            defaultExpandedRowIds={getDefaultExpandedRowIds(rows)}
          />
          <SummaryState
          	totalItems={totalSummaryItems}
          	treeItems={treeSummaryItems}
          />
          <CustomTreeData
            getChildRows={getChildRows}
          />
          <IntegratedSummary
          	calculator={summaryCalculator}
          />
          <Table
          	columnExtensions = {tableColumnExtensions}
          />
          <TableHeaderRow />
          <TableTreeColumn
            for="rev"
          />
          <TableSummaryRow style={{ color: 'white' }} />
          <TableFixedColumns leftColumns={tableFixedColumns}/>
        </Grid>
  		</div>
  	)
  }
}

export default TreeTable
