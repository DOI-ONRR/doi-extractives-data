import React from 'react';

class Search extends React.Component {
  
constructor(props) {
  super(props);
  
  this.rootPath = "";
}

  componentDidMount(){
    if(typeof location !== 'undefined' && location) {
      console.log(location);
      this.rootPath = location.origin;
    }
  }

  render() {
    return(
      <form action={this.rootPath+"/search-results/"}>
        <label className='sr-only' htmlFor="q">Search</label>
        <input type="search" className="search-box header-nav_search" placeholder="Search" id="search-input" name="q" role="search"/>
        <button type="submit" className="header-nav_search_icon icon-search" title="search"><label className="sr-only">Search</label></button>
      </form>
    );
  }
  
}

export default Search;