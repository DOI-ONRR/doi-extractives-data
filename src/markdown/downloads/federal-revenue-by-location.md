---
title: Revenue by Year | Documentation
layout: downloads
permalink: /downloads/federal-revenue-by-location/
tag:
- Data
- Downloads
- Documentation
- Federal
- Revenue
- Location
- By location
---

<custom-link to="/downloads/" className="breadcrumb link-charlie">Downloads</custom-link> /
# Revenue by Year

<section class="explore-subpage container">
    <section>
      <div class="explore-subpage-tabs">
        <ul>
          <li class="explore-subpage-tab active">
            <a href="/downloads/federal-revenue-by-location/">Revenue by year</a>
          </li>
          <li class="explore-subpage-tab">
            <a href="/downloads/federal-revenue-by-month/">Revenue by month</a>
          </li>
          <li class="explore-subpage-tab">
            <a href="/downloads/federal-revenue-by-company/">Revenue by company</a>
          </li>
          <li class="explore-subpage-tab">
            <a href="/downloads/native-american-revenue/">Native American revenue</a>
          </li>
        </ul>
      </div>
    </section>
</section>

> We offer revenue data files for both calendar year and fiscal year. Calendar year revenue data is split into three separate files (onshore, offshore, and revenues not associated with a lease). Calendar year data is available for calendar years 2006–2017. Fiscal year data is available in a single file, for fiscal years 2006–2018. They are all <glossary-term>accounting year</glossary-term> data.

Download calendar year data:

<ul class="downloads-download_links list-unstyled">
  <li><download-link to="/downloads/federal_revenue_offshore_acct-year_CY06-17_2018_03_02.xlsx">Offshore dataset (xlsx, 484 KB)</download-link></li>
  <li><download-link to="/downloads/federal_revenue_onshore_acct-year_CY06-17_2018_03_02.xlsx">Onshore dataset (xlsx, 2.4 MB)</download-link></li>
  <li><download-link to="/downloads/federal_revenue_civil-penalties_other-rev_not-tied-to-lease_acct-year_CY06-17_2018_03_02.xlsx">Civil penalties and other revenues not associated with a lease (xlsx, 11 KB)</download-link></li>
</ul>

Download fiscal year data:

<ul class="downloads-download_links list-unstyled">
  <li><download-link to="/downloads/federal_revenue_acct-year_FY06-18_2018-12-13.xlsx">Onshore and offshore revenue dataset, FY 2006–2018 (xlsx, 2.0 MB)</download-link></li>
</ul>

