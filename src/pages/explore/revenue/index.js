import React, { useState, useEffect } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { graphql } from 'gatsby'

import { normalize as normalizeDataSetAction} from '../../../state/reducers/data-sets'
import {
	REVENUES_FISCAL_YEAR,
	BY_ID, BY_COMMODITY,
	BY_STATE, BY_COUNTY,
	BY_OFFSHORE_REGION,
	BY_LAND_CATEGORY,
	BY_LAND_CLASS,
	BY_REVENUE_TYPE,
	BY_FISCAL_YEAR,
} from '../../../state/reducers/data-sets'

import {DATA_SET_KEYS} from '../../../state/reducers/data-sets'

import * as CONSTANTS from '../../../js/constants'

import Link from '../../../components/utils/temp-link'
import utils from '../../../js/utils'

import styles from './FederalRevenue.module.scss'
import theme from '../../../css-global/base-theme.module.scss'

import DefaultLayout from '../../../components/layouts/DefaultLayout'
import Breadcrumb from '../../../components/navigation/Breadcrumb'
import {DownloadDataLink} from '../../../components/layouts/icon-links/DownloadDataLink'
import Toggle from '../../../components/selectors/Toggle'
import DropDown from '../../../components/selectors/DropDown'
import Select from '../../../components/selectors/Select'
import FilterTable from '../../../components/tables/FilterTable'
import GroupTable from '../../../components/tables/GroupTable'
import TreeTable from '../../../components/tables/TreeTable'


const PAGE_TITLE = "Federal Revenue | Natural Resources Revenue Data"
const TOGGLE_VALUES = {
  Year: 'year',
  Month: 'month'
}

const DEFAULT_GROUP_BY_INDEX = 0;
const DEFAULT_ADDITIONAL_COLUMN_INDEX = 1;

const LAND_CATEGORY_OPTIONS = {
	'All': [BY_REVENUE_TYPE],
	'All Federal': [BY_COMMODITY], 
	'Federal onshore': [BY_LAND_CLASS, BY_LAND_CATEGORY],
	'Federal offshore': [BY_STATE, BY_OFFSHORE_REGION], 
	'Native American': [BY_STATE, BY_OFFSHORE_REGION],
	'All onshore': [BY_STATE, BY_OFFSHORE_REGION], 
};
const GROUP_BY_OPTIONS = {
	'Revenue type': [BY_REVENUE_TYPE],
	'Commodity': [BY_COMMODITY], 
	'Land category': [BY_LAND_CLASS, BY_LAND_CATEGORY],
	'Location': [BY_STATE, BY_OFFSHORE_REGION],  
};
const ADDITIONAL_COLUMN_OPTIONS = {
	'Revenue type': ['RevenueType'],
	'Commodity': [DATA_SET_KEYS.COMMODITY],
	'Land category': ['LandClass', 'LandCategory'],
	'Location': ['State', DATA_SET_KEYS.OFFSHORE_REGION],
	'No second column': [],
};
//const ADDITIONAL_COLUMN_OPTIONS = ['State/offshore region', 'Source', 'Land owner', 'Revenue type'];

class FederalRevenue extends React.Component {

	constructor(props) {
		super(props);
		this.additionalColumnOptionKeys = Object.keys(ADDITIONAL_COLUMN_OPTIONS);
		this.getFiscalYearOptions = () => this.props[REVENUES_FISCAL_YEAR] && Object.keys(this.props[REVENUES_FISCAL_YEAR][BY_FISCAL_YEAR]);
		this.getLocationOptions = () => {
			let allOption = ['All']
			let withheldOption = ['withheld']
			let offshoreOptions = this.props[REVENUES_FISCAL_YEAR] && Object.keys(this.props[REVENUES_FISCAL_YEAR][BY_OFFSHORE_REGION])
			let states = this.props[REVENUES_FISCAL_YEAR] && Object.keys(this.props[REVENUES_FISCAL_YEAR][BY_STATE])
			return allOption.concat(offshoreOptions, states, withheldOption);
		}
		this.hydrateStore();
	}

