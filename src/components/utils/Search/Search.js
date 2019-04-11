import React from 'react'
import { withPrefix } from '../../utils/temp-link'

import styles from './Search.module.css'

const Search = props => {
  let searchPath = '/search-results/'

  if (typeof location !== 'undefined' && location) {
    searchPath = location.origin + withPrefix(searchPath)
  }
  else {
    searchPath = withPrefix(searchPath)
  }

  return (
    <div style={{height:'60px'}}>
      <div style={{display:'none'}} aria-hidden={true}>
        { props.isMobile
          ? <label className={styles.searchLabel} htmlFor="q">Search</label>
          : <label className={styles.srOnly} htmlFor="q">Search</label>
        }
        <form action={searchPath} className={styles.searchForm} >

          <input type="search"
            className={props.isMobile ? styles.searchBoxMobile : styles.searchBox}
            placeholder={props.isMobile ? '' : 'Search'}
            id="search-input" name="q" role="search"/>
          <button type="submit"
            className={props.isMobile ? styles.searchButtonMobile : styles.searchButton}
            title="search">
            <label className="sr-only">Search</label></button>
        </form>
      </div>
    </div>
  )
}

export default Search
