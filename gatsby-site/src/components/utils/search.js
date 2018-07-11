import React from 'react';
import { withPrefix } from 'components/utils/temp-link';

class Search extends React.Component {
  
  searchPath = "/search-results/";

  render() {
    if(typeof location !== 'undefined' && location) {
      this.searchPath = location.origin+withPrefix(this.searchPath);
    }
    else{
      this.searchPath = withPrefix(this.searchPath);
    }
    return(
      <form action={this.searchPath}>
        <label className='sr-only' htmlFor="q">Search</label>
        <input type="search" className="search-box header-nav_search" placeholder="Search" id="search-input" name="q" role="search"/>
        <button type="submit" className="header-nav_search_icon icon-search" title="search"><label className="sr-only">Search</label></button>
      </form>
    );
  }
  
}

export default Search;