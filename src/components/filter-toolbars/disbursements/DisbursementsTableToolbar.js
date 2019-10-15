import React, { useEffect, useState } from 'react'

import styles from './DisbursementsTableToolbar.module.scss'

import utils from '../../../js/utils'

import DropDown from '../../selectors/DropDown'
import Select from '../../selectors/Select'

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

const DisbursementsTableToolbar = ({
  recipientOptions,
  sourceOptions,
  locationOptions,
  countyOptions,
  fiscalYearOptions,
  onSubmit
}) => {
  const [recipient, setRecipient] = useState()
  const [source, setSource] = useState()
  const [locations, setLocations] = useState()
  const [counties, setCounties] = useState()
  const [fiscalYearStart, setFiscalYearStart] = useState()
  const [fiscalYearEnd, setFiscalYearEnd] = useState()
  const [fiscalYearsSelected, setFiscalYearSelected] = useState()

  let fiscalYearStartOptions = []

  useEffect(() => {
    setSource(undefined)
    setLocations(undefined)
    setCounties(undefined)
    setFiscalYearStart(undefined)
    setFiscalYearEnd(undefined)
    setFiscalYearSelected(undefined)
  }, [recipient])

  useEffect(() => {
    if (source === 'State') {
      let filteredLocationOptions = locationOptions()
      if (filteredLocationOptions && filteredLocationOptions.length === 1) {
        setLocations(filteredLocationOptions)
      }
      else {
        setLocations(undefined)
      }
    }
    else {
      setLocations(undefined)
    }

    setCounties(undefined)
    setFiscalYearStart(undefined)
    setFiscalYearEnd(undefined)
    setFiscalYearSelected(undefined)
  }, [source])

  useEffect(() => {
    setCounties(undefined)
    setFiscalYearStart(undefined)
    setFiscalYearEnd(undefined)
    setFiscalYearSelected(undefined)
  }, [locations])

  useEffect(() => {
    setFiscalYearStart(undefined)
    setFiscalYearEnd(undefined)
    setFiscalYearSelected(undefined)
  }, [counties])

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
        recipient,
        source,
        locations,
        counties,
        fiscalYearsSelected,
      })
    }
  }
  const showCountyOptions = () => {
    return (locations !== undefined &&
      locations.length === 1 &&
      !locations.includes('All') &&
      countyOptions(locations).length > 0)
  }

  const showFiscalYearStart = () => {
    let show = false

    if (recipient === 'State' && locations) {
      if (locations.length === 1 && (counties || !showCountyOptions())) {
        show = true
      }
      else if (locations.length > 1 || locations.includes('All')) {
        show = true
      }
    }
    else if (source && recipient !== 'State') {
      show = true
    }

    return show
  }

  const getFiscalYearStartOptions = () => {
    fiscalYearStartOptions = fiscalYearOptions({ source, locations, counties })
    return fiscalYearStartOptions
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

  return (
    <div className={styles.tableToolbarContainer}>
      <MuiThemeProvider theme={muiTheme}>
        <Grid container spacing={1}>
          <Grid item sm={2} xs={12}>
            <h6>Recipient:</h6>
          </Grid>
          <Grid item sm={5} xs={12}>
            <DropDown
              options={recipientOptions()}
              selectedOptionValue={recipient}
              sortType={'none'}
              action={value => setRecipient(value)}
            />
          </Grid>
          <Grid item sm={5}>
          </Grid>
          {recipient &&
            <React.Fragment>
              <Grid item sm={2} xs={12}>
                <h6>Source:</h6>
              </Grid>
              <Grid item sm={5} xs={12}>
                <DropDown
                  options={sourceOptions(recipient)}
                  selectedOptionValue={source}
                  sortType={'none'}
                  action={value => setSource(value)}
                />
              </Grid>
              <Grid item sm={5}>
              </Grid>
            </React.Fragment>
          }
          {(source && recipient === 'State') &&
            <React.Fragment>
              <Grid item sm={2} xs={12}>
                <h6>State:</h6>
              </Grid>
              <Grid item sm={5} xs={12}>
                <Select
                  multiple
                  sortType={'none'}
                  options={locationOptions(source)}
                  selectedOption={locations}
                  onChangeHandler={values => setLocations(values)}
                />
              </Grid>
              <Grid item sm={5}>
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
                  options={countyOptions(locations)}
                  selectedOption={counties}
                  onChangeHandler={values => setCounties(values)}
                />
              </Grid>
              <Grid item sm={5}>
              </Grid>
            </React.Fragment>
          }
          {showFiscalYearStart() &&
            <React.Fragment>
              <Grid item sm={2} xs={12}>
                <h6>Fiscal year start:</h6>
              </Grid>
              <Grid item sm={5} xs={12}>
                <DropDown
                  options={getFiscalYearStartOptions()}
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

export default DisbursementsTableToolbar
