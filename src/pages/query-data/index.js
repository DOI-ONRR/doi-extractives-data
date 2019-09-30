import React, { useState, useEffect } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { graphql } from 'gatsby'

import { normalize as normalizeDataSetAction,
  REVENUES_FISCAL_YEAR,
  BY_ID, BY_COMMODITY,
  BY_STATE, BY_COUNTY,
  BY_OFFSHORE_REGION,
  BY_LAND_CATEGORY,
  BY_LAND_CLASS,
  BY_REVENUE_TYPE,
  BY_FISCAL_YEAR,
  BY_REVENUE_CATEGORY
  , DATA_SET_KEYS } from '../../state/reducers/data-sets'

import * as CONSTANTS from '../../js/constants'

import utils from '../../js/utils'

import styles from './FederalRevenue.module.scss'
// eslint-disable-next-line css-modules/no-unused-class
import theme from '../../css-global/base-theme.module.scss'

import DefaultLayout from '../../components/layouts/DefaultLayout'
import { ExploreDataLink } from '../../components/layouts/icon-links/ExploreDataLink'
import { DownloadDataLink } from '../../components/layouts/icon-links/DownloadDataLink'
import DropDown from '../../components/selectors/DropDown'
import Select from '../../components/selectors/Select'
import GroupTable from '../../components/tables/GroupTable'
import GlossaryTerm from '../../components/utils/glossary-term.js'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

const PAGE_TITLE = 'Federal Revenue | Natural Resources Revenue Data'
const TOGGLE_VALUES = {
  Year: 'year',
  Month: 'month'
}

const DEFAULT_GROUP_BY_INDEX = 0
const DEFAULT_ADDITIONAL_COLUMN_INDEX = 1

const LAND_CATEGORY_OPTIONS = {
  'All land categories': [BY_REVENUE_TYPE],
  'Federal onshore': [BY_LAND_CLASS, BY_LAND_CATEGORY],
  'Federal offshore': [BY_STATE, BY_OFFSHORE_REGION],
  'Onshore': [BY_STATE, BY_OFFSHORE_REGION],
  'Native American': [BY_STATE, BY_OFFSHORE_REGION],
  'Federal (onshore and offshore)': [BY_COMMODITY],
}
const GROUP_BY_OPTIONS = {
  'Revenue type': [BY_REVENUE_TYPE],
  'Commodity': [BY_COMMODITY],
  'Land category': [BY_REVENUE_CATEGORY],
  'Location': [BY_STATE, BY_OFFSHORE_REGION],
}
const ADDITIONAL_COLUMN_OPTIONS = {
  'Revenue type': ['RevenueType'],
  'Commodity': [DATA_SET_KEYS.COMMODITY],
  'Land category': ['RevenueCategory'],
  'Location': [DATA_SET_KEYS.LOCATION],
  'County': [DATA_SET_KEYS.COUNTY],
  'No second column': [],
}
const PLURAL_COLUMNS_MAP = {
  'Revenue type': 'revenue types',
  'Commodity': 'commodities',
  'Land category': 'land categories',
  'Location': 'locations',
  'County': 'counties',
}
// const ADDITIONAL_COLUMN_OPTIONS = ['State/offshore region', 'Source', 'Land owner', 'Revenue type'];

const muiTheme = createMuiTheme({
  root: {
    flexGrow: 0,
  },
  palette: {
    primary: {
      light: '#dcf4fd',
      main: '#1478a6',
      dark: '#086996'
    },
    secondary: {
      light: '#fff',
      main: '#fff',
      dark: '#ccc'
    }
  },
})