We also have [notes on this data](https://github.com/onrr/doi-extractives-data/wiki/Data-Catalog#federal-revenue) from the web development team as they built the interactions on this site.

## Scope

These datasets include natural resource revenues for U.S. federal lands and offshore areas. It does not include Indian lands, privately-owned lands or U.S. state lands. The datasets currently includes data tracked and managed by the Department of the Interior’s Office of Natural Resources Revenue.

<h3 alt="Negative values">Why are some values negative?</h3>

Companies can adjust and correct their payments for up to seven years after a transaction takes place. If a company overpays their royalty, rent, or bonus, they are entitled to recoup their overpayment. If the overpayment and recoupment happen in different years, the recoupment will appear as a negative amount in the Office of Natural Resources Revenue's revenue summaries.

<h3 alt="Oil and gas values">Why is there a Gas value, an Oil value and an Oil & Gas value?</h3>

“Oil & Gas” is the commodity category used for offshore oil and gas rents and bonuses. At the time of lease sale, it isn’t known whether a lease will produce oil, gas or both oil and gas. After a lease starts producing a commodity (or commodities), the lease owner starts paying royalties. These can then be associated with either oil or gas. Hence, rent and bonus lines of data will be associated with an “Oil & Gas” commodity type, while royalty lines of data will be associated with either “Oil” or “Gas” commodity types.

<h3 alt="Revenue by location and by company"> Why is the calendar year <span style='font-style:italic'>revenue by location national total</span> slightly different than the <span style='font-style:italic'>revenue by company total</span>?</h3>

Our site has two federal revenue datasets. The one on this page is organized by location. [The federal revenue by company dataset](/downloads/federal-revenue-by-company/) is organized by the company that paid the revenue. However, the national revenue totals are slightly different (by about $90 million). This is because the revenue by location dataset excludes revenue from offshore rights-of-way because they don't map to an offshore planning area.

<h3 alt="Geothermal rate details">Note: Geothermal rate details</h3>

The fees and rates for revenue from geothermal resources on federal land depend on whether the land is leased competitively or noncompetitively.

Also, different fee rates apply to pre-2005 leases and to direct use facilities:

* For leases signed before the Energy Policy Act of 2005, the lease holder’s reasonable actual transmission and generation costs are deducted from gross proceeds from electricity sales, and the resulting value is multiplied by the lease royalty rate (usually 10%).
* For <glossary-term>direct use</glossary-term>, the lease holder pays the equivalent value of the least expensive, reasonable alternative energy source. Thermal energy utilized must be measured by lease holder at the inlet and outlet of facility. The resulting value is multiplied by the lease royalty rate of 10%.

The Bureau of Land Management has [more information about geothermal energy on federal lands](https://www.blm.gov/programs/energy-and-minerals/renewable-energy/geothermal-energy).

## Offshore data dictionary

The offshore dataset is organized by offshore planning areas. There are more offshore planning areas than are represented in our data. Those not represented had no revenues for the years in the data. For more information on offshore planning areas, including spatial boundaries, see the Bureau of Ocean Energy Management's [maps and GIS data](http://www.boem.gov/Maps-and-GIS-Data/).

### Fields and definitions

_Revenue Type_ Revenues from U.S. natural resources fall into one of several types:

* _Royalties_ A natural resource lease holder pays royalties after the lease starts producing a commodity in <glossary-term>paying quantities</glossary-term>. The amount is based on a percentage of the revenue from the commodity sold. The exact percentage is set in the original lease document that went along with the lease sale.
* _Bonus_ The amount paid by the highest successful bidder for a natural resource lease. The winning bid.
* _Other Revenues_ This category includes revenues that are not included in the royalty, rent, or bonus categories, such as minimum royalties, estimated royalties, settlement agreements, and interest.
* _Rents_ A natural resource lease might not produce anything in paying quantities for some time after it is sold. Until it does, periodic payments are made for the right to continue exploration and development of the land for future natural resource production. These payments are called rent.


_Commodity Type_ The Department of the Interior collects revenues on over 60 different products. The majority of revenues come from Oil & Gas, Coal, and Renewables (Geothermal and Wind), but you will find many other product categories in these datasets.


_Region_ The Bureau of Ocean Energy Management separates offshore area into four regions: Gulf of Mexico, Atlantic, Pacific and Alaska. For more information on offshore regions, including spatial boundaries, see the Bureau of Ocean Energy Management's [maps and GIS data](http://www.boem.gov/Maps-and-GIS-Data/).

_Planning Area_ Offshore regions are broken out into planning areas. For more information on offshore planning areas, including spatial boundaries, see the Bureau of Ocean Energy Management's [maps and GIS data](http://www.boem.gov/Maps-and-GIS-Data/).

_Revenue_ Total revenue.


## Onshore data dictionary

The onshore dataset is organized by state. There are more states than are listed in this dataset. Those states without natural resource revenues in the data are not included.

### Fields and definitions

_Row Labels_ This field contains either a state name, or a commodity name. The state name always comes first with its commodity breakdowns below it.

_Sum of Royalty/Revenue_ This field provides the total royalty or revenue for the listed state (total) or commodity in that state.

## Advanced offshore and onshore information

Commodities can be further broken down into products. These are the products that could fall into the commodity categories found in these datasets.

_Coal_ Coal (ton), Coal-Bituminous-Raw (ton).

_Gas_ Coal Bed Methane (mcf), Flash Gas (mcf), Fuel Gas (mcf), Gas Hydrate (mcf), Gas Lost - Flared or Vented (mcf), Nitrogen (mcf), Processed (Residue) Gas (mcf), Unprocessed (Wet) Gas (mcf), NGL (Gas Plant Products).

_Oil_ Asphaltic Crude (bbl), Black Wax Crude (bbl), Condensate (bbl), Drip or Scrubber Condensate (bbl),  Drip or Scrubber Condensate (bbl), Fuel Oil (bbl), Inlet Scrubber (bbl), Oil (bbl), Oil Lost (bbl), Other Liquid Hydrocarbons (bbl), Sour Crude (bbl), Sweet Crude (bbl), Yellow Wax Crude (bbl).

_Geothermal_ Geothermal - Direct Utilization, Hundreds of Gallons (cgal), Geothermal - Direct Utilization, Millions of BTUs (mmbtu), Geothermal - Electrical Generation, Kilowatt Hours (kwh), Geothermal - Electrical Generation, Thousands of Pounds (klb), Geothermal - sulfur (lton).

_Wind_ Wind.

_Other Commodities_ Anhydrous Sodium Sulfate (ton), Borax-Decahydrate (ton), Borax-Pentahydrate (ton), Boric Acid (ton), Carbon Dioxide Gas (CO2) (mcf), Cinders (ton), Clay (ton), Copper Concentrate (ton), Gilsonite (ton), Gold (ton), Gypsum (ton), Helium (bbl), Langbeinite (ton), Lead Concentrate (ton), Leonardite (ton), Limestone (ton), Magnesium Chloride Brine (ton), Manure Salts (ton), Muriate Of Potash-Granular (ton), Muriate Of Potash-Standard (ton), Other (ton), Phosphate Raw Ore (ton), Potash (ton), Purge Liquor (ton), Quartz Crystal (lb), Salt (ton), Sand/Gravel (ton), Sand/Gravel-Cubic Yards (cyd), Silver (oz), Soda Ash (ton), Sodium Bi-Carbonate (ton), Sodium Bisulfite (ton), Sodium Sesquicarbonate (ton), Sulfide (ton), Sulfur (lton), Sylvite-Raw Ore (ton), Trona Ore (ton), Zinc Concentrate (ton).

## Contact us
