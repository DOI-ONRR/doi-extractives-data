import React, { useState, useEffect } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { graphql } from 'gatsby'

import 'url-search-params-polyfill' // Temporary polyfill for EdgeHTML 14-16

import { normalize as normalizeDataSetAction,
  DISBURSEMENTS_FISCAL_YEAR,
  REVENUES_FISCAL_YEAR,
  PRODUCT_VOLUMES_FISCAL_YEAR,
  BY_ID, BY_COMMODITY,
  BY_STATE, BY_COUNTY,
  BY_OFFSHORE_REGION,
  BY_OFFSHORE_PLANNING_AREA,
  BY_LAND_CATEGORY,
  BY_LAND_CLASS,
  BY_REVENUE_TYPE,
  BY_FISCAL_YEAR,
  BY_REVENUE_CATEGORY,
  BY_FUND,
  BY_SOURCE,
  DATA_SET_KEYS } from '../../state/reducers/data-sets'

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

import RevenuesTableToolbar from '../../components/filter-toolbars/revenues/RevenuesTableToolbar'
import ProductionTableToolbar from '../../components/filter-toolbars/production/ProductionTableToolbar'
import DisbursementsTableToolbar from '../../components/filter-toolbars/disbursements/DisbursementsTableToolbar'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { object } from 'prop-types'

const PAGE_TITLE = 'Federal Revenue | Natural Resources Revenue Data'

const ALL = 'All'
const ALL_IDS = 'all_ids'
const SELECT = '-Select-'
const REVENUE = 'Revenue'
const PRODUCTION = 'Production'
const DISBURSEMENTS = 'Disbursements'
const RECIPIENT = 'Recipient'
const RECIPIENTS = 'Recipients'
const STATE = 'State'
const COUNTY = 'County'
const REGION = 'Region'
const COUNTIES_REGIONS = 'Counties_Regions'
const SOURCE = 'Source'
const SOURCES = 'Sources'
const LOCATIONS = 'Locations'
const LOCATION = 'Location'
const COUNTIES = 'Counties'
const FILTERED_IDS = 'filtered_ids'
const FISCAL_YEAR = 'FiscalYear'
const FISCAL_YEARS = 'fiscal_years'
const NO_SECOND_COLUMN = 'No second column'
const ONSHORE = 'Onshore'
const OFFSHORE = 'Offshore'
const ONSHORE_OFFSHORE = 'Onshore & Offshore'
const LAND_CATEGORY = 'Land Category'
const FEDERAL_ONSHORE = 'Federal onshore'
const FEDERAL_OFFSHORE = 'Federal offshore'
const FEDERAL_ONSHORE_OFFSHORE = 'Federal (onshore and offshore)'
const NATIVE_AMERICAN = 'Native American'
const COMMODITY = 'Commodity'
const COMMODITIES = 'Commodities'
const REVENUE_TYPE = 'Revenue type'

const DATA_TYPE_OPTIONS = {
  [REVENUE]: REVENUES_FISCAL_YEAR,
  [PRODUCTION]: PRODUCT_VOLUMES_FISCAL_YEAR,
  [DISBURSEMENTS]: DISBURSEMENTS_FISCAL_YEAR,
}

// Setting true and false to show as a group by option
// Some Land category options actually are multiple land categories and should be show as a group by option
const LAND_CATEGORY_OPTIONS = {
  [ALL]: true,
  [FEDERAL_ONSHORE]: false,
  [FEDERAL_OFFSHORE]: false,
  [ONSHORE]: true,
  [NATIVE_AMERICAN]: false,
  [FEDERAL_ONSHORE_OFFSHORE]: true,
}

const GROUP_BY_MAP_TO_DATA = {
  [REVENUE]: {
    [REVENUE_TYPE]: [BY_REVENUE_TYPE],
    [COMMODITY]: [BY_COMMODITY],
    [LAND_CATEGORY]: [BY_REVENUE_CATEGORY],
    [LOCATION]: [BY_STATE, BY_OFFSHORE_REGION],
    [COUNTY]: [BY_COUNTY],
    [REGION]: [BY_OFFSHORE_PLANNING_AREA],
  },
  [PRODUCTION]: {
    [COMMODITY]: [BY_COMMODITY],
    [LAND_CATEGORY]: [BY_REVENUE_CATEGORY],
    [LOCATION]: [BY_STATE, BY_OFFSHORE_REGION],
    [COUNTY]: [BY_COUNTY],
    [REGION]: [BY_OFFSHORE_PLANNING_AREA],
  },
  [DISBURSEMENTS]: {
    [RECIPIENT]: [BY_FUND],
    [SOURCE]: [BY_SOURCE],
    [LOCATION]: [BY_STATE],
    [COUNTY]: [BY_COUNTY],
  }
}
const GROUP_BY_OPTIONS = {
  [REVENUE]: filter => {
    let options = Object.keys(GROUP_BY_MAP_TO_DATA[REVENUE])
    if (![ALL, ONSHORE, FEDERAL_ONSHORE_OFFSHORE].includes(filter.landCategory)) {
      options = options.filter(option => option !== LAND_CATEGORY)
    }
    if (filter.revenueType !== ALL) {
      options = options.filter(option => option !== REVENUE_TYPE)
    }
    if (filter.commodities === undefined || (filter.commodities.length === 1 && filter.commodities[0] !== ALL)) {
      options = options.filter(option => option !== COMMODITY)
    }
    if (filter.locations === undefined || (filter.locations.length === 1 && filter.locations[0] !== ALL)) {
      options = options.filter(option => option !== LOCATION)
    }
    if (filter.countiesRegions === undefined || (filter.countiesRegions.length === 1 && filter.countiesRegions[0] !== ALL)) {
      options = options.filter(option => option !== COUNTY)
      options = options.filter(option => option !== REGION)
    }
    else {
      if (filter.locations[0].includes('Offshore')) {
        options = options.filter(option => option !== COUNTY)
      }
      else {
        options = options.filter(option => option !== REGION)
      }
    }
    options = (options.length === 0) ? [LAND_CATEGORY] : options
    return ({
      options: options,
      default: options[0]
    })
  },
  [PRODUCTION]: filter => {
    let options = Object.keys(GROUP_BY_MAP_TO_DATA[PRODUCTION])
    if (![ALL, ONSHORE, FEDERAL_ONSHORE_OFFSHORE].includes(filter.landCategory)) {
      options = options.filter(option => option !== LAND_CATEGORY)
    }
    if (filter.commodities === undefined || (filter.commodities.length === 1 && filter.commodities[0] !== ALL)) {
      options = options.filter(option => option !== COMMODITY)
    }
    if (filter.locations === undefined || (filter.locations.length === 1 && filter.locations[0] !== ALL)) {
      options = options.filter(option => option !== LOCATION)
    }
    if (filter.countiesRegions === undefined || (filter.countiesRegions.length === 1 && filter.countiesRegions[0] !== ALL)) {
      options = options.filter(option => option !== COUNTY)
      options = options.filter(option => option !== REGION)
    }
    else {
      if (filter.locations[0].includes('Offshore')) {
        options = options.filter(option => option !== COUNTY)
      }
      else {
        options = options.filter(option => option !== REGION)
      }
    }
    options = (options.length === 0) ? [LAND_CATEGORY] : options
    return ({
      options: options,
      default: options[0]
    })
  },
  [DISBURSEMENTS]: filter => {
    let options = Object.keys(GROUP_BY_MAP_TO_DATA[DISBURSEMENTS])
    if (![ALL].includes(filter.recipient)) {
      options = options.filter(option => option !== RECIPIENT)
    }
    if (![ALL].includes(filter.source)) {
      options = options.filter(option => option !== SOURCE)
    }
    if (filter.locations === undefined || (filter.locations.length === 1 && filter.locations[0] !== ALL)) {
      options = options.filter(option => option !== LOCATION)
    }
    if (filter.counties === undefined || (filter.counties.length === 1 && filter.counties[0] !== ALL)) {
      options = options.filter(option => option !== COUNTY)
    }
    options = (options.length === 0) ? [RECIPIENT] : options
    return ({
      options: options,
      default: options[0]
    })
  }
}