	state = {
		timeframe: TOGGLE_VALUES.Year,
		yearOptions: [],
		filter: {
			groupBy: Object.keys(GROUP_BY_OPTIONS)[DEFAULT_GROUP_BY_INDEX],
			years: []
		},
		additionalColumns: [Object.keys(GROUP_BY_OPTIONS)[DEFAULT_ADDITIONAL_COLUMN_INDEX]]
	}

	componentWillReceiveProps (nextProps) {
		let yearOptions = Object.keys(nextProps[REVENUES_FISCAL_YEAR][BY_FISCAL_YEAR]);
		let additionalColumns = nextProps.additionalColumns || this.state.additionalColumns;
		let filter = {...this.state.filter, years:(nextProps.selectedYears || yearOptions.slice(Math.max(yearOptions.length - 3, 1))) }

	  this.setState({ ...nextProps, 
	  	filter: filter, 
	  	yearOptions: yearOptions,
	  	additionalColumns: additionalColumns.filter(column => column !== filter.groupBy) })
	}


	getAdditionalColumnOptions = () => {
		return this.additionalColumnOptionKeys.filter(column => column !== this.state.filter.groupBy);
	}

	getAdditionalColumnsSelectedIndex = () => {
		if(this.state.additionalColumns.length === 0){
			return this.getAdditionalColumnOptions().length - 1;
		}
		return this.getAdditionalColumnOptions().findIndex(column => this.state.additionalColumns.includes(column))
	}

	getTableColumns = () => {
		let columns = [], columnExtensions = [], grouping = [], currencyColumns=[], defaultSorting=[];
		let {filter} = this.state;
		let groupBySlug = utils.formatToSlug(filter.groupBy);

		columns.push({ name: groupBySlug, title: filter.groupBy });
		if(this.state.additionalColumns && this.state.additionalColumns.length > 0) {
			grouping.push({columnName: groupBySlug});
		}

		this.state.additionalColumns.forEach(column => {
			columns.push({ name: utils.formatToSlug(column), title: column })
		})

		/*filter.years.sort().forEach(year => {
			columns.push({ name: 'fy-'+year, title: year })
			columnExtensions.push({ columnName: 'fy-'+year, align: 'right' })
			defaultSorting=[{ columnName: 'fy-'+year, direction: 'desc' }]
		})*/

		// Have to add all the data provider types initially or they wont work??
		this.state.yearOptions.forEach(year => {
			columns.push({ name: 'fy-'+year, title: year })
			columnExtensions.push({ columnName: 'fy-'+year, align: 'right' })
			defaultSorting=[{ columnName: 'fy-'+year, direction: 'desc' }]
			currencyColumns.push('fy-'+year)
		})
		

		return {
			columns: columns, 
			columnExtensions: columnExtensions,
			grouping: grouping,
			currencyColumns: currencyColumns,
			defaultSorting: defaultSorting,
		};
	}

	getTableSummaries = () => {
		let totalSummaryItems = [], groupSummaryItems = [];
		let {yearOptions} = this.state;

		yearOptions.sort().forEach(year => {
			totalSummaryItems.push({ columnName: 'fy-'+year, type: 'sum' })
			groupSummaryItems.push({ columnName: 'fy-'+year, type: 'sum' })
		})

		return {
			totalSummaryItems: totalSummaryItems, 
			groupSummaryItems: groupSummaryItems,
		};

	}

