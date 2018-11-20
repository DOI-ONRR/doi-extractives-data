---
title: Production by Month | Documentation
title_display: Production by Month
layout: content
permalink: /downloads/federal-production-by-month/
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
description: This dataset contains monthly production volumunes on federal lands and waters and Native American lands. We have monthly production data from January 2008 through the most recently available month, which is usually 3-4 months prior to the current month.
tag:
- Data
- Downloads
- Documentation
- Native American
- Indian
- Federal
- Production
---

{% include production-nav.html %}

> {{ page.description }}

<p class="downloads-download_links-intro">Download production data by month:
  <ul class="downloads-download_links list-unstyled">
    <li><a href="{{site.baseurl}}/downloads/monthly_production_11-2018.xlsx">{% include svg/icon-download.svg %}Production by month, 1/2008–7/2018 (xlsx, 47 KB)</a></li>
  </ul>
</p>

## Scope

This dataset includes natural resource production for U.S. federal lands and offshore areas and Native American lands. It does not include privately owned lands or U.S. state lands. The dataset includes data tracked and managed by the Department of the Interior’s Office of Natural Resources Revenue (ONRR). Monthly production data is available for coal, oil, and gas. The production data for oil and gas is collected on Form ONRR-4054 (Oil and Gas Operations Report). Coal production is collected on Form ONRR-4430 (Solid Minerals Production and Royalty Report).

## Data publication

We update this production dataset monthly, though data for the most recent month isn't available for 3-4 months. 

<!-- continue here -->

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
