import React from 'react'
import PropTypes from 'prop-types'

import Paper from '@material-ui/core/Paper'
import { DataTypeProvider,
  SummaryState,
  IntegratedSummary,
  GroupingState,
  IntegratedGrouping,
  SortingState,
  IntegratedSorting
} from '@devexpress/dx-react-grid'

import {
  Grid,
  Table,
  TableHeaderRow,
  TableBandHeader,
  TableGroupRow,
  TableSummaryRow,
  GroupingPanel,
  DragDropProvider,
  Toolbar,
  TableFixedColumns
} from '@devexpress/dx-react-grid-material-ui'

import utils from '../../../js/utils'

import styles from './GroupTable.module.scss'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  overrides: {
    MuiTableCell: {
      root: {
        padding: '0px',
      },
      head: {
        color: styles._textColor,
        fontFamily: styles._baseFontFamily,
        fontSize: '1rem',
        fontWeight: 400,
        borderBottom: '5px solid #cde3c3;',
      },
      body: {
        color: styles._textColor,
        fontFamily: styles._baseFontFamily,
        fontSize: '1rem',
        fontWeight: 300,
      },
      footer: {
        color: styles._textColor,
        fontFamily: styles._baseFontFamily,
        fontSize: '1rem',
        fontWeight: 400,
      },
    },
  }
})
// import CustomTableGroupRow from './plugins/CustomTableGroupRow'

const CustomTableGroupRow_Content = ({ row, ...restProps }) => (
  <span>
    {row.value}
  </span>
)

const CustomTableSummaryRow_GroupRow = ({ ...restProps }) => {
  return (
    <Table.Row {...restProps} className={styles.summaryGroupRow} />
  )
}

const CustomTableSummaryRow_Item = ({ getMessage, ...restProps }) => {
  restProps.value = (isNaN(restProps.value)) ? 0 : restProps.value
  return (
    <div {...restProps} className={styles.summaryCell}>
      {restProps.children.type
        ? restProps.children.type(restProps)
        : (restProps.value)? restProps.value : '-'
      }
    </div>
  )
}

const CustomTableSummaryRow_TotalRow = ({ ...restProps }) => {
  return (
    <Table.Row {...restProps} className={styles.summaryTotalRow} />
  )
}

const CurrencyFormatter = ({ value }) => {
  return (
    <span>
      {utils.formatToDollarInt(value)}
    </span>
  )
}

const CurrencyTypeProvider = props => {
  return (
    <DataTypeProvider
      formatterComponent={CurrencyFormatter}
      {...props}
    />
  )
}

const AllFormatter = ({ value, children }) => {
  return (
    <span>
      {children
        ? 'All ' + children.props.column.plural
        : value
      }
    </span>
  )
}

const AllTypeProvider = props => {
  return (
    <DataTypeProvider
      formatterComponent={AllFormatter}
      {...props}
    />
  )
}

const VolumeFormatter = ({ value }) => {
  return (
    <span>
      {utils.formatToCommaInt(value)}
    </span>
  )
}

const VolumeTypeProvider = props => {
  return (
    <DataTypeProvider
      formatterComponent={VolumeFormatter}
      {...props}
    />
  )
}
class GroupTable extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      columns: props.columns,
      rows: props.rows,
      currencyColumns: props.currencyColumns,
      volumeColumns: props.volumeColumns,
      allColumns: props.allColumns,
      tableColumnExtension: props.tableColumnExtension,
      columnBands: [],
      totalSummaryItems: props.totalSummaryItems,
      groupSummaryItems: props.groupSummaryItems,
      tableGroupColumnExtension: props.tableGroupColumnExtension,
      grouping: props.grouping,
      expandedGroups: props.expandedGroups,
      defaultSorting: props.defaultSorting,
    }

    // this.changeGrouping = grouping => this.setState({ grouping });
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ ...nextProps })
  }

  handleExpandedGroupsChange (expandedGroups) {
    this.setState({ expandedGroups: expandedGroups })
  }

  render () {
    const {
      rows,
      columns,
      currencyColumns,
      volumeColumns,
      allColumns,
      tableColumnExtension,
      columnBands,
      grouping,
      expandedGroups,
      totalSummaryItems,
      groupSummaryItems,
      defaultSorting } = this.state

    return (
    	<div>
        <MuiThemeProvider theme={theme}>
          <Grid
            rows={rows}
            columns={columns}
          >
            <CurrencyTypeProvider
              for={currencyColumns}
            />
            {allColumns &&
              <AllTypeProvider
                for={allColumns}
              />
            }
            <VolumeTypeProvider
              for={volumeColumns}
            />
            <SortingState
              defaultSorting={defaultSorting}
              sorting={defaultSorting}
            />
            <IntegratedSorting />
            <GroupingState
              grouping={grouping}
              expandedGroups={expandedGroups}
              onExpandedGroupsChange={this.handleExpandedGroupsChange.bind(this)}
            />
            <IntegratedGrouping />
            <SummaryState
              totalItems={totalSummaryItems}
              groupItems={groupSummaryItems}
            />
            <IntegratedSummary />
            <Table columnExtensions={tableColumnExtension} />
            <TableHeaderRow showSortingControls />
            <TableSummaryRow
              groupRowComponent={CustomTableSummaryRow_GroupRow}
              totalRowComponent={CustomTableSummaryRow_TotalRow}
              itemComponent={CustomTableSummaryRow_Item}
            />
            <TableGroupRow/>
            <TableBandHeader
              columnBands={columnBands}
            />
            <TableFixedColumns leftColumns={[TableGroupRow.Row, 'rev']}/>
          </Grid>
        </MuiThemeProvider>
	    </div>
    )
  }
}

export default GroupTable

/*

            <TableSummaryRow
              groupRowComponent={CustomTableSummaryRow_GroupRow}
              itemComponent={CustomTableSummaryRow_Item}
              totalRowComponent={CustomTableSummaryRow_TotalRow}
            />
	      <Paper>
	        <Grid
	          rows={rows}
	          columns={columns}
	        >
	          <DragDropProvider />
	          <GroupingState
	            grouping={grouping}
	            onGroupingChange={this.changeGrouping}
	          />
	          <IntegratedGrouping />
	          <Table />
	          <TableHeaderRow />
	          <TableGroupRow />
	          <Toolbar />
	          <GroupingPanel />
	        </Grid>
	      </Paper>
	      */
