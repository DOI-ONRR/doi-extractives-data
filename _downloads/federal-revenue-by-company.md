---
title: Federal Revenue by Company | Documentation
layout: content
permalink: /downloads/federal-revenue-by-company/
title_display: Federal Revenue by Company
nav_items:
  - name: introduction
    title: Top
  - name: scope
    title: Scope
    subnav_items:
      - name: why-is-there-a-line-in-the-data-called-companies-below-threshold
        title: Companies below threshold
      - name: why-is-there-a-line-in-the-data-called-one-mine-one-product
        title: One mine, one product
      - name: why-are-some-values-negative
        title: Negative values
      - name: why-is-there-a-gas-value-an-oil-value-and-an-oil--gas-value
        title: Oil and gas values
      - name: why-is-the-calendar-year-revenue-by-location-national-total-slightly-different-than-the-revenue-by-company-total
        title: Revenue by location and by company
  - name: data-dictionary
    title: Data dictionary
    subnav_items:
      - name: fields-and-definitions
        title: Fields and definitions
      - name: advanced-information
        title: Advanced information
  - name: contact-us
    title: Contact us
selector: list
breadcrumb:
  - title: Downloads
    permalink: /downloads/
description: This dataset provides natural resource revenues data by company for calendar years 2013-2015. This new dataset represents cooperation between government, industry, and civil society to create and confirm this information, and provide it in a way that adds to the national dialogue on natural resource extraction. This dataset will be updated in the first quarter of the calendar year.
tag:
- Data
- Downloads
- Documentation
- Federal
- Revenue
- Company
- By company
---


> This dataset provides natural resource revenues data by company for calendar years 2013-2016. This new dataset adds to the national dialogue on natural resource extraction. This dataset will be updated in the first quarter of the calendar year.

<p class="downloads-download_links-intro">Download calendar year data:
  <ul class="downloads-download_links list-unstyled">
    <li><a href="{{ site.baseurl }}/downloads/federal_revenue_by_company_CY2013-CY2016_2017-04-04.xlsx">{% include svg/icon-download.svg %}
    Full dataset (xlsx, 382 KB)</a></li>
  </ul>
</p>

