import React from 'react'
import PropTypes from 'prop-types'

import Paper from '@material-ui/core/Paper';
import {
  SummaryState,
  IntegratedSummary,
  GroupingState,
  IntegratedGrouping,
  SortingState,
  IntegratedSorting
} from '@devexpress/dx-react-grid';
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
  TableFixedColumns,
} from '@devexpress/dx-react-grid-material-ui';

import styles from './GroupTable.module.scss'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
const theme = createMuiTheme({
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
    }
  }
});
//import CustomTableGroupRow from './plugins/CustomTableGroupRow'

const CustomTableGroupRow_Content = ({ row, ...restProps }) => (
  <span>
    {row.value}
  </span>
);

const CustomTableSummaryRow_GroupRow = ({ ...restProps }) => {
  //console.log(restProps);
  return (
    <Table.Row {...restProps} className={styles.summaryGroupRow} />
  )
}

const CustomTableSummaryRow_Item = ({ ...restProps }) => {
  //console.log(restProps);
  return (
    <div {...restProps}  className={styles.summaryCell}>
      {restProps.value}
    </div>
  )
}

const CustomTableSummaryRow_TotalRow = ({ ...restProps }) => {
  return (
    <Table.Row {...restProps} className={styles.summaryTotalRow} />
  )
}

class GroupTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'rev', title: 'Revenue Type'},
        { name: 'commodity', title: 'Commodity' },
        { name: 'FY2019', title: '2019' },
        { name: 'FY2018', title: '2018' },
        { name: 'FY2017', title: '2017' },
      ],
      rows: [
        { rev: 'Offshore', commodity: 'Oil', FY2019: 3,  FY2018: 30, FY2017: 300, },
        { rev: 'Offshore', commodity: 'Gas', FY2019: 5,  FY2018: 5, FY2017: 50, },
        { rev: 'Onshore', commodity: 'Coal', FY2019: 2,  FY2018: 20, FY2017: 200, },
        { rev: 'Onshore', commodity: 'Oil', FY2019: 1,  FY2018: 10, FY2017: 100,},
        { rev: 'Onshore', commodity: 'Coal', FY2019: 40,  FY2018: 40, FY2017: 400, },
      ],
      tableColumnExtension: [
        { columnName: 'FY2019', align: 'right' },
        { columnName: 'FY2018', align: 'right' },
        { columnName: 'FY2017', align: 'right' },
      ],
      columnBands : [
        { title: 'Fiscal Year',
          children: [
            {columnName: 'FY2019'},
            {columnName: 'FY2018'},
            {columnName: 'FY2017'},
          ]
        }
      ],
      totalSummaryItems: [
        { columnName: 'FY2019', type: 'sum' },
        { columnName: 'FY2018', type: 'sum' },
        { columnName: 'FY2017', type: 'sum' },
      ],
      groupSummaryItems: [
        { columnName: 'FY2019', type: 'sum' },
        { columnName: 'FY2018', type: 'sum' },
        { columnName: 'FY2017', type: 'sum' },
      ],
      tableGroupColumnExtension: [
        { columnName: 'rev', showWhenGrouped: true },
      ],
      grouping: [{ columnName: 'rev'}],
    };

    this.changeGrouping = grouping => this.setState({ grouping });
  }


	render() {
    const { rows, columns, tableColumnExtension, columnBands, grouping, tableGroupColumnExtension, totalSummaryItems, groupSummaryItems } = this.state;

    return (
    	<div>
        <MuiThemeProvider theme={theme}>
          <Grid
            rows={rows}
            columns={columns}
          >
            <SortingState
              defaultSorting={[
                { columnName: 'FY2019', direction: 'desc' },
              ]}
            />
            <IntegratedSorting />
            <GroupingState
              grouping={grouping}
              defaultExpandedGroups={['Onshore','Offshore']}
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
              itemComponent={CustomTableSummaryRow_Item}
              totalRowComponent={CustomTableSummaryRow_TotalRow}
            />
            <TableGroupRow 
              contentComponent={CustomTableGroupRow_Content}
              columnExtensions={tableGroupColumnExtension}
            />
            <TableBandHeader
              columnBands={columnBands}
            />
            <TableFixedColumns leftColumns={[TableGroupRow.Row, 'rev']}/>
          </Grid>
        </MuiThemeProvider>
	    </div>
    );
	}
}

export default GroupTable

/*
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