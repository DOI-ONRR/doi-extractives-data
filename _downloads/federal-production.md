---
title: Federal Production | Documentation
title_display: Federal Production by Location
layout: content
permalink: /downloads/federal-production/
nav_items:
  - name: introduction
    title: Top
  - name: scope
    title: Scope
  - name: data-publication
    title: Data publication
    subnav_items:
      - name: why-was-some-solids-data-withheld
        title: Withheld data
      - name: why-arent-national-totals-equal-to-the-sum-of-all-state-totals
        title: National and state totals
      - name: why-is-geothermal-energy-listed-so-many-times
        title: Geothermal data
      - name: a-note-about-mixed-exploratory-versus-federal-categories-of-production
        title: Mixed exploratory and federal categories
  - name: data-dictionary
    title: Data dictionary
    subnav_items:
      - name: fips-code
        title: FIPS code
      - name: region
        title: Region
      - name: planning-area
        title: Planning areas
      - name: product-groupings
        title: Product groupings
  - name: contact-us
    title: Contact us
selector: list
breadcrumb:
  - title: Downloads
    permalink: /downloads/
description: This dataset contains information on production on federal lands and waters. We have versions of these datasets available for calendar years 2008-2017 and for fiscal years 2008-2017.
tag:
- Data
- Downloads
- Documentation
- Federal
- Production
---


> {{ page.description }}


<p class="downloads-download_links-intro">Download calendar year data:
  <ul class="downloads-download_links list-unstyled">
    <li><a href="{{site.baseurl}}/downloads/federal_production_CY08-17.xlsx">{% include svg/icon-download.svg %}Full dataset (xlsx, 391 KB)</a></li>
  </ul>
</p>

<p class="downloads-download_links-intro">Download fiscal year data:
  <ul class="downloads-download_links list-unstyled">
    <li><a href="{{site.baseurl}}/downloads/federal_production_FY2008-2017_2018-06-15.xlsx">{% include svg/icon-download.svg %}Full dataset (xlsx, 387 KB)</a></li>
  </ul>
</p>

This dataset also includes county-level data about coal production on federal land.

We have [notes on this data](https://github.com/onrr/doi-extractives-data/wiki/Data-Catalog#federal-production) from the web development team as they built the interactions on this site.

## Scope

This dataset includes natural resource production for U.S. federal lands and offshore areas. It does not include Indian lands, privately owned lands, or U.S. state lands. The dataset currently include data tracked and managed by the Department of the Interior’s Office of Natural Resources Revenue (ONRR). The production data for Oil and Gas is collected on Form ONRR-4054 (Oil and Gas Operations Report). Coal and hardrock production is collected on Form ONRR-4430 (Solid Minerals Production and Royalty Report).

## Data publication

The federal production datasets are updated annually in July for the most recent completed fiscal and calendar year.

### Why was some solids data withheld?

ONRR {{ "withheld" | term }} some solids production information out of an abundance of caution to ensure that there were no violations of the Trade Secrets Act.

* "W" is displayed in the Production Volume column for those products that reveal proprietary data at the county level.
* All "W" volumes are accounted for in separate line totals where state and county have been "Withheld" (columns C, D and E).

### Why aren’t national totals equal to the sum of all state totals?

In some cases, national totals include amounts that are withheld at the state or county level.

### Why is geothermal energy listed so many times?

We can only compare production that is reported in the same unit. The standard unit of measurement for geothermal energy in the federal production dataset is kilowatt hours, but there are a few counties that report it differently. We have separate charts for each of these counties, because they report in nonstandard units:

* Dona Ana County, NM reports direct use of geothermal resources in _million gallons_
* Churchill County, NV reports direct use of geothermal resources in _hundred gallons_
* Lassen County, CA reports direct use of geothermal resources in _million BTUs_
* Lassen County, CA reports geothermal energy generation as _other_ (no unit)
* Lake County, CA; Sonoma County, CA; and Beaver County, UT report geothermal energy generation in _thousand pounds_
* Inyo County, CA reports sulfur from geothermal resources as _sulfur_ (no unit)

### A note about “Mixed Exploratory” versus “Federal” categories of production

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

{% include contact.html %}