class QueryData extends React.Component {
  constructor (props) {
    super(props)
    console.log(props)
    this.additionalColumnOptionKeys = Object.keys(ADDITIONAL_COLUMN_OPTIONS)
    this.getFiscalYearOptions = () => this.props[REVENUES_FISCAL_YEAR] && Object.keys(this.props[REVENUES_FISCAL_YEAR][BY_FISCAL_YEAR])
    this.getLocationOptions = () => {
      let allOption = ['All']
      let offshoreOptions = this.props[REVENUES_FISCAL_YEAR] && Object.keys(this.props[REVENUES_FISCAL_YEAR][BY_OFFSHORE_REGION])
      let states = this.props[REVENUES_FISCAL_YEAR] && Object.keys(this.props[REVENUES_FISCAL_YEAR][BY_STATE])
      return allOption.concat(offshoreOptions, states)
    }
    this.getCommodityOptions = () => {
      let allOption = ['All']
      let commodityOptions = this.props[REVENUES_FISCAL_YEAR] && Object.keys(this.props[REVENUES_FISCAL_YEAR][BY_COMMODITY])
      return allOption.concat(commodityOptions)
    }
    this.getCountyOptions = state => {
      let allOption = ['All']
      let countyOptions = []
      this.props.data.allRevenuesGroupByCounty.group.forEach(countyData => {
        if (countyData.data[0].node.State === state) {
          countyOptions.push(countyData.id)
        }
      })
      return allOption.concat(countyOptions)
    }
    this.hydrateStore()
  }

	state = {
	  openGroupByDialog: false,
	  timeframe: TOGGLE_VALUES.Year,
	  dataType: undefined,
	  yearOptions: [],
	  filter: {
	    groupBy: Object.keys(GROUP_BY_OPTIONS)[DEFAULT_GROUP_BY_INDEX],
	    years: []
	  },
	  additionalColumns: [Object.keys(GROUP_BY_OPTIONS)[DEFAULT_ADDITIONAL_COLUMN_INDEX]]
	}

	componentWillReceiveProps (nextProps) {
	  let yearOptions = Object.keys(nextProps[REVENUES_FISCAL_YEAR][BY_FISCAL_YEAR])
	  let additionalColumns = nextProps.additionalColumns || this.state.additionalColumns
	  let filter = { ...this.state.filter }

	  this.setState({ ...nextProps,
	    filter: filter,
	    yearOptions: yearOptions,
	    additionalColumns: additionalColumns.filter(column => column !== filter.groupBy) })
	}

	getTableColumns = () => {
	  let columns = []; let columnExtensions = []; let grouping = []; let currencyColumns = []; let defaultSorting = []
	  let { filter } = this.state

	  let groupBySlug = utils.formatToSlug(filter.groupBy)

	  columns.push({ name: groupBySlug, title: filter.groupBy })
	  if (this.state.additionalColumns && this.state.additionalColumns.length > 0) {
	    grouping.push({ columnName: groupBySlug })
	  }

	  this.state.additionalColumns.forEach(column => {
	    columns.push({ name: utils.formatToSlug(column), title: column, plural: PLURAL_COLUMNS_MAP[column] })
	  })

	  let allColumns = Object.keys(ADDITIONAL_COLUMN_OPTIONS).map(columnName => utils.formatToSlug(columnName))

	  filter.years.sort().forEach(year => {
	    columns.push({ name: 'fy-' + year, title: year })
	    columnExtensions.push({ columnName: 'fy-' + year, align: 'right' })
	    defaultSorting = [{ columnName: 'fy-' + year, direction: 'desc' }]
	  })

	  // Have to add all the data provider types initially or they wont work??
	  this.state.yearOptions.forEach(year => {
	    currencyColumns.push('fy-' + year)
	  })

	  return {
	    columns: columns,
	    columnExtensions: columnExtensions,
	    grouping: grouping,
	    currencyColumns: currencyColumns,
	    allColumns: allColumns,
	    defaultSorting: defaultSorting,
	  }
	}

