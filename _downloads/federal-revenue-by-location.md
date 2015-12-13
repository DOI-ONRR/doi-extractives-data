---
title: Federal Revenue by Location | Documentation
layout: default
permalink: /downloads/federal-revenue-by-location/
---

<div class="container-outer container-padded">

  <article class="container-left-7 downloads-docs">

    <div>
      <a class="breadcrumb" href="{{ site.baseurl }}/downloads/">Downloads</a>
      /
    </div>
    <h1>Federal Revenue by Location</h1>

    <p class="case_studies_intro-para">There are two types of federal-revenue-by-location datasets available on this site. One includes offshore data, and the other includes onshore data. We have versions of these datasets available for both calendar year and fiscal year 2013, and they are both accounting year data. </p>

    <p class="downloads-download_links-intro">Download calendar year data:
      <ul class="downloads-download_links">
        <li><a href="{{site.baseurl}}/downloads/federal_revenue_offshore_acct-year_CY04-13_2015-11-20.xlsx"><icon class="icon-cloud icon-padded"></icon>
         Offshore dataset (xlsx, 321 KB)
       </a></li>
       <li><a href="{{site.baseurl}}/downloads/federal_revenue_onshore_acct-year_CY04-13_2015-11-20.xlsx"><icon class="icon-cloud icon-padded"></icon>
         Onshore dataset (xlsx, 1.1 MB)
       </a></li>
      </ul>
    </p>

    <p class="downloads-download_links-intro">Download fiscal year data:
      <ul class="downloads-download_links">
        <li><a href="{{site.baseurl}}/downloads/federal_revenue_offshore_acct-year_FY04-14_2015-11-20.xlsx"><icon class="icon-cloud icon-padded"></icon>
          Offshore dataset (xlsx, 348 KB)
        </a></li>
       <li><a href="{{site.baseurl}}/downloads/federal_revenue_onshore_acct-year_FY04-14_2015-11-20.xlsx"><icon class="icon-cloud icon-padded"></icon>
         Onshore dataset (xlsx, 1.1 MB)
       </a></li>
      </ul>
    </p>

    <h2 class="h3">Scope</h2>

    <p>These datasets include natural resource revenues for U.S. Federal lands and offshore areas. It does not include Indian lands, privately-owned lands or U.S. state lands. The datasets currently include data tracked and managed by the Department of the Interior’s Office of Natural Resource Revenues.</p>

    <h2 class="h3">Why are some values negative?</h2>

    <p>Companies can adjust and correct their payments for up to seven years after a transaction takes place. If a company overpays their royalty, rent, or bonus, they are entitled to recoup their overpayment. If the overpayment and recoupment happen in different years, the recoupment will appear as a negative amount in the Office of Natural Resource Revenue's revenue summaries.</p>

    <h2 class="h3">Why is there a Gas value, an Oil value and an Oil & Gas value?</h2>

    <p>“Oil & Gas” is the commodity category used for offshore oil and gas rents and bonuses. At the time of lease sale, it isn’t known whether a lease will produce oil, gas or both oil and gas. After a lease starts producing a commodity (or commodities), the lease owner starts paying royalties. These can then be associated with either oil or gas. Hence, rent and bonus lines of data will be associated with an “Oil & Gas” commodity type, while royalty lines of data will be associated with either “Oil” or “Gas” commodity types.</p>

    <h2 class="h3">Why is the calendar year revenue by location national total slightly different than the revenue by company total?</h2>

    <p>Our site has two federal revenue datasets. The one on this page is organized by location. <a href="{{ site.baseurl }}/downloads/federal-revenue-by-company/">This one</a> is organized by the company that paid the revenue. However, the national revenue totals are slightly different (by about 90 million dollars). This is because the the company revenues dataset excludes revenue from offshore right-of-ways because they don't map to an offshore planning area.</p>


    <h2>Offshore data dictionary</h2>

    <p>The offshore dataset is organized by offshore planning areas. There are more offshore planning areas than are represented in our data. Those not represented had no revenues for calendar year 2013. For a more information on offshore planning areas, including spatial boundaries, see the Bureau of Ocean Energy Management's <a href="http://www.boem.gov/Maps-and-GIS-Data/">maps and GIS data</a>.</p>

    <h3>Fields and definitions</h3>

    <p><span>Revenue Type.</span> Revenues from U.S. natural resources fall into one of several types:
      <ul class="list-bullet">
        <li><span>Royalties. </span>
          A natural resource lease owner pays royalties after the lease starts producing a commodity in paying quantities. The amount is based on a percentage of the revenue from the commodity sold. The exact percentage is set in the original lease document that went along with the lease sale.</li>
        <li><span>Bonus. </span>
          The amount paid by the highest successful bidder for a natural resource lease. The winning bid.</li>
        <li><span>Other revenues. </span>
          This category includes revenues that are not included in the royalty, rent, or bonus categories, such as minimum royalties, estimated royalties, settlement agreements, and interest.</li>
        <li><span>Rents. </span>
          A natural resource lease might not produce anything in paying quantities for some time after it is sold. Until it does, periodic payments are made for the right to continue exploration and development of the land for future natural resource production. These payments are called rent.</li>
      </ul>
    </p>

    <p><span>Commodity Type. </span>The Department of the Interior collects revenues on over 60 different products. The majority of revenues come from Oil & Gas, Coal and Renewables (Geothermal and Wind), but you will find many other product categories in these datasets.
    </p>

    <p><span>Region. </span>The Bureau of Ocean Energy Management separates offshore area into four regions: Gulf of Mexico, Atlantic, Pacific and Alaska. For a more information on offshore regions, including spatial boundaries, see the Bureau of Ocean Energy Management's <a href="http://www.boem.gov/Maps-and-GIS-Data/">maps and GIS data</a>.</p>

    <p><span>Planning Area. </span>Offshore regions are broken out into planning areas. For a more information on offshore planning areas, including spatial boundaries, see the Bureau of Ocean Energy Management's <a href="http://www.boem.gov/Maps-and-GIS-Data/">maps and GIS data</a>.</p>

    <p><span>Revenue. </span>Total revenue.</p>


    <h2>Onshore data dictionary</h2>

    <p>The onshore dataset is organized by state. There are more states than are listed in this dataset. Those states without natural resource revenues in calendar year 2013 are not included.</p>

    <h3>Fields and definitions</h3>

    <p><span>Row Labels. </span>This field contains either a state name, or a commodity name. The state name always comes first with its commodity breakdowns below it.</p>

    <p><span>Sum of Royalty/Revenue. </span>This field provides the total royalty or revenue for the listed state (total) or commodity in that state.</p>

    <h2>Advanced offshore and onshore information</h2>

    <p>Commodities can be further broken down into products. These are the products that could fall into the commodity categories found in these datasets.</p>

    <p><span>Coal.</span> Coal (ton), Coal-Bituminous-Raw (ton).</p>

    <p><span>Gas.</span> Coal Bed Methane (mcf), Flash Gas (mcf), Fuel Gas (mcf), Gas Hydrate (mcf), Gas Lost - Flared or Vented (mcf), Nitrogen (mcf), Processed (Residue) Gas (mcf), Unprocessed (Wet) Gas (mcf), NGL (Gas Plant Products).</p>

    <p><span>Oil.</span> Asphaltic Crude (bbl), Black Wax Crude (bbl), Condensate (bbl), Drip or Scrubber Condensate (bbl),  Drip or Scrubber Condensate (bbl), Fuel Oil (bbl), Inlet Scrubber (bbl), Oil (bbl), Oil Lost (bbl), Other Liquid Hydrocarbons (bbl), Sour Crude (bbl), Sweet Crude (bbl), Yellow Wax Crude (bbl).</p>

    <p><span>Geothermal.</span> Geothermal - Direct Utilization, Hundreds of Gallons (cgal), Geothermal - Direct Utilization, Millions of BTUs (mmbtu), Geothermal - Electrical Generation, Kilowatt Hours (kwh), Geothermal - Electrical Generation, Thousands of Pounds (klb), Geothermal - sulfur (lton).</p>

    <p><span>Wind.</span> Wind.</p>

    <p><span>Other Commodities.</span> Anhydrous Sodium Sulfate (ton), Borax-Decahydrate (ton), Borax-Pentahydrate (ton), Boric Acid (ton), Carbon Dioxide Gas (CO2) (mcf), Cinders (ton), Clay (ton), Copper Concentrate (ton), Gilsonite (ton), Gold (ton), Gypsum (ton), Helium (bbl), Langbeinite (ton), Lead Concentrate (ton), Leonardite (ton), Limestone (ton), Magnesium Chloride Brine (ton), Manure Salts (ton), Muriate Of Potash-Granular (ton), Muriate Of Potash-Standard (ton), Other (ton), Phosphate Raw Ore (ton), Potash (ton), Purge Liquor (ton), Quartz Crystal (lb), Salt (ton), Sand/Gravel (ton), Sand/Gravel-Cubic Yards (cyd), Silver (oz), Soda Ash (ton), Sodium Bi-Carbonate (ton), Sodium Bisulfite (ton), Sodium Sesquicarbonate (ton), Sulfide (ton), Sulfur (lton), Sylvite-Raw Ore (ton), Trona Ore (ton), Zinc Concentrate (ton).</p>

  </article>

</div>