const ADDITIONAL_COLUMN_MAP_TO_DATA = {
  [REVENUE]: {
    [REVENUE_TYPE]: [DATA_SET_KEYS.REVENUE_TYPE],
    [COMMODITY]: [DATA_SET_KEYS.COMMODITY],
    [LAND_CATEGORY]: [DATA_SET_KEYS.LAND_CATEGORY],
    [LOCATION]: [DATA_SET_KEYS.STATE, DATA_SET_KEYS.OFFSHORE_REGION],
    [COUNTY]: [DATA_SET_KEYS.COUNTY],
    [REGION]: [DATA_SET_KEYS.OFFSHORE_PLANNING_AREA],
    [NO_SECOND_COLUMN]: [],
  },
  [PRODUCTION]: {
    [COMMODITY]: [DATA_SET_KEYS.COMMODITY],
    [LAND_CATEGORY]: [DATA_SET_KEYS.LAND_CATEGORY],
    [LOCATION]: [DATA_SET_KEYS.STATE, DATA_SET_KEYS.OFFSHORE_REGION],
    [COUNTY]: [DATA_SET_KEYS.COUNTY],
    [REGION]: [DATA_SET_KEYS.OFFSHORE_PLANNING_AREA],
    [NO_SECOND_COLUMN]: [],
  },
  [DISBURSEMENTS]: {
    [RECIPIENT]: [DATA_SET_KEYS.RECIPIENT],
    [SOURCE]: [DATA_SET_KEYS.SOURCE],
    [LOCATION]: [DATA_SET_KEYS.LOCATION],
    [COUNTY]: [DATA_SET_KEYS.COUNTY],
    [NO_SECOND_COLUMN]: [],
  }
}
const ADDITIONAL_COLUMN_OPTIONS = {
  [REVENUE]: (groupByOptions, groupBy) => {
    let options = groupByOptions && groupByOptions.concat(NO_SECOND_COLUMN)

    return ({
      options: options,
      default: options.find(option => option !== groupBy)
    })
  },
  [PRODUCTION]: (groupByOptions, groupBy, filter) => {
    let options = [NO_SECOND_COLUMN]

    //if (filter.commodities && filter.commodities.length === 1 && !filter.commodities.includes(ALL)) {
    options = groupByOptions && options.concat(groupByOptions)
    //}

    return ({
      options: options,
      default: options.find(option => option !== groupBy)
    })
  },
  [DISBURSEMENTS]: (groupByOptions, groupBy) => {
    let options = groupByOptions && groupByOptions.concat(NO_SECOND_COLUMN)

    return ({
      options: options,
      default: options.find(option => option !== groupBy)
    })
  }
}

