import React, { useEffect, useState } from 'react'

import styles from './RevenuesTableToolbar.module.scss'

import utils from '../../../js/utils'
import { FEDERAL_OFFSHORE, FEDERAL_ONSHORE } from '../../../js/constants'

import DropDown from '../../selectors/DropDown'
import Select from '../../selectors/Select'
import GlossaryTerm from '../../utils/glossary-term.js'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
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

const RevenuesTableToolbar = ({
  getLandCategoryOptions,
  getLocationOptions,
  getCountyRegionOptions,
  getCommodityOptions,
  getRevenueTypeOptions,
  getFiscalYearOptions,
  onSubmit
}) => {
  const [landCategory, setLandCategory] = useState()

  const [locationOptions, setLocationOptions] = useState()
  const [locations, setLocations] = useState()
  const [disableLocation, setDisableLocation] = useState()

  const [countyRegionOptions, setCountyRegionOptions] = useState()
  const [countiesRegions, setCountiesRegions] = useState()

  const [commodityOptions, setCommodityOptions] = useState()
  const [commodities, setCommodities] = useState()

  const [revenueTypeOptions, setRevenueTypeOptions] = useState()
  const [revenueType, setRevenueType] = useState()

  const [fiscalYearStartOptions, setFiscalYearStartOptions] = useState()
  const [fiscalYearStart, setFiscalYearStart] = useState()
  const [fiscalYearEnd, setFiscalYearEnd] = useState()
  const [fiscalYearsSelected, setFiscalYearSelected] = useState()

  useEffect(() => {
    if (landCategory) {
      let options = getLocationOptions(landCategory)
      setLocationOptions(options)
      setLocations(getLocationsState(options))
    }
    else {
      setLocations(undefined)
    }
    setCountiesRegions(undefined)
    setCommodities(undefined)
    setRevenueType(undefined)
    setFiscalYearStart(undefined)
    setFiscalYearEnd(undefined)
    setFiscalYearSelected(undefined)
  }, [landCategory])

  useEffect(() => {
    setCountiesRegions(undefined)
    if (locations) {
      setCountyRegionOptions(getCountyRegionOptions(locations))
      setCommodityOptions(getCommodityOptions({ locations, countiesRegions }))
    }
    setCommodities(undefined)
    setRevenueType(undefined)
    setFiscalYearStart(undefined)
    setFiscalYearEnd(undefined)
    setFiscalYearSelected(undefined)
  }, [locations])

  useEffect(() => {
    if (countiesRegions) {
      setCommodityOptions(getCommodityOptions({ locations, countiesRegions }))
    }
    setCommodities(undefined)
    setRevenueType(undefined)
    setFiscalYearStart(undefined)
    setFiscalYearEnd(undefined)
    setFiscalYearSelected(undefined)
  }, [countiesRegions])

  useEffect(() => {
    setRevenueType(undefined)
    if (commodities) {
      setRevenueTypeOptions(getRevenueTypeOptions(commodities))
    }
    setFiscalYearStart(undefined)
    setFiscalYearEnd(undefined)
    setFiscalYearSelected(undefined)
  }, [commodities])

  useEffect(() => {
    setFiscalYearStart(undefined)
    if (revenueType) {
      setFiscalYearStartOptions(getFiscalYearOptions(revenueType))
    }
    setFiscalYearEnd(undefined)
    setFiscalYearSelected(undefined)
  }, [revenueType])

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
    if (onSubmit) {
      onSubmit({
        landCategory,
        locations,
        countiesRegions,
        commodities,
        revenueType,
        fiscalYearsSelected
      })
    }
  }

  const showCountyRegionOptions = () => {
    return (
      locations !== undefined &&
      locations.length === 1 &&
      !locations.includes('All') &&
      (countyRegionOptions !== undefined && countyRegionOptions.length > 0)
    )
  }

  const showCommodity = () => {
    if (locations && !showCountyRegionOptions()) {
      return true
    }
    else if (locations && countiesRegions) {
      return true
    }
    return false
  }

  const getFiscalYearEndOptions = () => {
    if (fiscalYearStartOptions) {
      // Assuming if the first option is an object then it is a placeholder option
      if (typeof fiscalYearStartOptions[0] === 'object') {
        return [fiscalYearStartOptions[0]].concat(fiscalYearStartOptions.filter(option => (parseInt(option) >= parseInt(fiscalYearStart))))
      }
      else {
        return fiscalYearStartOptions.filter(option => (parseInt(option) >= parseInt(fiscalYearStart)))
      }
    }
    return []
  }

  const getLocationLabel = () => {
    switch (landCategory) {
    case FEDERAL_ONSHORE:
      return 'State:'
    case FEDERAL_OFFSHORE:
      return 'Offshore Area:'
    }

    return 'Location:'
  }
  const getCountyLabel = () => {
    switch (locations[0]) {
    case 'AK':
      return 'Borough:'
    case 'LA':
      return 'Parish:'
    }

    return (locations[0] && locations[0].includes('Offshore')) ? 'Region:' : 'County:'
  }

  const getLocationsState = options => {
    if (landCategory) {
      if (options && options.length === 1) {
        setDisableLocation(true)
        return options
      }
      else {
        setDisableLocation(false)
      }
    }
  }

  return (
    <div className={styles.tableToolbarContainer}>
      <MuiThemeProvider theme={muiTheme}>
        <Grid container spacing={1}>
          <Grid item sm={2} xs={12}>
            <h6>Land category:</h6>
          </Grid>
          <Grid item sm={5} xs={12}>
            <DropDown
              options={getLandCategoryOptions()}
              selectedOptionValue={landCategory}
              sortType={'none'}
              action={value => setLandCategory(value)}
            />
          </Grid>
          <Grid item sm={5}>
          </Grid>
          {landCategory &&
            <React.Fragment>
              <Grid item sm={2} xs={12}>
                <h6>{getLocationLabel()}</h6>
              </Grid>
              <Grid item sm={5} xs={12}>
                <Select
                  multiple
                  sortType={'none'}
                  options={locationOptions}
                  selectedOption={locations}
                  onChangeHandler={values => setLocations(values)}
                  isDisabled={disableLocation}
                />
              </Grid>
              <Grid item sm={5}>
              </Grid>
              <Grid item sm={2} xs={12}>
              </Grid>
              <Grid item sm={10}>
                {(landCategory === 'Native American' || landCategory === 'All' || landCategory === 'Onshore') &&
                  <div className={styles.locationMessage}>For privacy reasons, location is <GlossaryTerm>withheld</GlossaryTerm> for Native American data.</div>
                }
              </Grid>
            </React.Fragment>
          }
          {showCountyRegionOptions() &&
            <React.Fragment>
              <Grid item sm={2} xs={12}>
                <h6>{getCountyLabel()}</h6>
              </Grid>
              <Grid item sm={5} xs={12}>
                <Select
                  multiple
                  sortType={'none'}
                  options={countyRegionOptions}
                  selectedOption={countiesRegions}
                  onChangeHandler={values => setCountiesRegions(values)}
                />
              </Grid>
              <Grid item sm={5}>
              </Grid>
            </React.Fragment>
          }
          {showCommodity() &&
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
                  options={revenueTypeOptions}
                  selectedOptionValue={revenueType}
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
                  options={fiscalYearStartOptions}
                  selectedOptionValue={fiscalYearStart}
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
                  options={getFiscalYearEndOptions()}
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

export default RevenuesTableToolbar
