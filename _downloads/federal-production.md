---
title: Federal Production | Documentation
layout: default
permalink: /downloads/federal-production/
---

<div class="container-outer container-padded">

  <article class="container-left-7">

    <div>
      <a class="breadcrumb" href="{{ site.baseurl }}/downloads/">Downloads</a>
      /
    </div>
    <h1>Federal Production by Location</h1>

    <p class="case_studies_intro-para">This dataset contains information on production on federal lands and waters for calendar years 2005-2014. The data is current as of July 11, 2015 for coal and hardrock production and August 25, 2015 for Oil and Gas production. If you are looking for datasets organized by the U.S. government’s fiscal year, please visit <a href="http://statistics.onrr.gov/">statistics.onrr.gov</a>.</p>

    <p class="downloads-download_links-intro">Download calendar year data:
      <ul class="downloads-download_links">
        <li><a href="{{site.baseurl}}/downloads/production_federal_lands_waters_CY2013_oil_gas_solids-2015-11-25.xlsx"><icon class="icon-cloud icon-padded"></icon>Full dataset (xlsx, 517 KB)</a></li>
        <li><a href="#"><icon class="icon-cloud icon-padded"></icon>Full dataset (tsv)</a></li>
      </ul>
    </p>

    <p class="u-margin-top">We also have <a href="https://github.com/18F/doi-extractives-data/wiki/Data-Catalog#federal-production">notes on this data</a> from the web development team as they built the interactions on this site.</p>

    <h2 class="h3">Scope</h2>
    <p>This dataset includes natural resource production for U.S. federal lands and offshore areas. It does not include Indian lands, privately-owned lands, or U.S. state lands. The dataset currently include data tracked and managed by the Department of the Interior’s Office of Natural Resources Revenue (ONRR). The production data for Oil and Gas is collected on Form ONRR-4054 (Oil and Gas Operations Report). Coal and hardrock production is collected on Form ONRR-4430 (Solid Minerals Production and Royalty Report).</p>

    <h2 class="h3">Data Publication</h2>

    <p>This dataset is updated six months after the end of the year. Fiscal year 2015 data will be published in March 2016 and calendar year 2015 data will be published in June 2016. </p>

    <h2 class="h3">Why was some solids data withheld?</h2>

    <p>ONRR withheld some solids production information out of an abundance of caution to ensure that there were no violations of the Trade Secrets Act. </p>

    <ul class="list-bullet">
        <li>"W" is displayed in the Production Volume column for those products that reveal proprietary data at the county level </li>
        <li>All "W" volumes are accounted for in separate line totals where state and county have been "Withheld" (columns C, D and E)</li>
    </ul>

    <h2 class="h3">A note about 'Mixed Exploratory' versus 'Federal' categories of production.</h2>

    <p>Coming soon!</p>

    <!-- <p>For the purposes of the visualizations on our site, we've aggregated production on two types of jurisdictions: 'mixed exploratory' and 'federal.' Federal production is federal production; this is straightforward. However, 'mixed exploratory' ... [need explanation, the note I have is: One item I noticed from the Data Downloads page is that the "Download documentation" file, for the Production from Federal lands and waters "Download full dataset" file, should be revised to include an explanation of the difference between "Federal" and "Mixed Exploratory" in the Category column as some of the Mixed Exploratory volumes are very large, especially for gas.  Also when the Data Portal says “Gas production on federal lands in the entire U.S.” and then shows state & county production volumes that include “Mixed Exploratory” volumes, that statement is technically incorrect as “Mixed Exploratory” production may not be taking place on Federal lands though down the road we will get a unitization or communitization agreement allocation.  Bottom-line is that the Feds rarely get 100% of the “Mixed Exploratory” volumes once the exploratory becomes a regular agreement as adjudicated by BLM.]</p> -->

    <h2>Data dictionary</h2>

    <p>The offshore dataset is organized by offshore planning areas. There are more offshore planning areas than are represented in our data. Those not represented had no production during the time period. For more information on offshore planning areas, including spatial boundaries, see the Bureau of Ocean Energy Management's (BOEM) <a href="http://www.boem.gov/Maps-and-GIS-Data/">maps and GIS data</a>.</p>

    <h3>FIPS Code</h3>

    <p>Federal Information Processing Standard (FIPS) code is a five-digit code which uniquely identifies counties and county equivalents in the U.S., certain U.S. possessions, and certain freely associated states. The first two digits are the FIPS state code and the last three are the county code within the state or possession.</p>

    <h3>Region</h3>

    <p>BOEM separates offshore area into four regions: Gulf of Mexico, Atlantic, Pacific, and Alaska. For more information on offshore regions, including spatial boundaries, see BOEM's <a href="http://www.boem.gov/Maps-and-GIS-Data/">maps and GIS data</a>.</p>

    <h3>Planning Area</h3>

    <p>Offshore regions are broken out into planning areas. For more information on offshore planning areas, including spatial boundaries, see BOEM's <a href="http://www.boem.gov/Maps-and-GIS-Data/">maps and GIS data</a>.</p>

    <h3>Product Groupings</h3>

    <ul class="list-bullet">
        <li>Borate Products include: Borax-Anhydrous, Borax-Decahydrate, Borax-Pentahydrate and Boric Acid</li>
        <li>Brine Products include: Brine Barrels (converted to ton equivalent) and Magnesium Chloride Brine</li>
        <li>Gold and Silver Products (oz) include: Gold, Gold Placer, and Silver</li>
        <li>Hardrock Products include: Limestone and Wavelite</li>
        <li>Other Coal Products include: Leonardite and Coal Waste (Sub-Econ)</li>
        <li>Gold Products (tons) includes: Gold Ore</li>
        <li>Other Potassium Products include: Manure Salts and Sylvite-Raw Ore</li>
        <li>Other Sodium Products include: Anhydrous Sodium Sulfate, Sodium Bisulfite, Sodium Decahydrate, Sodium Sesquicarbonate, Sulfide and Trona Ore</li>
    </ul>


  </article>

</div>