const PLURAL_COLUMNS_MAP = {
  'Revenue type': 'revenue types',
  'Commodity': 'commodities',
  'Land Category': 'land categories',
  'Location': 'locations',
  [COUNTY]: 'counties',
  [REGION]: 'regions',
  [SOURCE]: SOURCES.toLowerCase(),
  [RECIPIENT]: RECIPIENTS.toLowerCase(),
}

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
    this.allGroupByColumns = Object.keys(GROUP_BY_MAP_TO_DATA).map(dataSetId => Object.keys(GROUP_BY_MAP_TO_DATA[dataSetId]))
    this.allGroupByColumns = [].concat.apply([], this.allGroupByColumns)
    this.allGroupByColumns = this.allGroupByColumns.filter((item, i, a) => a.indexOf(item) === i)

    let urlParams = new URLSearchParams()
    if (typeof window !== 'undefined' && window) {
      urlParams = new URLSearchParams(window.location.search)
    }
    this.dataTypeParam = urlParams.get('dataType')

    this.state = {
      openGroupByDialog: false,
      dataType: this.dataTypeParam,
      loading: false,
    }

    this.hydrateStore()
  }

  /**
   * This object contains all the comparison functions to determine if the data has the value in the filter
   */
  hasFilterValue = {
    [RECIPIENTS]: (data, filter) => {
      if (filter === ALL) {
        return true
      }
      return (filter === data.Recipient)
    },
    [SOURCE]: (data, filter) => {
      if (filter === ALL) {
        return true
      }
      return (filter === data.Source)
    },
    [LOCATIONS]: (data, filter) => {
      if (filter === undefined) {
        return true
      }
      else if (filter.includes(ALL)) {
        return true
      }

      return (filter.includes(data.State) || filter.includes(data.OffshoreRegion))
    },
    [COUNTIES]: (data, filter) => {
      if (filter === undefined || filter.includes(ALL)) {
        return true
      }
      return (filter.includes(data.County))
    },
    [COUNTIES_REGIONS]: (data, filter) => {
      if (filter === undefined || filter.includes(ALL)) {
        return true
      }
      return (filter.includes(data.County) || filter.includes(data.OffshorePlanningArea))
    },
    [FISCAL_YEAR]: (data, filter) => {
      if (filter === undefined || filter.includes(ALL)) {
        return true
      }
      return (filter.includes(parseInt(data.FiscalYear)))
    },
    [LAND_CATEGORY]: (data, filter) => {
      if (filter === undefined || filter.includes(ALL)) {
        return true
      }
      if (filter === 'Onshore') {
        return (filter.includes(data.LandCategory))
      }
      if (filter === FEDERAL_ONSHORE_OFFSHORE) {
        return ([FEDERAL_ONSHORE, FEDERAL_OFFSHORE].includes(data.RevenueCategory))
      }
      return (filter.includes(data.RevenueCategory))
    },
    [COMMODITIES]: (data, filter) => {
      if (filter === undefined || filter.includes(ALL)) {
        return true
      }
      return (filter.includes(data.Commodity))
    },
    [REVENUE_TYPE]: (data, filter) => {
      if (filter === undefined || filter === ALL) {
        return true
      }
      return (filter === data.RevenueType)
    },
  }

  /**
   * This sets the filtered data based on the type of filter and the value of the filter
   * The filter type then determines the hasFilterValue function to use
   * It uses the state Data Type to determine the correct data set to use
   */
  setFilteredIds = (filterType, filter, filterOrderNum) => {
    let filters = this.props[DATA_TYPE_OPTIONS[this.state.dataType]]['filters'] || {}
    let isEqual = true

    // Check to see if the filter has changed, if not then no need to rerun previous filters
    if (filters[filterType]) {
      if (Array.isArray(filters[filterType].value)) {
        if (filters[filterType].value.length === filter.length) {
          // Check to make sure both arrays have all the same values
          filters[filterType].value.forEach(item => {
            if (!filter.includes(item)) {
              isEqual = false
            }
          })
        }
        else {
          isEqual = false
        }
      }
      else {
        isEqual = (filters[filterType].value === filter)
      }
    }

    filters[filterType] = { orderNum: filterOrderNum, value: filter }

    if (isEqual) {
      let dataIds = this.props[DATA_TYPE_OPTIONS[this.state.dataType]][FILTERED_IDS] || Object.keys(this.props[DATA_TYPE_OPTIONS[this.state.dataType]][BY_ID])
      if (filter) {
        dataIds =
          dataIds.filter(id => this.hasFilterValue[filterType](this.props[DATA_TYPE_OPTIONS[this.state.dataType]][BY_ID][id], filter))
      }
      else {
        this.props[DATA_TYPE_OPTIONS[this.state.dataType]][FILTERED_IDS] = dataIds
      }
      this.props[DATA_TYPE_OPTIONS[this.state.dataType]][FILTERED_IDS] = dataIds
    }
    else {
      // Reset dataIds if filter changed and filter the data again using all the filters
      let dataIds = Object.keys(this.props[DATA_TYPE_OPTIONS[this.state.dataType]][BY_ID])
      let filterKeys = Object.keys(filters)
      filterKeys.sort((a, b) => (filters[a].orderNum < filters[b].orderNum) ? -1 : 1)

      filterKeys.forEach(type => {
        // If the filter order number is not defined set it to max number to let all filters run first
        filterOrderNum = filterOrderNum || Number.MAX_SAFE_INTEGER
        // If the order number is higher then the current filter order number then clear the filter
        filters[type] = (filters[type].orderNum && filterOrderNum && filters[type].orderNum <= filterOrderNum) ? filters[type] : undefined

        if (filters[type]) {
          dataIds =
            dataIds.filter(id => this.hasFilterValue[type](this.props[DATA_TYPE_OPTIONS[this.state.dataType]][BY_ID][id], filters[type].value))
        }
        else {
          delete filters[type]
        }
      })
      this.props[DATA_TYPE_OPTIONS[this.state.dataType]][FILTERED_IDS] = dataIds
    }

    this.props[DATA_TYPE_OPTIONS[this.state.dataType]]['filters'] = filters
  }

  /**
   * This helper function makes a unique array from the filered data using the specified data property
   */
  getUniqueOptionValuesFromFilteredData = (dataProps, addAllOption = true) => {
    let options = []
    dataProps.forEach(dataProp => {
      this.props[DATA_TYPE_OPTIONS[this.state.dataType]][FILTERED_IDS].forEach(id => {
        if (this.props[DATA_TYPE_OPTIONS[this.state.dataType]][BY_ID][id][dataProp]) {
          options.push(this.props[DATA_TYPE_OPTIONS[this.state.dataType]][BY_ID][id][dataProp])
        }
      })
    })

    options = Array.from(new Set(options))
    if (addAllOption && options.length > 1) {
      options = [ALL].concat(options)
    }

    return options
  }

  /**
   * The filter data options object contains code to filter the available options that are in the dataset.
   * As the user makes more selections the data set itself gets filtered and only available options are shown to the user.
   * Then when we submit we already have a filtered data set and only need to apply the last filtered option.
   *
   * Basically this is the filter engine for this query table.
   */
  filterDataOptions = {
    [REVENUE]: {
      [LAND_CATEGORY]: () => {
        return [{ name: SELECT, placeholder: true }].concat(Object.keys(LAND_CATEGORY_OPTIONS))
      },
      [LOCATION]: landCategory => {
        this.setFilteredIds(LAND_CATEGORY, landCategory, 1)

        let locationOptions = [].concat(
          this.getUniqueOptionValuesFromFilteredData([DATA_SET_KEYS.OFFSHORE_REGION], false).sort(),
          this.getUniqueOptionValuesFromFilteredData([DATA_SET_KEYS.STATE], false).sort())

        locationOptions = locationOptions.length > 1 ? [].concat([ALL], locationOptions) : locationOptions

        return locationOptions
      },
      [COUNTIES_REGIONS]: locations => {
        this.setFilteredIds(LOCATIONS, locations, 2)
        return this.getUniqueOptionValuesFromFilteredData([DATA_SET_KEYS.COUNTY, DATA_SET_KEYS.OFFSHORE_PLANNING_AREA])
      },
      [COMMODITIES]: ({ locations, countiesRegions }) => {
        if (countiesRegions) {
          this.setFilteredIds(COUNTIES_REGIONS, countiesRegions, 3)
        }
        else {
          this.setFilteredIds(LOCATIONS, locations, 2)
        }

        return this.getUniqueOptionValuesFromFilteredData([DATA_SET_KEYS.COMMODITY])
      },
      [REVENUE_TYPE]: commodities => {
        this.setFilteredIds(COMMODITIES, commodities, 4)
        return [{ name: SELECT, placeholder: true }].concat(this.getUniqueOptionValuesFromFilteredData([DATA_SET_KEYS.REVENUE_TYPE]))
      },
      [FISCAL_YEARS]: revenueType => {
        this.setFilteredIds(REVENUE_TYPE, revenueType, 5)
        return [{ name: SELECT, placeholder: true }].concat(this.getUniqueOptionValuesFromFilteredData([FISCAL_YEAR], false))
      }
    },
    [PRODUCTION]: {
      [LAND_CATEGORY]: () => {
        return [{ name: SELECT, placeholder: true }].concat(Object.keys(LAND_CATEGORY_OPTIONS))
      },
      [LOCATION]: landCategory => {
        this.setFilteredIds(LAND_CATEGORY, landCategory, 1)

        let locationOptions = [].concat(
          this.getUniqueOptionValuesFromFilteredData([DATA_SET_KEYS.OFFSHORE_REGION], false).sort(),
          this.getUniqueOptionValuesFromFilteredData([DATA_SET_KEYS.STATE], false).sort())

        locationOptions = locationOptions.length > 1 ? [].concat([ALL], locationOptions) : locationOptions

        return locationOptions
      },
      [COUNTIES_REGIONS]: locations => {
        this.setFilteredIds(LOCATIONS, locations, 2)

        return this.getUniqueOptionValuesFromFilteredData([DATA_SET_KEYS.COUNTY, DATA_SET_KEYS.OFFSHORE_PLANNING_AREA])
      },
      [COMMODITIES]: ({ locations, countiesRegions }) => {
        if (countiesRegions) {
          this.setFilteredIds(COUNTIES_REGIONS, countiesRegions, 3)
        }
        else {
          this.setFilteredIds(LOCATIONS, locations, 2)
        }

        return this.getUniqueOptionValuesFromFilteredData([DATA_SET_KEYS.COMMODITY])
      },
      [FISCAL_YEARS]: commodities => {
        this.setFilteredIds(COMMODITIES, commodities, 4)
        return [{ name: SELECT, placeholder: true }].concat(this.getUniqueOptionValuesFromFilteredData([FISCAL_YEAR], false))
      }
    },
    [DISBURSEMENTS]: {
      [RECIPIENTS]: () => {
        return [{ name: SELECT, placeholder: true }].concat([ALL], Object.keys(this.props[DISBURSEMENTS_FISCAL_YEAR][BY_FUND]))
      },
      [SOURCE]: recipient => {
        this.setFilteredIds(RECIPIENTS, recipient, 1)
        let options = this.getUniqueOptionValuesFromFilteredData([SOURCE])
        return [{ name: SELECT, placeholder: true }].concat(options.filter(option => option !== ONSHORE_OFFSHORE))
      },
      [LOCATIONS]: source => {
        this.setFilteredIds(SOURCE, source, 2)
        return this.getUniqueOptionValuesFromFilteredData([STATE])
      },
      [COUNTIES]: locations => {
        this.setFilteredIds(LOCATIONS, locations, 3)
        return this.getUniqueOptionValuesFromFilteredData([COUNTY])
      },
      [FISCAL_YEARS]: ({ source, locations, counties }) => {
        if (counties) {
          this.setFilteredIds(COUNTIES, counties, 4)
        }
        else if (locations) {
          this.setFilteredIds(LOCATIONS, locations, 3)
        }
        else {
          this.setFilteredIds(SOURCE, source, 2)
        }
        return [{ name: SELECT, placeholder: true }].concat(this.getUniqueOptionValuesFromFilteredData([FISCAL_YEAR], false))
      }
    }
  }

  // If group by column is in the additional columns remove it
  setGroupByFilter (value) {
    let currentAdditionalColumn = this.state[this.state.dataType].additionalColumn
    if (value === this.state[this.state.dataType].additionalColumn) {
      currentAdditionalColumn = NO_SECOND_COLUMN
    }
	  this.setState({
      loading: false,
      [this.state.dataType]: {
        ...this.state[this.state.dataType],
        groupBy: value,
        additionalColumnOptions: this.state[this.state.dataType].additionalColumnOptions,
        additionalColumn: currentAdditionalColumn,
        tableColumns: this.getTableColumns({
          filter: this.state[this.state.dataType].filter,
          groupBy: value,
          additionalColumn: currentAdditionalColumn }),
        tableData: this.getTableData({
          filter: this.state[this.state.dataType].filter,
          groupBy: value,
          additionalColumn: currentAdditionalColumn })
      }
    })
  }

  setAdditionalColumns (value) {
	  this.setState({
      [this.state.dataType]: {
        ...this.state[this.state.dataType],
        additionalColumn: value,
        groupBy: this.state[this.state.dataType].groupBy,
        groupByOptions: this.state[this.state.dataType].groupByOptions,
        tableColumns: this.getTableColumns({
          filter: this.state[this.state.dataType].filter,
          groupBy: this.state[this.state.dataType].groupBy,
          additionalColumn: value }),
        tableData: this.getTableData({
          filter: this.state[this.state.dataType].filter,
          groupBy: this.state[this.state.dataType].groupBy,
          additionalColumn: value })
      }
    })
  }

  onSubmitHandler (filter) {
    this.setFilteredIds(FISCAL_YEAR, filter.fiscalYearsSelected)
    let groupByFiltered = GROUP_BY_OPTIONS[this.state.dataType](filter)
    let additionalColumnFiltered = ADDITIONAL_COLUMN_OPTIONS[this.state.dataType](groupByFiltered.options, groupByFiltered.default, filter)

	  this.setState({
      [this.state.dataType]: {
        filter: filter,
        groupByOptions: groupByFiltered.options,
        groupBy: groupByFiltered.default,
        additionalColumnOptions: additionalColumnFiltered.options,
        additionalColumn: additionalColumnFiltered.default,
        tableColumns: this.getTableColumns({ filter: filter, groupBy: groupByFiltered.default, additionalColumn: additionalColumnFiltered.default }),
        tableSummaries: this.getTableSummaries({ filter: filter, groupBy: groupByFiltered.default, additionalColumn: additionalColumnFiltered.default }),
        tableData: this.getTableData({ filter: filter, groupBy: groupByFiltered.default, additionalColumn: additionalColumnFiltered.default })
      }
	  })
  }

	getTableColumns = dataTypeState => {
	  let columns = []; let defaultColumnWidths = []; let columnExtensions = []
	  let grouping = []; let currencyColumns = []; let volumeColumns = []; let defaultSorting = []
	  let allColumns = this.allGroupByColumns.map(column => utils.formatToSlug(column))

	  if (!dataTypeState.groupBy) {
	    throw new Error('Must have a group by option selected')
	  }

	  let groupBySlug = utils.formatToSlug(dataTypeState.groupBy)
	  columns.push({
	    name: groupBySlug,
	    title: dataTypeState.groupBy,
	    plural: PLURAL_COLUMNS_MAP[dataTypeState.groupBy]
	  })

	  if (dataTypeState.additionalColumn && dataTypeState.additionalColumn !== NO_SECOND_COLUMN) {
	    grouping.push({ columnName: groupBySlug })
	    columns.push({
	      name: utils.formatToSlug(dataTypeState.additionalColumn),
	      title: dataTypeState.additionalColumn,
	      plural: PLURAL_COLUMNS_MAP[dataTypeState.additionalColumn]
	    })
	  }

	  dataTypeState.filter.fiscalYearsSelected.sort().forEach(year => {
	    columns.push({ name: 'fy-' + year, title: year })
	    columnExtensions.push({ columnName: 'fy-' + year, align: 'right' })
	    defaultSorting = [{ columnName: 'fy-' + year, direction: 'desc' }]
	  })

	  // Have to add all the data provider types initially or they wont work??
	  let allYears = Object.keys(this.props[DATA_TYPE_OPTIONS[this.state.dataType]][BY_FISCAL_YEAR])
	  if (this.state.dataType === PRODUCTION) {
	    allYears.forEach(year => {
	      volumeColumns.push('fy-' + year)
	    })
	  }
	  else {
	    allYears.forEach(year => {
	      currencyColumns.push('fy-' + year)
	    })
	  }
	  allColumns.forEach(column => {
	    defaultColumnWidths.push({ columnName: column, width: 200 })
	  })
	  allYears.forEach(year => {
	    defaultColumnWidths.push({ columnName: 'fy-' + year, width: 200, minWidth: 100 })
	  })

	  let fixedColumn = grouping[0] ? columns[1].name : columns[0].name
	  return {
	    columns: columns,
	    defaultColumnWidths: defaultColumnWidths,
	    columnExtensions: columnExtensions,
	    grouping: grouping,
	    currencyColumns: currencyColumns,
	    volumeColumns: volumeColumns,
	    allColumns: allColumns,
	    defaultSorting: defaultSorting,
	    fixedColumn: fixedColumn
	  }
	}

	getTableSummaries = dataTypeState => {
	  let totalSummaryItems = []; let groupSummaryItems = []
	  let allYears = Object.keys(this.props[DATA_TYPE_OPTIONS[this.state.dataType]][BY_FISCAL_YEAR])

	  allYears.sort().forEach(year => {
	    totalSummaryItems.push({ columnName: 'fy-' + year, type: 'sum' })
	    groupSummaryItems.push({ columnName: 'fy-' + year, type: 'sum' })
	  })

	  // using type avg to attach the custom formatter function
	  this.allGroupByColumns.forEach(column => {
	    totalSummaryItems.push({ columnName: utils.formatToSlug(column), type: 'avg' })
	    groupSummaryItems.push({ columnName: utils.formatToSlug(column), type: 'avg' })
	  })

	  return {
	    totalSummaryItems: totalSummaryItems,
	    groupSummaryItems: groupSummaryItems,
	  }
	}

	getTableData = dataTypeState => {
	  const getSumValueProperty = () => {
	    switch (this.state.dataType) {
	    case REVENUE:
	      return 'Revenue'
	    case PRODUCTION:
	      return 'Volume'
	    case DISBURSEMENTS:
	      return 'Disbursement'
	    }
	  }

	  let dataSet = this.props[DATA_TYPE_OPTIONS[this.state.dataType]]
	  let filterIds = this.props[DATA_TYPE_OPTIONS[this.state.dataType]][FILTERED_IDS]
	  let allDataSetGroupBy = GROUP_BY_MAP_TO_DATA[this.state.dataType][dataTypeState.groupBy].map(groupBy => dataSet[groupBy])
	  let tableData = []
	  let expandedGroups = []

	  // Iterate over all group by data sets asociated with this filter group by
	  allDataSetGroupBy.forEach((dataSetGroupBy, indexGroupBy) => {
	    Object.keys(dataSetGroupBy).forEach(name => {
	      let sums = {}
	      let sumsByAdditionalColumns = {}
	      let additionalColumnsRow = {}
	      filterIds.forEach(filteredDataId => {
	        if (!dataSetGroupBy[name].includes(filteredDataId)) return
	        let data = dataSet[BY_ID][filteredDataId]

	        if (!expandedGroups.includes(name)) {
	          expandedGroups.push(name)
	        }

	        let fiscalYearSlug = 'fy-' + data.FiscalYear
	        sums[fiscalYearSlug] = (sums[fiscalYearSlug]) ? sums[fiscalYearSlug] + data[getSumValueProperty()] : data[getSumValueProperty()]
	        if (dataTypeState.additionalColumn) {
	          // Get the data columns related to the column in the table. Could have multiple data source columns mapped to 1 table column

	          let dataColumns = ADDITIONAL_COLUMN_MAP_TO_DATA[this.state.dataType][dataTypeState.additionalColumn]

	          dataColumns.map(column => {
	            let newValue = data[column]

	            if (additionalColumnsRow[dataTypeState.additionalColumn] === undefined) {
	              additionalColumnsRow[dataTypeState.additionalColumn] = []
	              sumsByAdditionalColumns[dataTypeState.additionalColumn] = {}
	            }

	            if (newValue) {
	              // Add the fiscal year revenue for the additional column, only works when there is 1 additional column
	              if (sumsByAdditionalColumns[dataTypeState.additionalColumn][newValue] === undefined) {
	                sumsByAdditionalColumns[dataTypeState.additionalColumn][newValue] = {}
	              }

	              let fyRevenue = data[getSumValueProperty()] || 0

	              sumsByAdditionalColumns[dataTypeState.additionalColumn][newValue][fiscalYearSlug] =
                  (sumsByAdditionalColumns[dataTypeState.additionalColumn][newValue][fiscalYearSlug])
                    ? sumsByAdditionalColumns[dataTypeState.additionalColumn][newValue][fiscalYearSlug] + fyRevenue
                    : fyRevenue

	              if (!additionalColumnsRow[dataTypeState.additionalColumn].includes(newValue)) {
	                additionalColumnsRow[dataTypeState.additionalColumn].push(newValue)
	              }
	            }
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
	              dataTypeState.filter.fiscalYearsSelected.forEach(year => {
	                let fiscalYearSlug = 'fy-' + year
	                sumsByAdditionalColumns[column][columnValue][fiscalYearSlug] = sumsByAdditionalColumns[column][columnValue][fiscalYearSlug] || 0
	              })
	              tableData.push(Object.assign({
	                [utils.formatToSlug(dataTypeState.groupBy)]: name,
	                [columnSlug]: columnValue
	              }, sumsByAdditionalColumns[column][columnValue]))
	            })
	          })
	        }
	        else {
	          dataTypeState.filter.fiscalYearsSelected.forEach(year => {
	            let fiscalYearSlug = 'fy-' + year
	            sums[fiscalYearSlug] = sums[fiscalYearSlug] || 0
	          })

	          tableData.push(Object.assign({ [utils.formatToSlug(dataTypeState.groupBy)]: name }, sums))
	        }
	      }
	    })
	  })

	  return { filteredData: tableData, expandedGroups: expandedGroups }
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
            key: BY_OFFSHORE_PLANNING_AREA,
            groups: data.allRevenuesGroupByOffshorePlanningArea.group,
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
      { key: PRODUCT_VOLUMES_FISCAL_YEAR,
        data: data.allProduction.data,
        groups: [
          {
            key: BY_COMMODITY,
            groups: data.allProductionGroupByCommodity.group,
          },
          {
            key: BY_STATE,
            groups: data.allProductionGroupByState.group,
          },
          {
            key: BY_OFFSHORE_REGION,
            groups: data.allProductionGroupByOffshoreRegion.group,
          },
          {
            key: BY_OFFSHORE_PLANNING_AREA,
            groups: data.allProductionGroupByOffshorePlanningArea.group,
          },
          {
            key: BY_COUNTY,
            groups: data.allProductionGroupByCounty.group,
          },
          {
            key: BY_REVENUE_CATEGORY,
            groups: data.allProductionGroupByRevenueCategory.group,
          },
          {
            key: BY_FISCAL_YEAR,
            groups: data.allProductionGroupByFiscalYear.group
          }
        ]
      },
      { key: DISBURSEMENTS_FISCAL_YEAR,
        data: data.allDisbursements.data,
        groups: [
          {
            key: BY_FUND,
            groups: data.allDisbursementsGroupByFund.group,
          },
          {
            key: BY_SOURCE,
            groups: data.allDisbursementsGroupBySource.group,
          },
          {
            key: BY_STATE,
            groups: data.allDisbursementsGroupByState.group,
          },
          {
            key: BY_COUNTY,
            groups: data.allDisbursementsGroupByCounty.group,
          },
          {
            key: BY_FISCAL_YEAR,
            groups: data.allDisbursementsGroupByFiscalYear.group,
          },
        ]
      },
    ])
  }

  getFilterToolbar () {
    let dataType = this.state.dataType

	  switch (dataType) {
	  case REVENUE:
	    return (<RevenuesTableToolbar
        getLandCategoryOptions={this.filterDataOptions[dataType][LAND_CATEGORY]}
        getLocationOptions={this.filterDataOptions[dataType][LOCATION]}
	      getCountyRegionOptions={this.filterDataOptions[dataType][COUNTIES_REGIONS]}
	      getCommodityOptions={this.filterDataOptions[dataType][COMMODITIES]}
	      getRevenueTypeOptions={this.filterDataOptions[dataType][REVENUE_TYPE]}
	      getFiscalYearOptions={this.filterDataOptions[dataType][FISCAL_YEARS]}
	      onSubmit={this.onSubmitHandler.bind(this)}
      />)
    case PRODUCTION:
      return (<ProductionTableToolbar
        getLandCategoryOptions={this.filterDataOptions[dataType][LAND_CATEGORY]}
        getLocationOptions={this.filterDataOptions[dataType][LOCATION]}
	      getCountyRegionOptions={this.filterDataOptions[dataType][COUNTIES_REGIONS]}
	      getCommodityOptions={this.filterDataOptions[dataType][COMMODITIES]}
	      getFiscalYearOptions={this.filterDataOptions[dataType][FISCAL_YEARS]}
        onSubmit={this.onSubmitHandler.bind(this)}
      />)
	  case DISBURSEMENTS:
	    return (<DisbursementsTableToolbar
	      getRecipientOptions={this.filterDataOptions[dataType][RECIPIENTS]}
	      getSourceOptions={this.filterDataOptions[dataType][SOURCE]}
	      getLocationOptions={this.filterDataOptions[dataType][LOCATIONS]}
	      getCountyOptions={this.filterDataOptions[dataType][COUNTIES]}
	      getFiscalYearOptions={this.filterDataOptions[dataType][FISCAL_YEARS]}
	      onSubmit={this.onSubmitHandler.bind(this)}
	    />)
	  }
  }

  render () {
    let tableColumns = this.state[this.state.dataType] && this.state[this.state.dataType].tableColumns
    let tableSummaries = this.state[this.state.dataType] && this.state[this.state.dataType].tableSummaries
    let tableData = this.state[this.state.dataType] && this.state[this.state.dataType].tableData
    let groupBy = this.state[this.state.dataType] && this.state[this.state.dataType].groupBy
    let groupByOptions = this.state[this.state.dataType] && this.state[this.state.dataType].groupByOptions
    let additionalColumn = this.state[this.state.dataType] && this.state[this.state.dataType].additionalColumn
    let additionalColumnOptions = this.state[this.state.dataType] && this.state[this.state.dataType].additionalColumnOptions

    if (this.state[this.state.dataType] && additionalColumnOptions) {
      additionalColumnOptions = additionalColumnOptions.filter(option => option !== this.state[this.state.dataType].groupBy)
    }

    // console.log(this.state.dataType, this.dataTypeParam)

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

          <h1>Data Query Tool</h1>
          <div className={styles.tableToolbarContainer}>
            <MuiThemeProvider theme={muiTheme}>
              <Grid container spacing={1}>
                <Grid item sm={2} xs={12}>
                  <h6>Data type:</h6>
                </Grid>
                <Grid item sm={5} xs={12}>
                  <DropDown
                    options={[{ name: '-Select-', placeholder: true }].concat(Object.keys(DATA_TYPE_OPTIONS))}
                    selectedOptionValue={this.state.dataType}
                    sortType={'none'}
                    action={value => {
                      this.props[DATA_TYPE_OPTIONS[value]][FILTERED_IDS] = undefined
                      this.setState({ dataType: value })
                    }}
                  />
                </Grid>
                <Grid item sm={5}>
                </Grid>
              </Grid>
            </MuiThemeProvider>
          </div>

          {(this.state.dataType && this.props[DATA_TYPE_OPTIONS[this.state.dataType]]) &&
            this.getFilterToolbar()
          }

          {tableData &&
						<div className={styles.tableContainer}>
						  <div className={styles.downloadLinkContainer}>
						    {(this.state.dataType === REVENUE) &&
                  <React.Fragment>
                    <ExploreDataLink to="/how-it-works/#revenues" icon="works">How revenue works</ExploreDataLink>
                    <ExploreDataLink to="/downloads/#revenue" icon="download">Downloads</ExploreDataLink>
                  </React.Fragment>
						    }
						    {(this.state.dataType === PRODUCTION) &&
                  <React.Fragment>
                    <ExploreDataLink to="/how-it-works/#production_process" icon="works">How production works</ExploreDataLink>
                    <ExploreDataLink to="/downloads/#production" icon="download">Downloads</ExploreDataLink>
                  </React.Fragment>
						    }
						    {(this.state.dataType === DISBURSEMENTS) &&
                  <React.Fragment>
                    <ExploreDataLink to="/how-it-works/#disbursements" icon="works">How disbursements works</ExploreDataLink>
                    <ExploreDataLink to="/downloads/#disbursements" icon="download">Downloads</ExploreDataLink>
                  </React.Fragment>
						    }
						  </div>
						  <h2 className={theme.sectionHeaderUnderline}>{this.state.dataType}</h2>
						  <MuiThemeProvider theme={muiTheme}>
						    <Grid container spacing={1}>
						      <Grid item sm={12} xs={12}>
						        {groupBy &&
                      <div className={styles.editGroupingButton}>
                        Grouped by {groupBy}
                        {(additionalColumn && additionalColumn !== NO_SECOND_COLUMN) &&
                          <React.Fragment>
                            {' '}and {additionalColumn}
                          </React.Fragment>
                        }
                      </div>
						        }
						        {(groupByOptions && (additionalColumnOptions && additionalColumnOptions.length > 1)) &&
                      <div className={styles.editGroupingButton}>
                        <Button
                          variant="contained" color="primary"
                          onClick={() => this.setState({ openGroupByDialog: !this.state.openGroupByDialog })}>
                            Edit grouping
                        </Button>
                      </div>
						        }
						        <Dialog
						          disableBackdropClick={false}
						          disableEscapeKeyDown={false}
						          open={this.state.openGroupByDialog}
						          onClose={() => this.setState({ openGroupByDialog: false })}
						        >
						          <DialogContent>
						            <MuiThemeProvider theme={muiTheme}>
						              <Grid container spacing={1}>
						                <Grid item sm={6} xs={12}>
                              Group by:
						                  <DropDown
						                    options={[{ name: '-Select-', placeholder: true }].concat(groupByOptions)}
						                    sortType={'none'}
						                    selectedOptionValue={groupBy}
						                    action={value => this.setGroupByFilter(value)}
						                  />
						                </Grid>
						                <Grid item sm={6} xs={12}>
                              Breakout by:
						                  <DropDown
						                    options={[{ name: '-Select-', placeholder: true }].concat(additionalColumnOptions)}
						                    sortType={'none'}
						                    selectedOptionValue={(!additionalColumn && (additionalColumnOptions && additionalColumnOptions.includes(NO_SECOND_COLUMN)))
						                      ? NO_SECOND_COLUMN
						                      : additionalColumn
						                    }
						                    action={value => this.setAdditionalColumns(value)}
						                  />
						                </Grid>
						              </Grid>
						            </MuiThemeProvider>
						            <DialogActions>
						              <Button
						                classes={{ root: styles.tableToolbarButton }}
						                variant="contained" color="primary"
						                onClick={() => this.setState({ openGroupByDialog: false })}
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
						    rows={tableData.filteredData}
						    columns={tableColumns.columns}
						    defaultColumnWidths={tableColumns.defaultColumnWidths}
						    defaultSorting={tableColumns.defaultSorting}
						    tableColumnExtension={tableColumns.columnExtensions}
						    grouping={tableColumns.grouping}
						    currencyColumns={tableColumns.currencyColumns}
						    volumeColumns={tableColumns.volumeColumns}
						    allColumns={tableColumns.allColumns}
						    expandedGroups={tableData.expandedGroups}
						    totalSummaryItems={tableSummaries.totalSummaryItems}
						    groupSummaryItems={tableSummaries.groupSummaryItems}
						    fixedColumn={tableColumns.fixedColumn}
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
    [PRODUCT_VOLUMES_FISCAL_YEAR]: state[CONSTANTS.DATA_SETS_STATE_KEY][PRODUCT_VOLUMES_FISCAL_YEAR],
    [DISBURSEMENTS_FISCAL_YEAR]: state[CONSTANTS.DATA_SETS_STATE_KEY][DISBURSEMENTS_FISCAL_YEAR],
  }),
  dispatch => ({ normalizeDataSet: dataSets => dispatch(normalizeDataSetAction(dataSets)),
  })
)(QueryData)

