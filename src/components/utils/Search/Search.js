import React from 'react'
import { withPrefix } from '../../utils/temp-link'
import { useStaticQuery, graphql } from "gatsby"

import styles from './Search.module.css'

const Search = props => {
  const data = useStaticQuery(graphql`
    query SearchIndexQuery {
      siteSearchIndex {
        index
      }
    }
  `
) 
  console.log(data)  
  let searchPath = '/search-results/'

  if (typeof location !== 'undefined' && location) {
    searchPath = location.origin + withPrefix(searchPath)
  }
  else {
    searchPath = withPrefix(searchPath)
  }

  return (
    <div style={{height:'60px'}}>
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
  )
}

export default Search