We also have [notes on this data](https://github.com/18F/doi-extractives-data/wiki/Data-Catalog#company-revenue) from the web development team as they built the interactions on this site.

## Scope

This dataset includes revenues for U.S. federal lands and offshore areas. It does not include Indian lands, privately-owned lands, or U.S. state lands. The datasets currently include data tracked and managed by the Department of the Interior’s (DOI) Office of Natural Resources Revenue (ONRR), Bureau of Land Management (BLM), and Office of Surface Mining, Reclamation, and Enforcement.

### Why is there a line in the data called 'companies below threshold'?

Many of the companies that fall below the $100,000 threshold are small companies, individuals, and family trusts. These aggregated payments also make up less than one quarter of one percent of total payments. Payments made by entities that reported less than $100,000 are aggregated (rolled-up) into this category.

### Why is there a line in the data called 'one mine one product'?

Disclosing payments of solid mineral companies who produce and sell only one product from one mine can reveal proprietary sales price and contracting information and cause competitive harm to these small companies. The Department of the Interior is legally obligated through the Trades Secrets Act to safeguard this data, so payments from these companies are aggregated (rolled-up) in this category. These aggregated payments make up less than three-thousandths of one percent of all payments.

### Why are some values negative?

Companies can adjust and correct their payments for up to seven years after a transaction takes place. If a company overpays their royalty, rent, or bonus, they are entitled to recoup their overpayment. If the overpayment and recoupment happen in different years, the recoupment will appear as a negative amount in ONRR’s revenue summaries.

### Why is there a Gas value, an Oil value and an Oil & Gas value?

“Oil & Gas” is the commodity category used for offshore oil and gas rents and bonuses. At the time of lease sale, it isn’t known whether a lease will produce oil, gas, or both oil and gas. After a lease starts producing a commodity (or commodities), the lease owner starts paying royalties, and these royalties can then be associated with either oil or gas. Hence, rent and bonus lines of data will be associated with an “Oil & Gas” commodity type, while royalty lines of data will be associated with either “Oil” or “Gas” commodity types.

### Why is the calendar year _revenue by location national total_ slightly different than the _revenue by company total_?

Our site has two federal revenue datasets. The one on this page is organized by the company that paid the revenue. The [federal revenue by location dataset]({{ site.baseurl }}/downloads/federal-revenue-by-location/) is organized by location. However, the national revenue totals on these datasets are slightly different (by about $90 million). This is because the the company revenues dataset excludes revenue from offshore right-of-ways because they don't map to an offshore planning area.

## Data dictionary

### Fields and definitions

_Company Name_ Name of company.

_Revenue Type_ Revenues from U.S. natural resources fall into one of several types:

* _Royalties_ A natural resource lease owner pays royalties after the lease starts producing a commodity in {{ "paying quantities" | term_end }}. The amount is based on a percentage of the revenue from the commodity sold. This royalty rate is set in the original lease document that went along with the lease sale. The onshore royalty rate is 12.5%. Offshore leases can have a royalty rates of 12.5%, 16.67%, 18.75%.
* _Bonus_ The amount paid by the highest successful bidder for a natural resource lease. The winning bid. Collected by BLM (Onshore) and ONRR (Offshore).
* _Rents_ A natural resource lease might not produce a commodity in paying quantities for some time after it is sold. Until it does, periodic payments are made for the right to continue exploration and development of the land for future natural resource production. These payments are called rent. The first year rental is collected by BLM and the remaining rental payments are collected by ONRR.
* _Other revenues_ This category includes revenues that are not included in the royalty, rent, or bonus categories, such as: minimum royalties, estimated royalties, settlement agreements, and interest.
* _Inspection fees_ This category includes fees for annual inspections performed by the Bureau of Safety and Environmental Enforcement (BSEE) on each offshore permanent structure and drilling rig that conducts drilling, completion, or workover operations. ONRR collects these fees on behalf of BSEE.
* _Civil penalties_ Civil penalties are assessed for violations of laws applicable to extractive activities. These penalties are issued by ONRR, BOEM, or BSEE, and are collected by ONRR. There are two lines for this data. "Civil penalties" are penalties collected by ONRR, and "Civil penalties including late charges" are penalties collected by BLM.
* _Permit Fees_ Include mining claim fees  paid when mining hardrock minerals, applicants pay a set fee to stake a claim rather than bid on a lease. Also included in this category are Applications to Drill.
* _Abandoned mine lands (AML) fees_ A fee paid by coal companies, $0.28 per ton of surface coal produced, and $0.12 per ton of subsurface coal produced. These fees are placed in the AML fund to address reclamation of abandoned mines from operations prior to 1977.


_Commodity Type_ The DOI collects revenues on over 60 different products. The majority of revenues come from Oil, Gas, Coal, and Renewables (Geothermal and Wind), but you will find many other product categories in these datasets.

_Revenue_ Total revenue.

### Advanced information

Commodities can be further broken down into products. These are the products that could fall into the commodity categories found in these datasets.

_Coal_ Coal (ton), Coal-Bituminous-Raw (ton).

_Gas_ Coal Bed Methane (mcf), Flash Gas (mcf), Fuel Gas (mcf), Gas Hydrate (mcf), Gas Lost - Flared or Vented (mcf), Nitrogen (mcf), Processed (Residue) Gas (mcf), Unprocessed (Wet) Gas (mcf), NGL (Gas Plant Products).

_Oil_ Asphaltic Crude (bbl), Black Wax Crude (bbl), Condensate (bbl), Drip or Scrubber Condensate (bbl), Drip or Scrubber Condensate (bbl), Fuel Oil (bbl), Inlet Scrubber (bbl), Oil (bbl), Oil Lost (bbl), Other Liquid Hydrocarbons (bbl), Sour Crude (bbl), Sweet Crude (bbl), Yellow Wax Crude (bbl).

_Geothermal_ Geothermal - Direct Utilization, Hundreds of Gallons (cgal), Geothermal - Direct Utilization, Millions of BTUs (mmbtu), Geothermal - Electrical Generation, Kilowatt Hours (kwh), Geothermal - Electrical Generation, Thousands of Pounds (klb), Geothermal - sulfur (lton).

_Wind_ Wind.

_Locatable Minerals_  The federal law governing locatable minerals is the General Mining Law of 1872 (May 10, 1872), which declared all valuable mineral deposits belonging to the United States ... to be free and open to citizens of the United States to explore for, discover, and purchase.  Mineral deposits subject to acquisition in this manner are generally referred to as “locatable minerals.” Locatable minerals include metallic minerals (gold, silver, lead, copper, zinc, nickel, etc.), nonmetallic minerals (fluorspar, mica, certain limestones and gypsum, tantalum, heavy minerals in placer form and gemstones) and certain uncommon variety minerals. It is very difficult to prepare a complete list of locatable minerals because the history of the law has resulted in a definition of minerals that includes economics.

_Mineral Materials_  The BLM makes mineral materials located on public lands, such as sand, gravel, crushed stone, decorative stone, clay, and pumice available for sale under the authority of the Materials Act of 1947.  This law authorizes the BLM to sell these mineral materials at fair market value and to grant free-use permits to government agencies and nonprofit organizations, so long as public land resources, the environment, and the public are protected.  Mineral materials are among our most basic natural resources. In particular, sand, gravel, and crushed stone, also known as construction aggregate, extracted on BLM administered public lands are necessary for making ready-mixed concrete, asphalt, and many other building materials.  By making locally available aggregate supplies available on public lands, BLM can help reduce consumer costs (fuel and energy costs), and reduce environmental impacts (air quality emissions and greenhouse gases). 

_Other Commodities_ Anhydrous Sodium Sulfate (ton), Borax-Decahydrate (ton), Borax-Pentahydrate (ton), Boric Acid (ton), Carbon Dioxide Gas (CO2) (mcf), Cinders (ton), Clay (ton), Copper Concentrate (ton), Gilsonite (ton), Gold (ton), Gypsum (ton), Helium (bbl), Langbeinite (ton), Lead Concentrate (ton), Leonardite (ton), Limestone (ton), Magnesium Chloride Brine (ton), Manure Salts (ton), Muriate Of Potash-Granular (ton), Muriate Of Potash-Standard (ton), Other (ton), Phosphate Raw Ore (ton), Potash (ton), Purge Liquor (ton), Quartz Crystal (lb), Salt (ton), Sand/Gravel (ton), Sand/Gravel-Cubic Yards (cyd), Silver (oz), Soda Ash (ton), Sodium Bi-Carbonate (ton), Sodium Bisulfite (ton), Sodium Sesquicarbonate (ton), Sulfide (ton), Sulfur (lton), Sylvite-Raw Ore (ton), Trona Ore (ton), Zinc Concentrate (ton).

## Contact us

{% include contact.html %}
