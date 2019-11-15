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
- Indian
- Native American
---

<custom-link to="/downloads/" className="breadcrumb link-charlie">Downloads</custom-link> /
# Production by Year

> This dataset contains information on natural resource production volumes on Native American lands and federal lands and waters. We only provide production volumes for Native American lands by fiscal year.

<p class="downloads-download_links-intro">Download calendar year data (2003-2018):
  <ul class="downloads-download_links list-unstyled">
    <li><excel-link to="/downloads/production/calendar_year_production.xlsx">Calendar year production (Excel, 631 KB)</excel-link></li>
    <li><csv-link to="/downloads/csv/production/calendar_year_production.csv">Calendar year production (csv, 835 KB)</csv-link></li>
  </ul>
</p>

<p class="downloads-download_links-intro">Download fiscal year data (2003-2018):
  <ul class="downloads-download_links list-unstyled">
    <li><excel-link to="/downloads/production/fiscal_year_production.xlsx">Fiscal year production (Excel, 409 KB)</excel-link></li>
    <li><csv-link to="/downloads/csv/production/fiscal_year_production.csv">Fiscal year production (csv, 528 KB)</csv-link></li>
  </ul>
</p>

## Scope

The calendar year dataset includes natural resource production for U.S. federal lands and offshore areas. The fiscal year dataset also includes Native American lands (2009-2018). Neither dataset includes privately owned lands or state-owned lands.

Federal production data is available by location, but Native American data is only available at the national level to protect private and personally identifiable information.

The dataset currently include data tracked and managed by the Department of the Interior’s Office of Natural Resources Revenue (ONRR). The production data for Oil and Gas is collected on Form ONRR-4054 (Oil and Gas Operations Report). Coal and hardrock production is collected on Form ONRR-4430 (Solid Minerals Production and Royalty Report).

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
* “Mixed exploratory” is a temporary jurisdictional unit that is used until production is proven on that location. BLM then creates a permanent unit with allocation schedules that may split that area between federal and other ownership. Payors then resubmit royalties based on the new unit allocations. These royalties are retroactive to the first production.

The federal government rarely gets 100% of “mixed exploratory” volumes. You can see these categories disaggregated in the federal production dataset, downloadable on this page.

## Data dictionary

### Fields and definitions

_Year_
* _Calendar Year_ is the period between January 1 and December 31 for a given year.
* _Fiscal year_ The year the production occurred. The federal fiscal year runs from October 1 of the prior year through September 30 of the year being described. For example, Fiscal Year 2018 is between October 1, 2017, and September 30, 2018.

_Land Category_
  * _Onshore_ Situated or occurring on land.
  * _Offshore_ Submerged lands located farther than three miles off a state’s coastline, or three marine leagues into the Gulf of Mexico off of Texas and Western Florida.

_Land Class_
  * _Federal_ Federal lands are owned by or under the jurisdiction of the federal government, including: Public domain lands, acquired lands, military acquired lands, and Outer Continental Shelf.
  * _Native American_ includes Tribal lands held in trust by the federal government for a tribe’s use, and allotments held in trust by the federal government for individual Native American use.
  * _Mixed Exploratory_ is a temporary jurisdictional unit that is used until production is proven on that location (see above).

_State_ The state where the production occurred.

_County_ The county where the production occurred.

_FIPS Code_ Federal Information Processing Standard (FIPS) code is a five-digit code which uniquely identifies counties and county equivalents in the U.S., certain U.S. possessions, and certain freely associated states. The first two digits are the FIPS state code and the last three are the county code within the state or possession.

_Offshore Region_ BOEM separates offshore areas into four regions: Gulf of Mexico, Atlantic, Pacific, and Alaska. For more information on offshore regions, including spatial boundaries, see BOEM's [maps and GIS data](http://www.boem.gov/Maps-and-GIS-Data/).

_Offshore Planning Area_ Offshore regions are broken out into planning areas. There are more offshore planning areas than are represented in our data. Those not represented had no production during the time period. For more information on offshore planning areas, including spatial boundaries, see the Bureau of Ocean Energy Management's (BOEM) [maps and GIS data](http://www.boem.gov/Maps-and-GIS-Data/).

_Product_ Products are listed individually but may also fall into like categories.
  * _Anhydrous Sodium Sulfate_ (tons)
  * _Borate Products_ (tons) include Borax-Anhydrous, Borax-Decahydrate, Borax-Pentahydrate, and Boric Acid
  * _Brine Products_ include Brine Barrels (converted to tons equivalent) and Magnesium Chloride Brine
  * _Calcium Chloride_ (lbs)
  * _Carbon Dioxide_ (tons)
  * _Cinders_ (tons)
  * _Clay_ (tons)
  * _Coal_ (tons)
  * _Coal-Bituminous-Raw_ (tons)
  * _Other Coal Products_ (tons) include Leonardite and Coal Waste (Sub-Econ)
  * _Copper_ (lbs)
  * _Copper Concentrate_ (tons)
  * _Drip or Scrubber Condensate_
  * _Gas_ (mcf)
  * _Geothermal - Direct Utilization_, (gal hundreds)
  * _Geothermal - Direct Utilization_, (MMBtu)
  * _Geothermal - Electrical Generation_, (kWh)
  * _Geothermal - Electrical Generation_, (lbs, thousand)
  * _Geothermal - Electrical Generation_, (Other)
  * _Geothermal - sulfur_
  * _Gilsonite_ (tons)
  * _Gold and Silver Products_ (ozs) include: Gold, Gold Placer, and Silver
  * _Gold and Silver Products_ (tons) include: Gold Ore, Gold and Silver
  * _Gypsum_ (tons)
  * _Hardrock Products_ (tons) include: Limestone (tons) and Wavellite (spcmns)
  * _Humate_ (tons)
  * _Langbeinite_ (tons)
  * _Lead Concentrate_ (tons)
  * _Leonardite_ (tons)
  * _Molybdenum Concentrate_ (tons)
  * _Muriate Of Potash-Granular_ (tons)
  * _Muriate Of Potash-Standard_ (tons)
  * _Oil_ (bbls)
  * _Phosphate Raw Ore_ (tons)
  * _Potash_ (tons)
  * _Potassium Products_ (tons) include Manure Salts and Sylvite-Raw Ore
  * _Potassium Sulphate-Standard_ (tons)
  * _Purge Liquor_ (tons)
  * _Quartz Crystal_ (tickets/lbs)
  * _Salt_ (tons)
  * _Sand/Gravel_ (tons)
  * _Sand/Gravel-Cubic Yards_ (cyds)
  * _Soda Ash_ (tons)
  * _Sodium Bi-Carbonate_ (tons)
  * _Sodium Products_ (tons) include Anhydrous Sodium Sulfate, Sodium Bisulfite, Sodium Decahydrate, Sodium Sesquicarbonate, Sulfide, and Trona Ore
  * _Zinc Concentrate_ (tons)

_Volume_ Shows the production volume (amount produced). The units for volume are shown in the preceding field (Product).

## Contact us
