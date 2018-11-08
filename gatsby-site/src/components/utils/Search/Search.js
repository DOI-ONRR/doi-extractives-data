import React from 'react';
import { withPrefix } from '../../utils/temp-link';

const Search = () => {
  
  let searchPath = "/search-results/";

  if(typeof location !== 'undefined' && location) {
    searchPath = location.origin+withPrefix(searchPath);
  }
  else{
    searchPath = withPrefix(searchPath);
  }

  return(
    <form action={searchPath}>
      <label className='sr-only' htmlFor="q">Search</label>
      <input type="search" className="search-box header-nav_search" placeholder="Search" id="search-input" name="q" role="search"/>
      <button type="submit" className="header-nav_search_icon icon-search" title="search"><label className="sr-only">Search</label></button>
    </form>
  );
}

export default Search;