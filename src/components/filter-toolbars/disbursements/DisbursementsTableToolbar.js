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
  stateOptions,
  countyOptions,
  fiscalYearOptions,
  onSubmit
}) => {
  const [recipient, setRecipient] = useState()
  const [source, setSource] = useState()
  const [states, setStates] = useState()
  const [counties, setCounties] = useState()
  const [fiscalYearStart, setFiscalYearStart] = useState()
  const [fiscalYearEnd, setFiscalYearEnd] = useState()
  const [fiscalYearsSelected, setFiscalYearSelected] = useState()

  useEffect(() => {
    setSource(undefined)
  }, [recipient])  
  
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
        states,
        counties,
        fiscalYearsSelected,
      })
    }
  }
  const showCountyOptions = () => {
    return (states !== undefined &&
      states.length === 1 &&
      !states.includes('All'))
  }
  const showFiscalYearStart = () => {
    let show = false
    console.log(counties)
    if(recipient === 'State' && counties && states) {
      show = true
    }
    else if(source) {
      show = true
    }
    return show
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
              options={recipientOptions}
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
                  options={sourceOptions}
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
                  options={stateOptions}
                  selectedOption={states}
                  onChangeHandler={values => setStates(values)}
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
                  options={countyOptions(states[0])}
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
                  options={fiscalYearOptions()}
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
                  options={fiscalYearOptions()}
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
