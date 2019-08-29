import React, { useEffect, useState } from 'react'

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

import styles from './QueryTool.module.scss'
// eslint-disable-next-line css-modules/no-unused-class
// import theme from '../../css-global/base-theme.module.scss'

import GlossaryTerm from '../utils/glossary-term.js'
import DropDown from '../selectors/DropDown'
import Select from '../selectors/Select'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
const TOGGLE_VALUES = {
  Year: 'year',
  Month: 'month'
}

const DEFAULT_GROUP_BY_INDEX = 0
const DEFAULT_ADDITIONAL_COLUMN_INDEX = 1

const LAND_CATEGORY_OPTIONS = {
  'All land categories': [BY_REVENUE_TYPE],
  'All federal': [BY_COMMODITY],
  'Federal onshore': [BY_LAND_CLASS, BY_LAND_CATEGORY],
  'Federal offshore': [BY_STATE, BY_OFFSHORE_REGION],
  'Native American': [BY_STATE, BY_OFFSHORE_REGION],
  'All onshore': [BY_STATE, BY_OFFSHORE_REGION],
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
  'Location': ['State', DATA_SET_KEYS.OFFSHORE_REGION],
  'No second column': [],
}
const PLURAL_COLUMNS_MAP = {
  'Revenue type': 'revenue types',
  'Commodity': 'commodities',
  'Land category': 'land categories',
  'Location': 'locations',
}

const QueryTool = ({ data }) => {
  const handleTableToolbarSubmit = updatedFilters => {
    console.log(updatedFilters)
  }
  return (
    <div>
      <TableToolbar
        fiscalYearOptions={[2018, 2017]}
        locationOptions={['AK', 'CA']}
        defaultFiscalYearsSelected={[2018]}
        onSubmitAction={handleTableToolbarSubmit.bind(this)}
      />
    </div>
  )
}

export default QueryTool