	getTableData = () => {
		if(this.state[REVENUES_FISCAL_YEAR] === undefined) return {tableData:undefined, expandedGroups: undefined};
		let dataSet = this.state[REVENUES_FISCAL_YEAR];
		let groupBySlug = utils.formatToSlug(this.state.filter.groupBy);
		let allDataSetGroupBy = GROUP_BY_OPTIONS[this.state.filter.groupBy].map( groupBy => this.state[REVENUES_FISCAL_YEAR][groupBy] );

		let tableData = []; 
		let expandedGroups = [];

		// Iterate over all group by data sets asociated with this filter group by
		allDataSetGroupBy.forEach( (dataSetGroupBy, indexGroupBy) => { 
			Object.keys(dataSetGroupBy).forEach(name => {

				expandedGroups.push(name);

				let sums = {}
				let sumsByAdditionalColumns = {}

				let additionalColumnsRow = {};

				// sum all revenues
				dataSetGroupBy[name].forEach((dataId) => {
					let data = dataSet[BY_ID][dataId];

					// filter by selected years
					//if( this.state.filter.years.includes(data.FiscalYear) ) {

						let fiscalYearSlug = 'fy-'+data.FiscalYear
						sums[fiscalYearSlug] = (sums[fiscalYearSlug])? sums[fiscalYearSlug]+data.Revenue : data.Revenue;

						this.state.additionalColumns.forEach((additionalColumn) => {

							// Get the data columns related to the column in the table. Could have multiple data source columns mapped to 1 table column
							let dataColumns = ADDITIONAL_COLUMN_OPTIONS[additionalColumn];

							dataColumns.map(column => {
								let newValue = data[column];

								if(additionalColumnsRow[additionalColumn] === undefined) {
									additionalColumnsRow[additionalColumn] = [];
									sumsByAdditionalColumns[additionalColumn] = {};
								}

								if(newValue !== null) {
									// Add the fiscal year revenue for the additional column, only works when there is 1 additional column
									if(sumsByAdditionalColumns[additionalColumn][newValue] === undefined) {
										sumsByAdditionalColumns[additionalColumn][newValue] = {};
									}


									let fyRevenue = data.Revenue || 0;
									//console.log(data.RevenueType, data.FiscalYear, fyRevenue)

									sumsByAdditionalColumns[additionalColumn][newValue][fiscalYearSlug] = (sumsByAdditionalColumns[additionalColumn][newValue][fiscalYearSlug])? 
										sumsByAdditionalColumns[additionalColumn][newValue][fiscalYearSlug]+fyRevenue 
										: 
										fyRevenue;

									if(!additionalColumnsRow[additionalColumn].includes(newValue)) {
										additionalColumnsRow[additionalColumn].push(newValue)
									}	
								}				
							})
						})
					//}
				})

				if(Object.keys(sumsByAdditionalColumns).length > 0) {
					Object.keys(sumsByAdditionalColumns).forEach((column) => {
						let columnSlug = utils.formatToSlug(column);

						Object.keys(sumsByAdditionalColumns[column]).forEach((columnValue) => {
							// Add all fiscal years to each row
							this.state.filter.years.forEach((year) => {
								let fiscalYearSlug = 'fy-'+year;
								sumsByAdditionalColumns[column][columnValue][fiscalYearSlug] = parseInt(sumsByAdditionalColumns[column][columnValue][fiscalYearSlug]) || 0;
							})
							tableData.push(Object.assign({[groupBySlug]: name, [columnSlug]:  columnValue}, sumsByAdditionalColumns[column][columnValue]))
						}) 
					})
				}
				else {

					this.state.filter.years.forEach((year) => {
						let fiscalYearSlug = 'fy-'+year;
						sums[fiscalYearSlug] = parseInt(sums[fiscalYearSlug]) || 0;
					})

					tableData.push(Object.assign({[groupBySlug]: name}, sums))
				}

			})
		});

		return {tableData:tableData, expandedGroups: expandedGroups};
	}

	setYearsFilter(values) {
 		this.setState({filter:{...this.state.filter, years:values.sort()} })
	}

	// If group by column is in the additional columns remove it
	setGroupByFilter(value) {		
		this.setState({
			filter:{...this.state.filter, groupBy:value},
			additionalColumns: this.state.additionalColumns.filter(column => column !== value) 
		})
	}

	setAdditionalColumns(value) {
		this.setState({additionalColumns:(value === 'No second column')? [] : [value]})
	}