	getTableSummaries = () => {
	  let totalSummaryItems = []; let groupSummaryItems = []
	  let { yearOptions } = this.state

	  yearOptions.sort().forEach(year => {
	    totalSummaryItems.push({ columnName: 'fy-' + year, type: 'sum' })
	    groupSummaryItems.push({ columnName: 'fy-' + year, type: 'sum' })
	  })

	  // using type avg to attach the custom formatter function
	  this.state.additionalColumns.forEach(column => {
	    totalSummaryItems.push({ columnName: utils.formatToSlug(column), type: 'avg' })
	    groupSummaryItems.push({ columnName: utils.formatToSlug(column), type: 'avg' })
	  })

	  return {
	    totalSummaryItems: totalSummaryItems,
	    groupSummaryItems: groupSummaryItems,
	  }
	}

	getTableData = () => {
	  if (this.state[REVENUES_FISCAL_YEAR] === undefined || this.state.dataType === undefined) return { tableData: undefined, expandedGroups: undefined }
	  let dataSet = this.state[REVENUES_FISCAL_YEAR]
	  let groupBySlug = utils.formatToSlug(this.state.filter.groupBy)
	  let allDataSetGroupBy = GROUP_BY_OPTIONS[this.state.filter.groupBy].map(groupBy => this.state[REVENUES_FISCAL_YEAR][groupBy])
	  let tableData = []
	  let expandedGroups = []

	  // Iterate over all group by data sets asociated with this filter group by
	  allDataSetGroupBy.forEach((dataSetGroupBy, indexGroupBy) => {
	    Object.keys(dataSetGroupBy).forEach(name => {
	      let sums = {}
	      let sumsByAdditionalColumns = {}

	      let additionalColumnsRow = {}

	      // sum all revenues
	      dataSetGroupBy[name].forEach(dataId => {
	        let data = dataSet[BY_ID][dataId]

	        // Apply filters
	        if (this.state.filter.years.includes(data.FiscalYear) &&
						this.hasLandCategory(data) &&
            this.hasLocation(data) &&
            this.hasCommodity(data) &&
            this.hasRevenueType(data) &&
            this.hasCounty(data)) {
	          if (!expandedGroups.includes(name)) {
	            expandedGroups.push(name)
	          }

	          let fiscalYearSlug = 'fy-' + data.FiscalYear
	          sums[fiscalYearSlug] = (sums[fiscalYearSlug]) ? sums[fiscalYearSlug] + data.Revenue : data.Revenue

	          this.state.additionalColumns.forEach(additionalColumn => {
	            // Get the data columns related to the column in the table. Could have multiple data source columns mapped to 1 table column
	            let dataColumns = ADDITIONAL_COLUMN_OPTIONS[additionalColumn]

	            dataColumns.map(column => {
	              let newValue = data[column]

	              if (additionalColumnsRow[additionalColumn] === undefined) {
	                additionalColumnsRow[additionalColumn] = []
	                sumsByAdditionalColumns[additionalColumn] = {}
	              }

	              if (newValue) {
	                // Add the fiscal year revenue for the additional column, only works when there is 1 additional column
	                if (sumsByAdditionalColumns[additionalColumn][newValue] === undefined) {
	                  sumsByAdditionalColumns[additionalColumn][newValue] = {}
	                }

	                let fyRevenue = data.Revenue || 0

	                sumsByAdditionalColumns[additionalColumn][newValue][fiscalYearSlug] = (sumsByAdditionalColumns[additionalColumn][newValue][fiscalYearSlug])
	                  ? sumsByAdditionalColumns[additionalColumn][newValue][fiscalYearSlug] + fyRevenue
	                  : fyRevenue

	                if (!additionalColumnsRow[additionalColumn].includes(newValue)) {
	                  additionalColumnsRow[additionalColumn].push(newValue)
	                }
	              }
	            })
	          })
	        }
	      })

	      // Easy way to check if we need to exclude a grouping due to filters
	      if (expandedGroups.includes(name)) {
	        if (Object.keys(sumsByAdditionalColumns).length > 0) {
	          Object.keys(sumsByAdditionalColumns).forEach(column => {
	            let columnSlug = utils.formatToSlug(column)

	            Object.keys(sumsByAdditionalColumns[column]).forEach(columnValue => {
	              // Add all fiscal years to each row
	              this.state.filter.years.forEach(year => {
	                let fiscalYearSlug = 'fy-' + year
	                sumsByAdditionalColumns[column][columnValue][fiscalYearSlug] = parseInt(sumsByAdditionalColumns[column][columnValue][fiscalYearSlug]) || 0
	              })
	              tableData.push(Object.assign({ [groupBySlug]: name, [columnSlug]: columnValue }, sumsByAdditionalColumns[column][columnValue]))
	            })
	          })
	        }
	        else {
	          this.state.filter.years.forEach(year => {
	            let fiscalYearSlug = 'fy-' + year
	            sums[fiscalYearSlug] = parseInt(sums[fiscalYearSlug]) || 0
	          })

	          tableData.push(Object.assign({ [groupBySlug]: name }, sums))
	        }
	      }
	    })
	  })

	  return { tableData: tableData, expandedGroups: expandedGroups }
	}