const LocationMessage = () => (
  <div className={styles.locationMessage}>For privacy reasons, location is <GlossaryTerm>withheld</GlossaryTerm> for Native American data.</div>
)
const muiTheme = createMuiTheme({
  root: {
    flexGrow: 0,
  },
  palette: {
    primary: {
      light: '#dcf4fd',
      main: '#1478a6',
      dark: '#086996'
    }
  },
})
const TableToolbar = ({ fiscalYearOptions, locationOptions, defaultFiscalYearsSelected, onSubmitAction }) => {
  const [dataType, setDataType] = useState()
  const [landCategory, setLandCategory] = useState()
  const [commodity, setCommodity] = useState()
  const [revenueType, setRevenueType] = useState()

  const [fiscalYearsSelected, setFiscalYearsSelected] = useState(defaultFiscalYearsSelected)
  const [locationSelected, setLocationSelected] = useState('All')
  const [groupBy, setGroupBy] = useState(Object.keys(GROUP_BY_OPTIONS)[DEFAULT_GROUP_BY_INDEX])
  const [additionalColumn, setAdditionalColumn] = useState(Object.keys(ADDITIONAL_COLUMN_OPTIONS)[DEFAULT_ADDITIONAL_COLUMN_INDEX])

  const getAdditionalColumnOptions = () => Object.keys(ADDITIONAL_COLUMN_OPTIONS).filter(column => column !== groupBy)
  const getLocationOptions = () => {
    if (landCategory === 'Native American') {
      return ['withheld']
    }
    if (landCategory === 'All onshore') {
      return locationOptions.filter(option => !option.includes('Offshore'))
    }
    if (landCategory === 'All federal') {
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
    if (additionalColumn === groupBy) {
      setAdditionalColumn('No second column')
    }

    if (!getLocationOptions().includes(locationSelected)) {
      setLocationSelected(((landCategory === 'Native American') ? 'withheld' : 'All'))
    }
  })

  const handleApply = () => {
    if (onSubmitAction) {
      onSubmitAction({
        dataType: dataType,
        landCategory: landCategory,
        commodity: commodity,
      })
    }
  }

  return (
    <div className={styles.tableToolbarContainer}>
      <MuiThemeProvider theme={muiTheme}>
        <Grid container spacing={12}>
          <Grid item sm={2} xs={12}>
            <h6>Data type:</h6>
          </Grid>
          <Grid item sm={10} xs={12}>
            <Grid item sm={4} xs={12}>
              <DropDown
                options={[{ name: '-Select-', placeholder: true }, 'Revenue']}
                sortType={'none'}
                action={value => setDataType(value)}
              />
            </Grid>
          </Grid>
          {dataType &&
            <React.Fragment>
              <Grid item sm={2} xs={12}>
                <h6>Land category:</h6>
              </Grid>
              <Grid item sm={10} xs={12}>
                <Grid item sm={4} xs={12}>
                  <DropDown
                    options={[{ name: '-Select-', placeholder: true }].concat(Object.keys(LAND_CATEGORY_OPTIONS))}
                    sortType={'none'}
                    action={value => setLandCategory(value)}
                  />
                  {showLocationMessage() &&
                  <LocationMessage />
                  }
                </Grid>
              </Grid>
            </React.Fragment>
          }
          {landCategory &&
            <React.Fragment>
              <Grid item sm={2} xs={12}>
                <h6>Commodity:</h6>
              </Grid>
              <Grid item sm={10} xs={12}>
                <Grid item sm={4} xs={12}>
                  <DropDown
                    options={[{ name: '-Select-', placeholder: true }, 'Coal', 'Gas']}
                    sortType={'none'}
                    action={value => setDataType(value)}
                  />
                </Grid>
              </Grid>
            </React.Fragment>
          }
          {landCategory &&
            <React.Fragment>
              <Grid item sm={2} xs={12}>
                <h6>Revenue Type:</h6>
              </Grid>
              <Grid item sm={10} xs={12}>
                <Grid item sm={4} xs={12}>
                  <DropDown
                    options={[{ name: '-Select-', placeholder: true }, 'All', 'Rents']}
                    sortType={'none'}
                    action={value => setDataType(value)}
                  />
                </Grid>
              </Grid>
            </React.Fragment>
          }
          <Grid item sm={2} xs={12}></Grid>
          <Grid item sm={10} xs={12}>
            <Grid item sm={4} xs={12} >
              <Button classes={{ root: styles.tableToolbarButton }} variant="contained" color="primary" onClick={() => handleApply()}>Submit</Button>
            </Grid>
          </Grid>
        </Grid>
	    </MuiThemeProvider>
	   </div>
  )
}

/*

          <Grid item sm={2} xs={12}>
            <h6>Fiscal year(s):</h6>
          </Grid>
          <Grid item sm={10} xs={12}>
            <Grid item sm={4} xs={12}>
              <Select
                multiple
                dataSetId={REVENUES_FISCAL_YEAR}
                options={fiscalYearOptions}
                sortType={'descending'}
                selectedOption={fiscalYearsSelected}
                onChangeHandler={values => setFiscalYearsSelected(values)}
              />
            </Grid>
          </Grid>
          <Grid item sm={2} xs={12}>
            <h6>Location:</h6>
          </Grid>
          <Grid item sm={10} xs={12}>
            <Grid item sm={4} xs={12}>
              <DropDown
                options={getLocationOptions()}
                sortType={'none'}
                action={value => setLocationSelected(value)}
                selectedOptionValue={locationSelected}
              />
            </Grid>
          </Grid>
          <Grid item sm={2} xs={12}>
            <h6>Group by:</h6>
          </Grid>
          <Grid item sm={10} xs={12}>
            <Grid item sm={4} xs={12}>
              <DropDown
                sortType={'none'}
                options={Object.keys(GROUP_BY_OPTIONS)}
                action={value => setGroupBy(value)}
                defaultOptionValue={groupBy}
                sortType={'none'}
              />
            </Grid>
          </Grid>
          <Grid item sm={2} xs={12}>
            <h6>Additional column:</h6>
          </Grid>
          <Grid item sm={10} xs={12}>
            <Grid item sm={4} xs={12}>
              <DropDown
                sortType={'none'}
                options={getAdditionalColumnOptions()}
                action={value => setAdditionalColumn(value)}
                selectedOptionValue={additionalColumn}
              />
            </Grid>
          </Grid>
          */