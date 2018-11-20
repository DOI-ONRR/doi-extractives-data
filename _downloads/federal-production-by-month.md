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
description: This dataset contains monthly production volumes on federal lands and waters and Native American lands. We have monthly production data from January 2008 through the most recently available month, which is usually 3-4 months prior to the current month.
tag:
- Data
- Downloads
- Documentation
- Native American
- Indian
- Federal
- Production
- coal
- oil
- gas
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

We update this production data every month, but final production numbers aren't available for 3-4 months. For example, the most recent production data for a file updated in November will be from July or August.

## Data dictionary

Monthly production has the following fields:

- Production Date
- Land Category
- Onshore/Offshore
- Commodity
- Volume

### Fields and definitions

_Production Date_ The last day of the month represents the data for that entire month. For example, 1/31/2008 represents the data for the month of January 2008.

_Land Category_ The ownership of the land or waters where the production came from. Ownership is either federal or Native American (shown as "Indian" in the data).

_Onshore/Offshore_ Shows whether the production was onshore (federal or Native American lands) or offshore (federal waters, such as the Gulf of Mexico).

_Commodity_ We have monthly data for oil, gas, and coal, since these are high-volume commodities that result in the most revenue. This field includes the units for each commodity in parentheses.

- _Oil Prod Vol (bbl)_ Oil production is measured in barrels (bbl)
- _Gas Prod Vol (Mcf)_ Gas (natural gas) is measured in thousand cubic feet (mcf)
- _Coal Prod Vol (ton)_ Coal is measured in tons. A ton is 2000 pounds.

_Volume_ Shows the production volume (amount produced). The units for volume are shown in the preceding field (Commodity).

## Contact us

{% include contact.html %}