	setYearsFilter (values) {
	  this.setState({ filter: { ...this.state.filter, years: values.sort() } })
	}

	// If group by column is in the additional columns remove it
	setGroupByFilter (value) {
	  this.setState({
	    filter: { ...this.state.filter, groupBy: value },
	    additionalColumns: this.state.additionalColumns.filter(column => column !== value)
	  })
	}

	setAdditionalColumns (value) {
	  this.setState({ additionalColumns: (value === 'No second column') ? [] : [value] })
	}

	hasLandCategory (data) {
	  switch (this.state.filter.landCategory) {
	  case 'Federal (onshore and offshore)':
	    return (data.LandClass === 'Federal')
	  case 'Federal onshore':
	    return (data.RevenueCategory === 'Federal onshore')
	  case 'Federal offshore':
	    return (data.RevenueCategory === 'Federal offshore')
	  case 'Native American':
	    return (data.RevenueCategory === 'Native American')
	  case 'Onshore':
	    return (data.LandCategory === 'Onshore')
	  }
	  return true
	}

	hasLocation (data) {
	  if (this.state.filter.locations.includes('All') || this.state.filter.locations === undefined) {
	    return true
	  }
	  else if (this.state.filter.locations.includes('Offshore')) {
	    return (this.state.filter.locations.includes(data.OffshoreRegion))
	  }
	  return (this.state.filter.locations.includes(data.State))
	}

	hasCommodity (data) {
	  if (this.state.filter.commodities === undefined || this.state.filter.commodities.includes('All')) {
	    return true
	  }
	  return (this.state.filter.commodities.includes(data.Commodity))
	}

	hasRevenueType (data) {
	  if (this.state.filter.revenueType === undefined || this.state.filter.revenueType === 'All') {
	    return true
	  }
	  return (data.RevenueType === this.state.filter.revenueType)
	}

	hasCounty (data) {
	  if (this.state.filter.counties === undefined || this.state.filter.counties.includes('All')) {
	    return true
	  }
	  return (this.state.filter.counties.includes(data.County))
	}

