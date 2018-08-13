---
title: Disbursements | Documentation
title_display: Disbursements
layout: content
permalink: /downloads/disbursements/
nav_items:
  - name: introduction
    title: Top
  - name: scope
    title: Scope
  - name: data-publication
    title: Data publication
  - name: data-dictionary
    title: Data dictionary
    subnav_items:
      - name: onshore
        title: Onshore
      - name: offshore
        title: Offshore
  - name: archive
    title: Archive
  - name: contact-us
    title: Contact us
selector: list
breadcrumb:
  - title: Downloads
    permalink: /downloads/
description: "The amount of money earned from extraction of natural resources on federal lands that is disbursed to various legislated funds. Our fund overview dataset is from the Office of Natural Resources Revenue, which is part of the Department of the Interior. In addition, we have more detailed datasets on two of the funds: Land and Water Conservation Fund (LWCF) and National Historic Preservation Act (NHPA)."
tag:
- Data
- Downloads
- Documentation
- Disbursements
---

> The amount of money earned from extraction of natural resources on federal lands that is disbursed to various legislated funds. Our fund overview dataset is from the [Office of Natural Resources Revenue](http://www.onrr.gov/), which is part of the Department of the Interior. In addition, we have more detailed datasets on two of the funds: [Land and Water Conservation Fund](https://www.doi.gov/lwcf) (LWCF) and [National Historic Preservation Act](https://www.nps.gov/subjects/historicpreservation/national-historic-preservation-act.htm) (NHPA).

Download fiscal year data:

<ul class="downloads-download_links list-unstyled">
  <li><a href="{{site.baseurl}}/downloads/disbursements_FY2014-2017.xlsx">{% include svg/icon-download.svg %}Funds data by state and county (xlsx, 32 KB)</a></li>
  <li><a href="{{site.baseurl}}/downloads/disbursements_FY2003-2017_by_type.xlsx">{% include svg/icon-download.svg %}Funds data by type (xlsx, 75 KB)</a></li>
  <li><a href="{{site.baseurl}}/downloads/LWCF_incl-documentation_FY2011-2015_2016-09-15.xlsx">{% include svg/icon-download.svg %}LWCF dataset, includes docs (xlsx, 870 KB)</a></li>
  <li><a href="{{site.baseurl}}/downloads/historic_preservation_fund_FY2011-2016_2017-05-26.xlsx">{% include svg/icon-download.svg %}NHPA dataset (xlsx, 19 KB)</a></li>
</ul>

The documentation that follows is for the funds overview dataset. LWCF documentation is included in its download file, and we're working on collecting documentation for the NHPA dataset.

We also have [notes on this data](https://github.com/onrr/doi-extractives-data/wiki/Data-Catalog#disbursements) from the web development team as they built the interactions on this site.

## Scope

This dataset includes natural resource disbursements for U.S. federal lands, federal offshore areas, and Indian lands. It does not include privately owned lands or U.S. state lands. The dataset is tracked and managed by the Department of the Interior’s Office of Natural Resources Revenue. It contains disbursement information to funds for fiscal years 2014-2017. Disbursements of revenue from extractive activities on U.S. federal lands occur monthly; this dataset is a sum of those disbursements by fiscal year.

## Data publication

The disbursement dataset is updated in December after the end of the federal government fiscal year.

## Data dictionary

Laws treat revenues from offshore natural resources and onshore natural resources differently. There are set percentages and amounts from each that go certain places every year.

### Onshore

_U.S. Treasury_ Funds disbursed to the Treasury go to the General Fund, which is the federal government’s basic operating fund. The General Fund pays for roughly two-thirds of all federal expenditures, including the U.S. military, national parks, and schools.

_States_ Funds disbursed to states fall under the jurisdiction of each state, and each state determines how the funds will be used.

_Reclamation_ Established by Congress in 1902 to pay for Bureau of Reclamation projects, this fund supports the establishment of critical infrastructure projects like dams and power plants.

_American Indian Tribes_ ONRR disburses 100% of revenue collected from resource extraction on American Indian lands back to the Indian tribes and individual Indian landowners.

_Other_ Certain onshore funds are directed back to the federal agencies that administer these lands (e.g., BLM, U.S. Fish and Wildlife Service, and U.S. Forest Service) to help cover the agencies’ operational costs. The Ultra-Deepwater Research Program and the Mescal Settlement Agreement also receive $50 million each.

### Offshore

_U.S. Treasury_ The majority of offshore revenue is disbursed to the Treasury, which enters it into the General Fund, the federal government’s basic operating fund. The General Fund pays for roughly two-thirds of all federal expenditures, including the U.S. military, national parks, and schools.

_Land and Water Conservation Fund_ This fund provides matching grants to states and local governments to buy and develop public outdoor recreation areas across the 50 states.

_Historic Preservation Fund_ This fund helps preserve U.S. historical and archaeological sites and cultural heritage through grants to state and tribal historic preservation offices.

_States_ States receive federal Outer Continental Shelf revenue in two ways:

1. 27% of revenue from leases in the 8(g) Zone (the first three nautical miles of the Outer Continental Shelf) are shared with states.
2. 37.5% of revenue from certain leases in the Gulf of Mexico are shared with Alabama, Louisiana, Mississippi, and Texas.

_Other_ Certain offshore funds are directed back to the federal agencies that administer these lands (e.g., BOEM and BSEE) to help cover the agencies’ operational costs.

## Archive

In the past, this site has offered detailed data for disbursements distributed from other funds. For example, the data below details disbursements to sub-funds of the Land and Water Conservation Fund and the Historic Preservation Fund.

### Land and Water Conservation Fund

{{ "ONRR" | term }} disburses revenue to the [Land and Water Conservation Fund (LWCF)](https://www.nps.gov/subjects/lwcf/index.htm) according to federal law. However, these funds are subject to congressional appropriations. Some of the money disbursed from ONRR to the fund is spent on LWCF projects, but some of it ultimately goes to other expenditures. The fund is authorized to receive and disburse $900 million each year, but congressional appropriations to LWCF projects have been limited to between $149 million and $573 million each year since 1999.

To see how much was disbursed to states, sub-funds, and other projects each year, see the following datasets.

* [American Battlefield Protection Program, 2011-2015 data]({{ site.baseurl }}/data/disbursements/lwcf/abpp.tsv) (TSV): Details about the location, acreage, and grant amounts of each battlefield funded through the [American Battlefield Protection Program](https://www.nps.gov/abpp/index.htm), a National Parks Service program that preserves the land where historic American battles were fought.

* [Cooperative Endangered Species Conservation Fund, 2011-2015 data]({{ site.baseurl }}/data/disbursements/lwcf/cescf.tsv) (TSV): List of individual projects and locations funded through the [Cooperative Endangered Species Conservation Fund](https://www.fws.gov/endangered/grants/), a [Fish and Wildlife Service](https://www.fws.gov/) program for conservation planning and acquisition of vital habitat for threatened and endangered species.

* [State and local grants, 2011-2016 data]({{ site.baseurl }}/data/disbursements/lwcf/grants.tsv) (TSV): Details about the location, amount, and purpose of all Land and Water Conservation Fund grants to state and local governments.

* [Land acquisitions, 2011-2016 data]({{ site.baseurl }}/data/disbursements/lwcf/land-acquisition.tsv) (TSV): Details about the location, budget, acreage, and purpose of each federal land acquisition funded by the Land and Water Conservation Fund.

### Historic Preservation Fund

Like the LWCF, money in the Historic Preservation Fund is subject to congressional appropriations. Some of it is spent on historic preservation projects, but some of it ultimately goes to other expenditures. The fund is authorized to receive and disburse $150 million each year, but annual appropriations have declined from $94 million to less than $60 million since 2001.

To see how much was disbursed to each state for preservation projects, see [Historic Preservation grants, 2011-2016]({{ site.baseurl }}/data/disbursements/historic-preservation.tsv) (TSV).

## Contact us

{% include contact.html %}
