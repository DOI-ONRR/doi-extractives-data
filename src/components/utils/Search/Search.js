import React, { Fragment } from 'react'
import { withPrefix } from '../../utils/temp-link'

import { makeStyles } from '@material-ui/core/styles'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import OutlinedInput from '@material-ui/core/OutlinedInput'

// eslint-disable-next-line css-modules/no-unused-class
// import classes from './Search.module.css'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  }
}))

const Search = props => {
  const classes = useStyles()

  let searchPath = '/search-results/'

  // eslint-disable-next-line no-undef
  if (typeof location !== 'undefined' && location) {
    // eslint-disable-next-line no-undef
    searchPath = location.origin + withPrefix(searchPath)
  }
  else {
    searchPath = withPrefix(searchPath)
  }

  return (
    <Fragment>
      <form action={searchPath} className={classes.searchForm}>
        <OutlinedInput
          id="search-input"
          margin="dense"
          title="search input" type="search"
          className={props.isMobile ? classes.searchBoxMobile : classes.searchBox}
          placeholder={props.isMobile ? '' : 'Search'}
          name="q"
          role="search"
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
        />
      </form>
    </Fragment>
  )
}

export default Search