	handleTableToolbarSubmit(updatedFilters) {
		console.log(updatedFilters);
		this.setState({filter:{...this.state.filter, years:updatedFilters.fiscalYears.sort()} })
	}
  /**
   * Add the data to the redux store to enable
   * the components to access filtered data using the
   * reducers
   **/
  hydrateStore  = () => {
  	let data = this.props.data;
    this.props.normalizeDataSet([
      { key: REVENUES_FISCAL_YEAR, 
      	data: data.allRevenues.data, 
      	groups: [
      		{
      			key: BY_COMMODITY, 
      			groups: data.allRevenuesGroupByCommodity.group,
      		},
      		{
      			key: BY_STATE, 
      			groups: data.allRevenuesGroupByState.group,
      		},
      		{
      			key: BY_OFFSHORE_REGION, 
      			groups: data.allRevenuesGroupByOffshoreRegion.group,
      		},
      		{
      			key: BY_COUNTY, 
      			groups: data.allRevenuesGroupByCounty.group,
      		},
      		{
      			key: BY_LAND_CATEGORY, 
      			groups: data.allRevenuesGroupByLandCategory.group,
      		},
      		{
      			key: BY_LAND_CLASS, 
      			groups: data.allRevenuesGroupByLandClass.group,
      		},
      		{
      			key: BY_REVENUE_TYPE,
      			groups: data.allRevenuesGroupByRevenueType.group,
      		},
      		{
      			key: BY_FISCAL_YEAR,
      			groups: data.allRevenuesGroupByFiscalYear.group
      		}
      	]
      },
    ])
  }

	render() {
		let {timeframe, yearOptions} = this.state;
		let {columns, columnExtensions, grouping, currencyColumns, defaultSorting} = this.getTableColumns();
		let {totalSummaryItems, groupSummaryItems} = this.getTableSummaries();
		let {tableData, expandedGroups} = this.getTableData();

		return (
			<DefaultLayout>
	      <Helmet
	        title={PAGE_TITLE}
	        meta={[
	          // title
	          { name: 'og:title', content: PAGE_TITLE },
	          { name: 'twitter:title', content: PAGE_TITLE },
	        ]} />
	      <section className='layout-content container-page-wrapper container-margin'>
					<Breadcrumb crumbs={[{to:'/explore', name:'Explore data'}]} />

					<h1>Federal Revenue Data</h1>

					<section className={styles.descriptionContainer}>
						<div className="ribbon-hero-description">
							When companies lease lands to extract natural resources on federal lands and waters, they pay fees to lease the land and on the resources that are produced. This non-tax revenue is collected and reported by the Office of Natural Resources Revenue (ONRR).
						</div>
						<div className="container-left-6">
							Leasing<br/>
							<span className="para-md">Companies bid on and lease lands and waters from the federal government. They pay a bonus when they win a lease and rent until resource production begins.</span>
						</div>
						<div className="container-right-6">
							Production<br/>
							<span className="para-md">Once enough resources are produced to pay royalties, the leaseholder pays royalties and other fees to the federal government.</span>
						</div>
					</section>

					<div className={styles.downloadLinkContainer}>
						<DownloadDataLink to={"/downloads/federal-revenue-by-location/"}>Downloads and documentation</DownloadDataLink>
					</div>

					<h2 className={theme.sectionHeaderUnderline}>Revenue data</h2>

					{tableData &&
						<TableToolbar 
							fiscalYearOptions={this.getFiscalYearOptions()}
							locationOptions={this.getLocationOptions()}
							defaultFiscalYearsSelected={this.state.filter.years}
							onSubmitAction={this.handleTableToolbarSubmit.bind(this)}
						/>
					}

					{this.state[REVENUES_FISCAL_YEAR] &&
						<div className={styles.tableContainer}>
							<GroupTable 
								rows={tableData}
								columns={columns} 
								defaultSorting={defaultSorting}
								tableColumnExtension={columnExtensions}
								grouping={grouping}
								currencyColumns={currencyColumns}
								expandedGroups={expandedGroups}
								totalSummaryItems={totalSummaryItems}
								groupSummaryItems={groupSummaryItems}
							/>
						</div>
					}

				</section>
			</DefaultLayout>
		)

	}

}