export const query = graphql`
  query QueryDataPageQuery {
    allDisbursements:allFederalDisbursements {
      data:edges {
        node {
          County
          Disbursement
          FiscalYear
          Recipient:Fund
          Source
          State:USState
          id
        }
      }
    }
    allDisbursementsGroupByFund:allFederalDisbursements (
	  	filter: {
		  	FiscalYear: {ne: null}, 
	      Fund: {nin: [null,""]},
      },  
	  	sort: {fields: [FiscalYear], order: DESC}) {
      group(field: Fund) {
        id:fieldValue
        data:edges {
          node {
            id
          }
        }
      }
    }
    allDisbursementsGroupBySource:allFederalDisbursements (
	  	filter: {
		  	FiscalYear: {ne: null}, 
	      Source: {nin: [null,""]},
      },
	  	sort: {fields: [FiscalYear], order: DESC}) {
      group(field: Source) {
        id:fieldValue
        data:edges {
          node {
            id
          }
        }
      }
    }
    allDisbursementsGroupByState:allFederalDisbursements (
	  	filter: {
		  	FiscalYear: {ne: null}, 
	      USState: {nin: [null,""]},
	    },  
	  	sort: {fields: [FiscalYear], order: DESC}) {
      group(field: USState) {
        id:fieldValue
        data:edges {
          node {
            id
          }
        }
      }
    }
    allDisbursementsGroupByCounty:allFederalDisbursements (
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
    allDisbursementsGroupByFiscalYear:allFederalDisbursements (
	  	filter: {
		  	FiscalYear: {ne: null}, 
	      County: {nin: [null,""]},
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
    allProduction:allProductVolumesFiscalYear (filter:{FiscalYear:{ne:null}}, sort: {fields: [FiscalYear], order: DESC}) {
      data:edges {
        node {
          id
          Volume
          FiscalYear
          Commodity:ProductNameUnits
          LandClass:LandCategory
          LandCategory:OnshoreOffshore
          RevenueCategory:LandCategory_OnshoreOffshore
          OffshoreRegion
          OffshorePlanningArea
          ProductionDate
          County
          State
        }
      }
    }
	  allProductionGroupByCommodity: allProductVolumesFiscalYear(
	  	filter: {
	  		FiscalYear: {ne: null},
	  		ProductNameUnits: {nin: [null,""]},
	  	}, 
	  	sort: {fields: [FiscalYear], order: DESC}) {
	    group(field: ProductNameUnits) {
	      id:fieldValue
	      data:edges {
	        node {
	          id
	        }
	      }
	    }
	  }
	  allProductionGroupByState: allProductVolumesFiscalYear(
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
	  allProductionGroupByOffshoreRegion: allProductVolumesFiscalYear(
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
    allProductionGroupByOffshorePlanningArea: allProductVolumesFiscalYear(
	  	filter: {
		  	FiscalYear: {ne: null}, 
	      OffshorePlanningArea: {nin: [null,""]},
	    }, 
	  	sort: {fields: [FiscalYear], order: DESC}) {
	    group(field: OffshorePlanningArea) {
	      id:fieldValue
	      data:edges {
	        node {
	          id
	        }
	      }
	    }
	  }
	  allProductionGroupByCounty: allProductVolumesFiscalYear(
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
	  allProductionGroupByRevenueCategory: allProductVolumesFiscalYear(
	  	filter: {
	  		FiscalYear: {ne: null}, 
	      LandCategory_OnshoreOffshore: {nin: [null,""]},
	  	}, 
	  	sort: {fields: [FiscalYear], order: DESC}) {
	    group(field: LandCategory_OnshoreOffshore) {
	      id:fieldValue
	      data:edges {
	        node {
	          id
	        }
	      }
	    }
	  }
	  allProductionGroupByFiscalYear: allProductVolumesFiscalYear(
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
          OffshorePlanningArea
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
	  allRevenuesGroupByOffshorePlanningArea: allResourceRevenuesFiscalYear(
	  	filter: {
		  	FiscalYear: {ne: null}, 
	      OffshorePlanningArea: {nin: [null,""]},
	    }, 
	  	sort: {fields: [FiscalYear], order: DESC}) {
	    group(field: OffshorePlanningArea) {
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
