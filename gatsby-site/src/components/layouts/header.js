import React from 'react';
import { connect } from 'react-redux';
import Link from 'components/utils/temp-link';
import Search from 'components/utils/search';

import NRRDLogo from "img/NRRD-logo.svg";

import { glossaryTermSelected as glossaryTermSelectedAction } from 'state/app';


const Header = (props) => {
  
  let defaultNavClassNames = {'className': " header-nav_item "};
  let homeClassNames = {'className': " header-nav_item "};
  let aboutClassNames = {'className': " header-nav_item "};
  let downloadClassNames = {'className': " header-nav_item_link_top "};

  if(typeof location !== 'undefined' && location) {
    if(location.pathname === '/') {
      homeClassNames.className += ' active ';
    }
    else if(location.pathname === '/about/') {
      aboutClassNames.className += ' active '; 
    }
    else if(location.pathname === '/downloads/') {
      downloadClassNames.className += ' active '; 
    }
  }

  
  return (
    <header className="header container-page-wrapper">
      <div className="header-left">
        <Link className="header-image_link" to="/">
          <h1 className="sr-only">
            US Department of the Interior Natural Resources Revenue Data
          </h1>
          <img className="header-image" src={NRRDLogo} alt="Logo" />
        </Link>
      </div>

      <nav className="header-nav header-right">
        <ul className="header-nav_top">
          <li className="header-nav_item_top">
            <a href="#" onClick={() => props.glossaryTermSelected('', true)} className="header-nav_item_link_top js-glossary-toggle" alt="this is the glossary drawer">Glossary</a>
          </li>
          <span className="header-nav_item_link_spacer"> | </span>
          <li className="header-nav_item_top">
            <Link {...downloadClassNames} to="/downloads/">Download data</Link>
          </li>

          <li className="header-nav_item_top">
            <Search />
          </li>

        </ul>
        <ul className="header-nav_bottom">
          <li {...homeClassNames}>
            <Link className="header-nav_item_link" to="/">Home</Link>
          </li>
          <li {...aboutClassNames}>
            <Link className="header-nav_item_link" to="/about/">About</Link>
          </li>
          <li {...defaultNavClassNames}>
            <Link className="header-nav_item_link" to="/how-it-works/">How it works</Link>
          </li>
          <li {...defaultNavClassNames}>
            <Link className="header-nav_item_link" to="/explore/">Explore data</Link>
          </li>
          <li {...defaultNavClassNames}>
            <Link className="header-nav_item_link" to="/case-studies/">Case studies</Link>
          </li>

        </ul>
      </nav>
    </header>
  );
}
export default connect(
  state => ({ glossaryOpen: state.app.glossaryOpen }),
  dispatch => ({ glossaryTermSelected: (term, doOpen) => dispatch(glossaryTermSelectedAction(term, doOpen)) }),
)(Header);