export default connect(
  state => ({
  	[REVENUES_FISCAL_YEAR]: state[CONSTANTS.DATA_SETS_STATE_KEY][REVENUES_FISCAL_YEAR],
  }),
  dispatch => ({ normalizeDataSet: dataSets => dispatch(normalizeDataSetAction(dataSets)),
  })
)(FederalRevenue)


import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
const muiTheme = createMuiTheme({
  palette: {
    primary: {
    	light: '#dcf4fd',
    	main: '#1478a6',
    	dark: '#086996'
    }
  },
});
const TableToolbar = ({ fiscalYearOptions, locationOptions, defaultFiscalYearsSelected, onSubmitAction }) => {

	const [fiscalYearsSelected, setFiscalYearsSelected] = useState(defaultFiscalYearsSelected);
	const [landCategorySelected, setLandCategorySelected] = useState();
	const [locationSelected, setLocationSelected] = useState();
	const [groupBy, setGroupBy] = useState(Object.keys(GROUP_BY_OPTIONS)[DEFAULT_GROUP_BY_INDEX]);
	const [additionalColumn, setAdditionalColumn] = useState(Object.keys(ADDITIONAL_COLUMN_OPTIONS)[DEFAULT_ADDITIONAL_COLUMN_INDEX]);

	const getAdditionalColumnOptions = () => Object.keys(ADDITIONAL_COLUMN_OPTIONS).filter(column => column !== groupBy);
	const getLocationOptions = () => {
		if(landCategorySelected === 'Native American') {
			return ['withheld'];
		}

		return locationOptions;
	}

	useEffect(() => {
		console.log(additionalColumn,groupBy);
		if(additionalColumn === groupBy) {
			setAdditionalColumn('No second column')
		}
	})

	const onSubmit = () => {
		if(onSubmitAction){
			onSubmitAction({
				fiscalYears: fiscalYearsSelected
			});
		}
	}

	console.log(additionalColumn);

  return (
  	<div className={styles.tableToolbarContainer}>
	  	<MuiThemeProvider theme={muiTheme}>
		    <Grid container spacing={16}>
					<Grid item sm xs={12}>
						<h6>Fiscal year(s):</h6>
						<Select
							multiple
							dataSetId={REVENUES_FISCAL_YEAR}
					    options={fiscalYearOptions}
					    sortType={'descending'}
					    selectedOption={fiscalYearsSelected}
							onChangeHandler={(values) => setFiscalYearsSelected(values)}
					  />
				  </Grid>
					<Grid item sm xs={12}>
						<h6>Land category:</h6>
						<DropDown
					    options={Object.keys(LAND_CATEGORY_OPTIONS)}
					    sortType={'none'}
							action={(value) => setLandCategorySelected(value)}
					  />
				  </Grid>
					<Grid item sm xs={12}>
						<h6>Location:</h6>
						<DropDown
					    options={getLocationOptions()}
					    sortType={'none'}
							action={(value) => setLocationSelected(value)}
					  />
				  </Grid>
					<Grid item sm xs={12}>
						<h6>First column:</h6>
						<DropDown
							sortType={'none'}
					    options={Object.keys(GROUP_BY_OPTIONS)}
					    action={(value) => setGroupBy(value)}
					    defaultOptionValue={groupBy}
					    sortType={'none'}
					  />
				  </Grid>
					<Grid item sm xs={12}>
						<h6>Second column:</h6>
						<DropDown
							sortType={'none'}
					    options={getAdditionalColumnOptions()}
					    action={(value) => setAdditionalColumn(value)}
					    selectedOptionValue={additionalColumn}
					  />
				  </Grid>
					<Grid item xs={12} >
			 			<Button classes={{root:styles.tableToolbarButton}} variant="contained" color="primary">Apply</Button>
			 		</Grid>
		    </Grid>
	    </MuiThemeProvider>
	   </div>
  );
}

