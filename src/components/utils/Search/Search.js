import React from 'react'
import { withPrefix } from '../../utils/temp-link'

import { makeStyles } from '@material-ui/core/styles'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import SearchIcon from '@material-ui/icons/Search'
import OutlinedInput from '@material-ui/core/OutlinedInput'

// eslint-disable-next-line css-modules/no-unused-class
// import styles from './Search.module.css'

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
    <FormControl variant="outlined">
      <div className={classes.search}>
        <OutlinedInput
          id="input-with-icon-adornment"
          margin="dense"
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
        />
      </div>
    </FormControl>
    // <div style={{ height: '60px' }}>
    //   { props.isMobile
    //     ? <label className={styles.searchLabel} htmlFor="q">Search</label>
    //     : <label className={styles.srOnly} htmlFor="q">Search</label>
    //   }
    //   <form action={searchPath} className={styles.searchForm} >

    //     <input title="search input" type="search"
    //       className={props.isMobile ? styles.searchBoxMobile : styles.searchBox}
    //       placeholder={props.isMobile ? '' : 'Search'}
    //       id="search-input" name="q" role="search"/>
    //     <button type="submit"
    //       className={props.isMobile ? styles.searchButtonMobile : styles.searchButton}
    //       title="submit search">
    //       <label className="sr-only">Search</label></button>
    //   </form>
    // </div>
  )
}

export default Search
