---
title: Federal Production | Documentation
layout: downloads
permalink: /downloads/federal-production/
tag:
- Data
- Downloads
- Documentation
- Federal
- Production
---

<custom-link to="/downloads/" className="breadcrumb link-charlie">Downloads</custom-link> /
# Production by Year

> This dataset contains information on natural resource production volumes on federal lands and waters.

<p class="downloads-download_links-intro">Download calendar year data (2003-2018):
  <ul class="downloads-download_links list-unstyled">
    <li><excel-link to="/downloads/production/calendar_year_production.xlsx">Calendar year production (Excel, 631 KB)</excel-link></li>
    <li><csv-link to="/downloads/csv/production/calendar_year_production.csv">Calendar year production (csv, 835 KB)</csv-link></li>
  </ul>
</p>

<p class="downloads-download_links-intro">Download fiscal year data (2009-2018):
  <ul class="downloads-download_links list-unstyled">
    <li><excel-link to="/downloads/production/fiscal_year_production.xlsx">Fiscal year production (Excel, 409 KB)</excel-link></li>
    <li><csv-link to="/downloads/csv/production/fiscal_year_production.csv">Fiscal year production (csv, 528 KB)</csv-link></li>
  </ul>
</p>

We have [notes on this data](https://github.com/onrr/doi-extractives-data/wiki/Data-Catalog#federal-production) from the web development team as they built the interactions on this site.

## Scope

This dataset includes natural resource production for U.S. federal lands and offshore areas. It does not include Native American lands, privately owned lands, or U.S. state lands. The dataset currently include data tracked and managed by the Department of the Interior’s Office of Natural Resources Revenue (ONRR). The production data for Oil and Gas is collected on Form ONRR-4054 (Oil and Gas Operations Report). Coal and hardrock production is collected on Form ONRR-4430 (Solid Minerals Production and Royalty Report).

## About the data

<h3 alt="Withheld data">Why was some solids data withheld?</h3>

ONRR <glossary-term>withheld</glossary-term> some solids production information out of an abundance of caution to ensure that there were no violations of the Trade Secrets Act.

* "W" is displayed in the Production Volume column for those products that reveal proprietary data at the county level.
* All "W" volumes are accounted for in separate line totals where state and county have been "Withheld" (columns C, D and E).

<h3 alt="National and state totals">Why aren’t national totals equal to the sum of all state totals?</h3>

In some cases, national totals include amounts that are withheld at the state or county level.

<h3 alt="Geothermal energy">Why is geothermal energy listed so many times?</h3>

We can only compare production that is reported in the same unit. The standard unit of measurement for geothermal energy in the federal production dataset is kilowatt hours, but there are a few counties that report it differently. We have separate charts for each of these counties, because they report in nonstandard units:

* Dona Ana County, NM reports direct use of geothermal resources in _million gallons_
* Churchill County, NV reports direct use of geothermal resources in _hundred gallons_
* Lassen County, CA reports direct use of geothermal resources in _million BTUs_
* Lassen County, CA reports geothermal energy generation as _other_ (no unit)
* Lake County, CA; Sonoma County, CA; and Beaver County, UT report geothermal energy generation in _thousand pounds_
* Inyo County, CA reports sulfur from geothermal resources as _sulfur_ (no unit)

<h3 alt="Mixed exploratory and federal categories">A note about “Mixed Exploratory” versus “Federal” categories of production</h3>

To build our data visualizations, we've aggregated production from two types of jurisdictions: “federal” and “mixed exploratory.”

* Federal production is production from federal lands and waters.
* "Mixed exploratory” is a temporary jurisdictional unit that is used until production is proven on that location. BLM then creates a permanent unit with allocation schedules that may split that area between federal and other ownership. Payors then resubmit royalties based on the new unit  allocations. These royalties are retroactive to the first production.

The federal government rarely gets 100% of “mixed exploratory” volumes. You can see these categories disaggregated in the federal production dataset, downloadable on this page.

## Data dictionary

The offshore dataset is organized by offshore planning areas. There are more offshore planning areas than are represented in our data. Those not represented had no production during the time period. For more information on offshore planning areas, including spatial boundaries, see the Bureau of Ocean Energy Management's (BOEM) [maps and GIS data](http://www.boem.gov/Maps-and-GIS-Data/).

### FIPS code

Federal Information Processing Standard (FIPS) code is a five-digit code which uniquely identifies counties and county equivalents in the U.S., certain U.S. possessions, and certain freely associated states. The first two digits are the FIPS state code and the last three are the county code within the state or possession.

### Region

BOEM separates offshore areas into four regions: Gulf of Mexico, Atlantic, Pacific, and Alaska. For more information on offshore regions, including spatial boundaries, see BOEM's [maps and GIS data](http://www.boem.gov/Maps-and-GIS-Data/).

### Planning area

Offshore regions are broken out into planning areas. For more information on offshore planning areas, including spatial boundaries, see BOEM's [maps and GIS data](http://www.boem.gov/Maps-and-GIS-Data/).

### Product groupings

* Borate Products include: Borax-Anhydrous, Borax-Decahydrate, Borax-Pentahydrate and Boric Acid
* Brine Products include: Brine Barrels (converted to ton equivalent) and Magnesium Chloride Brine
* Gold and Silver Products (oz) include: Gold, Gold Placer, and Silver
* Hardrock Products include: Limestone and Wavelite
* Other Coal Products include: Leonardite and Coal Waste (Sub-Econ)
* Gold Products (tons) includes: Gold Ore
* Other Potassium Products include: Manure Salts and Sylvite-Raw Ore
* Other Sodium Products include: Anhydrous Sodium Sulfate, Sodium Bisulfite, Sodium Decahydrate, Sodium Sesquicarbonate, Sulfide and Trona Ore

## Contact us
