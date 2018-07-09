import React from 'react';

const Glossary = () => (
  <div id="glossary" className="drawer"
        aria-describedby="glossary-result" aria-hidden="true">
    <div className="container">
      <button id="glossary-toggle" className="button button--close toggle">
        <label for="glossary-toggle" className="sr-only">Close glossary</label><icon className="icon-close-x"></icon>
      </button>
    </div>

    <h1 className="h2 drawer-header"><icon className="icon-book"></icon> Glossary </h1>
    <label for="drawer-search-bar" className="label">Filter glossary terms</label>
    <input id="drawer-search-bar" className="js-glossary-search drawer-search" type="search" placeholder="e.g. Fossil fuel" />
    <div id="glossary-result">
      <ul className="js-glossary-list list-unstyled" accordion="glossary-accordion">
        <li className="glossary-item">
          <h2 className="glossary-term">term</h2>
          <button><span className="sr-only">Toggle for term</span></button>
          <p className="glossary-definition accordion-content">term</p>
        </li>
      </ul>
    </div>
  </div>
);

export default Glossary;

/*
        {% for term in site.data.terms %}
        <li className="glossary-item">
          <h2 className="glossary-term">{{term[0]}}</h2>
          <button><span className="sr-only">Toggle for {{term[0]}}</span></button>
          <p className="glossary-definition accordion-content">{{term[1]}}</p>
        </li>
        {% endfor %}
        
*/