	handleTableToolbarSubmit (updatedFilters) {
	  let additionalColumns = ['Land category']
	  let groupBy = 'Revenue type'
	  if (updatedFilters.revenueType !== 'All') {
	    if (updatedFilters.commodities.length === 1 && updatedFilters.commodities[0] !== 'All') {
	      groupBy = 'Land category'
	      additionalColumns = []
	    }
	    else {
	      groupBy = 'Commodity'
	      additionalColumns = ['Land category']
	    }
	  }
	  if ((updatedFilters.landCategory === 'Federal onshore' || updatedFilters.landCategory === 'Federal offshore') && updatedFilters.revenueType !== 'All') {
	    if (updatedFilters.commodities.length === 1 && updatedFilters.commodities[0] !== 'All') {
	      groupBy = 'Land category'
	      additionalColumns = (updatedFilters.counties.length > 1) ? ['County'] : []
	    }
	    else {
	      groupBy = 'Commodity'
	      additionalColumns = ['Land category']
	    }
	  }

	  this.setState({
	    filter: { ...this.state.filter,
	      years: updatedFilters.fiscalYearsSelected.sort(),
	      locations: updatedFilters.locations,
	      commodities: updatedFilters.commodities,
	      counties: updatedFilters.counties,
	      landCategory: updatedFilters.landCategory,
	      revenueType: updatedFilters.revenueType,
	      groupBy: groupBy,
	    },
	    dataType: updatedFilters.dataType,
	    additionalColumns: additionalColumns,
	  })
	}
  /**
   * Add the data to the redux store to enable
   * the components to access filtered data using the
   * reducers
   **/
  hydrateStore = () => {
    let data = this.props.data
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
            key: BY_REVENUE_CATEGORY,
            groups: data.allRevenuesGroupByRevenueCategory.group,
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

  openGroupByDialog () {
    this.setState({ openGroupByDialog: true })
  }
  closeGroupByDialog () {
    this.setState({ openGroupByDialog: false })
  }
  render () {
    let { columns, columnExtensions, grouping, currencyColumns, allColumns, defaultSorting } = this.getTableColumns()
    let { totalSummaryItems, groupSummaryItems } = this.getTableSummaries()
    let { tableData, expandedGroups } = this.getTableData()

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

          <h1>Data query tool</h1>

          {this.state[REVENUES_FISCAL_YEAR] &&
						<TableToolbar
						  fiscalYearOptions={this.getFiscalYearOptions()}
						  locationOptions={this.getLocationOptions()}
						  commodityOptions={this.getCommodityOptions()}
						  countyOptions={this.getCountyOptions}
						  defaultFiscalYearsSelected={this.state.filter.years}
						  onSubmitAction={this.handleTableToolbarSubmit.bind(this)}
						/>
          }

          {tableData &&
						<div className={styles.tableContainer}>
						  <div className={styles.downloadLinkContainer}>
						    <ExploreDataLink to={'/how-it-works/#resources_process'}>How it works</ExploreDataLink>
						    <DownloadDataLink to={'/downloads/federal-revenue-by-location/'}>Documentation</DownloadDataLink>
						  </div>
						  <h2 className={theme.sectionHeaderUnderline}>Revenue</h2>
						  <MuiThemeProvider theme={muiTheme}>
						    <Grid container spacing={1}>
						      <Grid item sm={12} xs={12}>
						        {this.state.filter.groupBy &&
                      <React.Fragment>
                        <div className={styles.editGroupingButton}>
                          Grouped by {this.state.filter.groupBy}
                          {(this.state.additionalColumns && this.state.additionalColumns.length > 0) &&
                            <React.Fragment>
                              {' '}and {this.state.additionalColumns[0]}
                            </React.Fragment>
                          }
                          .
                        </div>
                        <div className={styles.editGroupingButton}>
                          <Button
                            variant="contained" color="primary"
                            onClick={() => this.openGroupByDialog()}>
                              Edit grouping
                          </Button>
                        </div>
                      </React.Fragment>
						        }

						        <Dialog disableBackdropClick disableEscapeKeyDown open={this.state.openGroupByDialog} onClose={() => this.closeGroupByDialog()}>
						          <DialogContent>
						            <MuiThemeProvider theme={muiTheme}>
						              <Grid container spacing={1}>
						                <Grid item sm={6} xs={12}>
                              Group by:
						                  <DropDown
						                    options={[{ name: '-Select-', placeholder: true }, 'Revenue type', 'Commodity', 'Land category', 'Location']}
						                    sortType={'none'}
						                    selectedOptionValue={this.state.filter.groupBy}
						                    action={value => this.setGroupByFilter(value)}
						                  />
						                </Grid>
						                <Grid item sm={6} xs={12}>
                              Breakout by:
						                  <DropDown
						                    options={[{ name: '-Select-', placeholder: true }].concat(this.additionalColumnOptionKeys)}
						                    sortType={'none'}
						                    selectedOptionValue={this.state.additionalColumns && this.state.additionalColumns[0]}
						                    action={value => this.setAdditionalColumns(value)}
						                  />
						                </Grid>
						              </Grid>
						            </MuiThemeProvider>
						            <DialogActions>
						              <Button
						                classes={{ root: styles.tableToolbarButton }}
						                variant="contained" color="primary"
						                onClick={() => this.closeGroupByDialog()}
						                color="primary">
                            Close
						              </Button>
						            </DialogActions>
						          </DialogContent>
						        </Dialog>
						      </Grid>
						      <Grid item sm={3} xs={12}>
						      </Grid>
						      <Grid item sm={4} xs={12}>

						      </Grid>
						    </Grid>
						  </MuiThemeProvider>
						  <GroupTable
						    rows={tableData}
						    columns={columns}
						    defaultSorting={defaultSorting}
						    tableColumnExtension={columnExtensions}
						    grouping={grouping}
						    currencyColumns={currencyColumns}
						    allColumns={allColumns}
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
)(QueryData)

const LocationMessage = ({ styles }) => (
  <div className={styles.locationMessage}>For privacy reasons, location is <GlossaryTerm>withheld</GlossaryTerm> for Native American data.</div>
)
const TableToolbar = ({ fiscalYearOptions, locationOptions, commodityOptions, countyOptions, defaultFiscalYearsSelected, onSubmitAction }) => {
  const [dataType, setDataType] = useState()
  const [landCategory, setLandCategory] = useState()
  const [locations, setLocations] = useState()
  const [commodities, setCommodities] = useState()
  const [counties, setCounties] = useState()
  const [revenueType, setRevenueType] = useState()
  const [fiscalYearStart, setFiscalYearStart] = useState()
  const [fiscalYearEnd, setFiscalYearEnd] = useState()
  const [fiscalYearsSelected, setFiscalYearSelected] = useState()
  const [groupBy, setGroupBy] = useState(Object.keys(GROUP_BY_OPTIONS)[DEFAULT_GROUP_BY_INDEX])
  const [additionalColumn, setAdditionalColumn] = useState(Object.keys(ADDITIONAL_COLUMN_OPTIONS)[DEFAULT_ADDITIONAL_COLUMN_INDEX])
  const getAdditionalColumnOptions = () => Object.keys(ADDITIONAL_COLUMN_OPTIONS).filter(column => column !== groupBy)

  const getLocationOptions = () => {
    if (landCategory === 'Native American') {
      return ['withheld']
    }
    if (landCategory === 'Onshore') {
      return locationOptions.filter(option => !option.includes('Offshore'))
    }
    if (landCategory === 'Federal (onshore and offshore)') {
      return locationOptions.filter(option => !option.includes('withheld'))
    }
    if (landCategory === 'Federal onshore') {
      return locationOptions.filter(option => (!option.includes('withheld') && !option.includes('Offshore')))
    }
    if (landCategory === 'Federal offshore') {
      return locationOptions.filter(option => (option.includes('Offshore') || option.includes('All')))
    }
    return locationOptions
  }

  let showLocationMessage = () => {
    let validLandCategories = ['All', 'All onshore', 'Native American']
    return validLandCategories.includes(landCategory)
  }

  useEffect(() => {
    setLandCategory(undefined)
    setLocations(undefined)
    setCounties(undefined)
    setCommodities(undefined)
    setRevenueType(undefined)
    setFiscalYearStart(undefined)
    setFiscalYearEnd(undefined)
  }, [dataType])

  useEffect(() => {
    setLocations(undefined)
    setCounties(undefined)
    setCommodities(undefined)
    setRevenueType(undefined)
    setFiscalYearStart(undefined)
    setFiscalYearEnd(undefined)
  }, [landCategory])

  useEffect(() => {
    setCounties(undefined)
    setCommodities(undefined)
    setRevenueType(undefined)
    setFiscalYearStart(undefined)
    setFiscalYearEnd(undefined)
  }, [locations])

  useEffect(() => {
    setCommodities(undefined)
    setRevenueType(undefined)
    setFiscalYearStart(undefined)
    setFiscalYearEnd(undefined)
  }, [counties])

  useEffect(() => {
    setRevenueType(undefined)
    setFiscalYearStart(undefined)
    setFiscalYearEnd(undefined)
  }, [commodities])

  useEffect(() => {
    if (fiscalYearStart && fiscalYearEnd) {
      if (fiscalYearStart <= fiscalYearEnd) {
        setFiscalYearSelected(utils.range(parseInt(fiscalYearStart), parseInt(fiscalYearEnd)))
      }
      else {
        setFiscalYearSelected(undefined)
        setFiscalYearEnd(undefined)
      }
    }
  }, [fiscalYearStart, fiscalYearEnd])

  const handleApply = () => {
    if (onSubmitAction) {
      onSubmitAction({
        dataType,
        landCategory,
        locations,
        counties,
        commodities,
        revenueType,
        fiscalYearsSelected,
      })
    }
  }

  const showCountyOptions = () => {
    return (locations !== undefined &&
      locations.length === 1 &&
      !locations.includes('All') &&
      !locations[0].includes('Offshore') &&
      landCategory !== 'Native American' &&
      landCategory !== 'All land categories' &&
      landCategory !== 'Onshore')
  }

  const showCommodities = () => {
    return ((showCountyOptions() && counties) || (!showCountyOptions() && locations))
  }

  return (
    <div className={styles.tableToolbarContainer}>
      <MuiThemeProvider theme={muiTheme}>
        <Grid container spacing={1}>
          <Grid item sm={2} xs={12}>
            <h6>Data type:</h6>
          </Grid>
          <Grid item sm={5} xs={12}>
            <DropDown
              options={[{ name: '-Select-', placeholder: true }, 'Revenue']}
              sortType={'none'}
              action={value => setDataType(value)}
            />
          </Grid>
          <Grid item sm={5}>
          </Grid>
          {dataType &&
            <React.Fragment>
              <Grid item sm={2} xs={12}>
                <h6>Land category:</h6>
              </Grid>
              <Grid item sm={5} xs={12}>
                <DropDown
                  options={[{ name: '-Select-', placeholder: true }].concat(Object.keys(LAND_CATEGORY_OPTIONS))}
                  selectedOptionValue={landCategory}
                  sortType={'none'}
                  action={value => setLandCategory(value)}
                />
              </Grid>
              <Grid item sm={5}>
              </Grid>
            </React.Fragment>
          }
          {landCategory &&
            <React.Fragment>
              <Grid item sm={2} xs={12}>
                <h6>Location:</h6>
              </Grid>
              <Grid item sm={5} xs={12}>
                <Select
                  multiple
                  sortType={'none'}
                  options={getLocationOptions()}
                  selectedOption={locations}
                  onChangeHandler={values => setLocations(values)}
                />
              </Grid>
              <Grid item sm={5}>
              </Grid>
              <Grid item sm={2} xs={12}>
              </Grid>
              <Grid item sm={10}>
                {showLocationMessage() &&
                  <LocationMessage styles={styles}/>
                }
              </Grid>
            </React.Fragment>
          }
          {showCountyOptions() &&
            <React.Fragment>
              <Grid item sm={2} xs={12}>
                <h6>County:</h6>
              </Grid>
              <Grid item sm={5} xs={12}>
                <Select
                  multiple
                  sortType={'none'}
                  options={countyOptions(locations[0])}
                  selectedOption={counties}
                  onChangeHandler={values => setCounties(values)}
                />
              </Grid>
              <Grid item sm={5}>
              </Grid>
            </React.Fragment>
          }
          {showCommodities() &&
            <React.Fragment>
              <Grid item sm={2} xs={12}>
                <h6>Commodity:</h6>
              </Grid>
              <Grid item sm={5} xs={12}>
                <Select
                  multiple
                  sortType={'none'}
                  options={commodityOptions}
                  selectedOption={commodities}
                  onChangeHandler={values => setCommodities(values)}
                />
              </Grid>
              <Grid item sm={5}>
              </Grid>
            </React.Fragment>
          }
          {commodities &&
            <React.Fragment>
              <Grid item sm={2} xs={12}>
                <h6>Revenue type:</h6>
              </Grid>
              <Grid item sm={5} xs={12}>
                <DropDown
                  options={[{ name: '-Select-', placeholder: true }, 'All', 'Rents', 'Royalties', 'Bonuses']}
                  sortType={'none'}
                  action={value => setRevenueType(value)}
                />
              </Grid>
              <Grid item sm={5}>
              </Grid>
            </React.Fragment>
          }
          {revenueType &&
            <React.Fragment>
              <Grid item sm={2} xs={12}>
                <h6>Fiscal year start:</h6>
              </Grid>
              <Grid item sm={5} xs={12}>
                <DropDown
                  options={[{ name: '-Select-', placeholder: true }].concat(fiscalYearOptions)}
                  sortType={'descending'}
                  action={value => setFiscalYearStart(value)}
                />
              </Grid>
              <Grid item sm={5}>
              </Grid>
            </React.Fragment>
          }
          {fiscalYearStart &&
            <React.Fragment>
              <Grid item sm={2} xs={12}>
                <h6>Fiscal year end:</h6>
              </Grid>
              <Grid item sm={5} xs={12}>
                <DropDown
                  options={[{ name: '-Select-', placeholder: true }].concat(fiscalYearOptions)}
                  selectedOptionValue={fiscalYearEnd}
                  sortType={'descending'}
                  action={value => setFiscalYearEnd(value)}
                />
              </Grid>
              <Grid item sm={5}>
              </Grid>
            </React.Fragment>
          }
          {fiscalYearsSelected &&
            <Grid item sm={7} xs={12} >
              <Button classes={{ root: styles.tableToolbarButton }} variant="contained" color="primary" onClick={() => handleApply()}>Submit</Button>
            </Grid>
          }
        </Grid>
	    </MuiThemeProvider>
	   </div>
  )
}

export const query = graphql`
  query QueryDataPageQuery {
		allProduction:allProductVolumesFiscalYear (filter:{FiscalYear:{ne:null}}, sort: {fields: [FiscalYear], order: DESC}) {
		  data:edges {
		    node {
		    	id
		      Volume
		      FiscalYear
		      Commodity
		      LandClass:LandCategory
		      County
		      State
		      ProductionDate
          OffshoreRegion
          LandCategory:OnshoreOffshore
		      RevenueCategory:LandCategory_OnshoreOffshore
		    }
		  }
		}
	  allProductionGroupByCommodity: allProductVolumesFiscalYear(
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
		      RevenueCategory
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
            State
	        }
	      }
	    }
	  }
	  allRevenuesGroupByRevenueCategory: allResourceRevenuesFiscalYear(
	  	filter: {
	  		FiscalYear: {ne: null}, 
	      RevenueCategory: {nin: [null,""]},
	  	}, 
	  	sort: {fields: [FiscalYear], order: DESC}) {
	    group(field: RevenueCategory) {
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
/*
          <Grid item sm xs={12}>
            <h6>Group by:</h6>
            <DropDown
              sortType={'none'}
              options={Object.keys(GROUP_BY_OPTIONS)}
              action={value => setGroupBy(value)}
              defaultOptionValue={groupBy}
              sortType={'none'}
            />
          </Grid>
          <Grid item sm xs={12}>
            <h6>Additional column:</h6>
            <DropDown
              sortType={'none'}
              options={getAdditionalColumnOptions()}
              action={value => setAdditionalColumn(value)}
              selectedOptionValue={additionalColumn}
            />
          </Grid>
*/
