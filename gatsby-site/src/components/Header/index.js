import React from 'react';
import Link from 'gatsby-link';

import NRRDLogo from "../../img/NRRD-logo.svg";

const Header = ({ siteMetadata }) => (
  <header className="header container-page-wrapper">
    <div className="header-left">
      <a className="header-image_link" href={siteMetadata.url}>
        <h1 className="sr-only">
          US Department of the Interior Natural Resources Revenue Data
        </h1>
        <img className="header-image" src={NRRDLogo} alt="Logo" />
      </a>
    </div>
  
    <nav className="header-nav header-right">
      <ul className="header-nav_top">
        <li className="header-nav_item_top">
          <a href="javascript:void(0)" className="header-nav_item_link_top js-glossary-toggle" alt="this is the glossary drawer">Glossary</a>
        </li>
        <span className="header-nav_item_link_spacer"> | </span>
        <li className="header-nav_item_top">
          <a className="header-nav_item_link_top {% if page.permalink contains '/downloads/' %}active{% endif %}" href="{{ site.baseurl }}/downloads/">Download data</a>
        </li>

        <li className="header-nav_item_top">
          <form action='{{ site.baseurl }}/search-results/'>
            <label className='sr-only' for="q">Search</label>
            <input type="search" className="search-box header-nav_search" placeholder="Search" id="search-input" name="q" role="search"/>
            <button type="submit" className="header-nav_search_icon icon-search" title="search"><label className="sr-only">Search</label></button>
          </form>
        </li>

      </ul>
      <ul className="header-nav_bottom">
        <li className="header-nav_item {% if page.title == 'Home' %}active{% endif %}">
          <a className="header-nav_item_link" href={siteMetadata.url}>Home</a>
        </li>
        <li className="header-nav_item {% if page.permalink contains '/about/' %}active{% endif %}">
          <a className="header-nav_item_link" href={siteMetadata.url+"/about/"}>About</a>
        </li>
        <li className="header-nav_item {% if page.permalink contains '/how-it-works/' or layout.nav_name == 'how-it-works' %}active{% endif %}">
          <a className="header-nav_item_link" href={siteMetadata.url+"/how-it-works/"}>How it works</a>
        </li>
        <li className="header-nav_item {% if page.permalink contains '/explore/' or layout.nav_name == 'explore' %}active{% endif %}">
          <a className="header-nav_item_link" href={siteMetadata.url+"/explore/"}>Explore data</a>
        </li>
        <li className="header-nav_item {% if page.permalink contains '/case-studies/' %}active{% endif %}">
          <a className="header-nav_item_link" href={siteMetadata.url+"/case-studies/"}>Case studies</a>
        </li>

      </ul>
    </nav>
  </header>
);

export default Header;