export const query = graphql`
  query FederalRevenuesPageQuery {
		allRevenues:allResourceRevenuesFiscalYear (filter:{FiscalYear:{ne:null}}, sort: {fields: [FiscalYear], order: DESC}) {
		  data:edges {
		    node {
		    	id
		      Revenue
		      RevenueType
		      FiscalYear
		      Commodity
		      LandCategory
		      LandClass
		      County
		      State
		      RevenueDate
		      OffshoreRegion
		    }
		  }
		}
	  allRevenuesGroupByCommodity: allResourceRevenuesFiscalYear(
	  	filter: {
	  		FiscalYear: {ne: null},
	  		Commodity: {nin: [null,""]},
	  	}, 
	  	sort: {fields: [FiscalYear], order: DESC}) {
	    group(field: Commodity) {
	      id:fieldValue
	      data:edges {
	        node {
	          id
	        }
	      }
	    }
	  }
	  allRevenuesGroupByState: allResourceRevenuesFiscalYear(
	  	filter: {
		  	FiscalYear: {ne: null}, 
	      State: {nin: [null,""]},
	    },  
	  	sort: {fields: [FiscalYear], order: DESC}) {
	    group(field: State) {
	      id:fieldValue
	      data:edges {
	        node {
	          id
	        }
	      }
	    }
	  }
	  allRevenuesGroupByOffshoreRegion: allResourceRevenuesFiscalYear(
	  	filter: {
		  	FiscalYear: {ne: null}, 
	      OffshoreRegion: {nin: [null,""]},
	    }, 
	  	sort: {fields: [FiscalYear], order: DESC}) {
	    group(field: OffshoreRegion) {
	      id:fieldValue
	      data:edges {
	        node {
	          id
	        }
	      }
	    }
	  }
	  allRevenuesGroupByCounty: allResourceRevenuesFiscalYear(
	  	filter: {
	  		FiscalYear: {ne: null}, 
	      County: {nin: [null,""]},
	    }, 
	  	sort: {fields: [FiscalYear], order: DESC}) {
	    group(field: County) {
	      id:fieldValue
	      data:edges {
	        node {
	          id
	        }
	      }
	    }
	  }
	  allRevenuesGroupByLandCategory: allResourceRevenuesFiscalYear(
	  	filter: {
	  		FiscalYear: {ne: null}, 
	      LandCategory: {nin: [null,""]},
	  	}, 
	  	sort: {fields: [FiscalYear], order: DESC}) {
	    group(field: LandCategory) {
	      id:fieldValue
	      data:edges {
	        node {
	          id
	        }
	      }
	    }
	  }
	  allRevenuesGroupByLandClass: allResourceRevenuesFiscalYear(
	  	filter: {
	  		FiscalYear: {ne: null}, 
	      LandClass: {nin: [null,""]},
	  	}, 
	  	sort: {fields: [FiscalYear], order: DESC}) {
	    group(field: LandClass) {
	      id:fieldValue
	      data:edges {
	        node {
	          id
	        }
	      }
	    }
	  }
	  allRevenuesGroupByRevenueType: allResourceRevenuesFiscalYear(
	  	filter: {
	  		FiscalYear: {ne: null}, 
	      RevenueType: {nin: [null,""]},
	  	}, 
	  	sort: {fields: [FiscalYear], order: DESC}) {
	    group(field: RevenueType) {
	      id:fieldValue
	      data:edges {
	        node {
	          id
	        }
	      }
	    }
	  }
	  allRevenuesGroupByFiscalYear: allResourceRevenuesFiscalYear(
	  	filter: {
	  		FiscalYear: {ne: null}
	  	}, 
	  	sort: {fields: [FiscalYear], order: DESC}) {
	    group(field: FiscalYear) {
	      id:fieldValue
	      data:edges {
	        node {
	          id
	        }
	      }
	    }
	  }
  }
`
