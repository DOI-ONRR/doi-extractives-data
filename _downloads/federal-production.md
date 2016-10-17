---
title: Federal Production | Documentation
title_display: Federal Production by Location
layout: content
permalink: /downloads/federal-production/
breadcrumb:
  - title: Downloads
    permalink: /downloads/
---


> This dataset contains information on production on federal lands and waters. We have versions of these datasets available for both calendar and fiscal years 2006-2015.


<p class="downloads-download_links-intro">Download calendar year data:
  <ul class="downloads-download_links">
    <li><a href="{{site.baseurl}}/downloads/federal_production_CY06-15_2016-09-02.xlsx"><icon class="icon-cloud icon-padded"></icon>Full dataset (xlsx, 508 KB)</a></li>
  </ul>
</p>

<p class="downloads-download_links-intro">Download fiscal year data:
  <ul class="downloads-download_links">
    <li><a href="{{site.baseurl}}/downloads/federal_production_FY06-15_2016-09-02.xlsx"><icon class="icon-cloud icon-padded"></icon>Full dataset (xlsx, 2.9 MB)</a></li>
  </ul>
</p>

This dataset also includes county-level data about coal production on federal land.

If you are looking for additional information on Federal production data please visit the [ONRR Statistical Information Site](http://statistics.onrr.gov/). We also have [notes on this data](https://github.com/18F/doi-extractives-data/wiki/Data-Catalog#federal-production) from the web development team as they built the interactions on this site.


## Scope

This dataset includes natural resource production for U.S. federal lands and offshore areas. It does not include Indian lands, privately-owned lands, or U.S. state lands. The dataset currently include data tracked and managed by the Department of the Interior’s Office of Natural Resources Revenue (ONRR). The production data for Oil and Gas is collected on Form ONRR-4054 (Oil and Gas Operations Report). Coal and hardrock production is collected on Form ONRR-4430 (Solid Minerals Production and Royalty Report).

## Data Publication

The Federal production datasets are updated annually in July for the
most recent completed fiscal and calendar year.

### Why was some solids data withheld?

ONRR withheld some solids production information out of an abundance of caution to ensure that there were no violations of the Trade Secrets Act.


* "W" is displayed in the Production Volume column for those products that reveal proprietary data at the county level
* All "W" volumes are accounted for in separate line totals where state and county have been "Withheld" (columns C, D and E)

### Why aren’t national totals equal to the sum of all state totals?

In some cases, national totals include amounts that are {{ "withheld" | term }} at the state or county level.

### A note about “Mixed Exploratory” versus “Federal” categories of production

For the purposes of the visualizations on our site, we've aggregated production on two types of jurisdictions: “mixed exploratory” and “federal.” Federal production is production from federal lands and waters; this is straightforward. However, “mixed exploratory” is a temporary jurisdictional unit that is used until production is proven on that location. Then, BLM adjudicates a permanent unit with allocation schedules that may split that area between federal and other ownership. At that point, payors resubmit royalties based on the new unit allocations retroactive to the first production. This means that the federal government rarely gets 100% of “mixed exploratory” volumes. You can see these categories disaggregated in the federal production dataset, downloadable on this page.

## Data dictionary

The offshore dataset is organized by offshore planning areas. There are more offshore planning areas than are represented in our data. Those not represented had no production during the time period. For more information on offshore planning areas, including spatial boundaries, see the Bureau of Ocean Energy Management's (BOEM) [maps and GIS data](http://www.boem.gov/Maps-and-GIS-Data/).

### FIPS Code

Federal Information Processing Standard (FIPS) code is a five-digit code which uniquely identifies counties and county equivalents in the U.S., certain U.S. possessions, and certain freely associated states. The first two digits are the FIPS state code and the last three are the county code within the state or possession.

### Region

BOEM separates offshore area into four regions: Gulf of Mexico, Atlantic, Pacific, and Alaska. For more information on offshore regions, including spatial boundaries, see BOEM's [maps and GIS data](http://www.boem.gov/Maps-and-GIS-Data/).

### Planning Area

Offshore regions are broken out into planning areas. For more information on offshore planning areas, including spatial boundaries, see BOEM's [maps and GIS data](http://www.boem.gov/Maps-and-GIS-Data/).

### Product Groupings

* Borate Products include: Borax-Anhydrous, Borax-Decahydrate, Borax-Pentahydrate and Boric Acid
* Brine Products include: Brine Barrels (converted to ton equivalent) and Magnesium Chloride Brine
* Gold and Silver Products (oz) include: Gold, Gold Placer, and Silver
* Hardrock Products include: Limestone and Wavelite
* Other Coal Products include: Leonardite and Coal Waste (Sub-Econ)
* Gold Products (tons) includes: Gold Ore
* Other Potassium Products include: Manure Salts and Sylvite-Raw Ore
* Other Sodium Products include: Anhydrous Sodium Sulfate, Sodium Bisulfite, Sodium Decahydrate, Sodium Sesquicarbonate, Sulfide and Trona Ore

