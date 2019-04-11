import React from 'react'
import PropTypes from 'prop-types'

import CONSTANTS from '../../../js/constants'

import styles from './FilterTable.module.scss'

import Table_MU from '@material-ui/core/Table';
import TableBody_MU from '@material-ui/core/TableBody';
import TableCell_MU from '@material-ui/core/TableCell';
import TableHead_MU from '@material-ui/core/TableHead';
import TableRow_MU from '@material-ui/core/TableRow';
import Paper_MU from '@material-ui/core/Paper';
import TableSortLabel_MU from '@material-ui/core/TableSortLabel';
import Tooltip_MU from '@material-ui/core/Tooltip';

class FilterTable extends React.Component {
  state = {
    name: [],
    columns: this.props.columns,
  };

  handleChange = event => {
    this.setState({ name: event.target.value });
  };

  handleRequestSort = (event, property) => {
  	console.log("Sort", event, property);
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ ...nextProps })
  }

	render () {
  	let { options, selectedKey, multiple } = this.props
    //console.log(this.state);
    return (
			<div className={styles.root}>
				<Table_MU className={styles.table}>
					<EnhancedTableHead
            onRequestSort={this.handleRequestSort}
            columns={this.state.columns}
          />
					<TableBody_MU className={styles.tableBody}>
            {this.props.data &&

              this.props.data.map((cells,index) => {
                return (
                  <TableRow_MU key={index}>
                    { 
                      cells.map((cell, index) => {
                        if(this.state.columns[index] && typeof this.state.columns[index].cellRender === 'function') {
                          return (<TableCell_MU key={index} align={this.state.columns[index].numeric ? 'right' : 'left'}>{this.state.columns[index].cellRender(cell)}</TableCell_MU>)
                        }
                        return (<TableCell_MU key={index} align={this.state.columns[index].numeric ? 'right' : 'left'}>{cell}</TableCell_MU>)
                      })
                    }
                  </TableRow_MU>
                )
              })
            }
					</TableBody_MU>
				</Table_MU>
			</div>
    )
  }

}

export default FilterTable



class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { columns } = this.props;

    return (
      <TableHead_MU className={styles.tableHeader}>
        <TableRow_MU>
          {columns.map(
            (column, index) => (
              <TableCell_MU
                key={column.id+"_"+index}
                align={column.numeric ? 'right' : 'left'}
                padding={column.disablePadding ? 'none' : 'default'}
              >
                <Tooltip_MU
                  title="Sort"
                  placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel_MU
                    onClick={this.createSortHandler(column.id)}
                  >
                    {column.label}
                  </TableSortLabel_MU>
                </Tooltip_MU>
              </TableCell_MU>
            ),
            this,
          )}
        </TableRow_MU>
      </TableHead_MU>
    );
  }
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
};



