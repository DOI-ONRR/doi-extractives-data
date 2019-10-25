---
title: Revenue by Company | Documentation
layout: downloads
permalink: /downloads/federal-revenue-by-company/
tag:
- Data
- Downloads
- Documentation
- Federal
- Revenue
- Company
- By company
---

<custom-link to="/downloads/" className="breadcrumb link-charlie">Downloads</custom-link> /
# Federal Revenue by Company

> This dataset provides natural resource revenue data by company for calendar years 2013-2018. It includes revenues by production phase and commodity for companies extracting natural resources on federal lands and waters. It does not include company revenue from Native American lands or privately owned lands.

<p class="downloads-download_links-intro">Download calendar year data:
  <ul class="downloads-download_links list-unstyled">
    <li><excel-link to="/downloads/federal_revenue_by_company_CY2013-CY2018.xlsx">Revenue by company (Excel, 409 KB)</excel-link></li>
    <li><csv-link to="/downloads/federal_revenue_by_company_CY2013-CY2018.csv">Revenue by company (csv, 1 MB)</csv-link></li>
  </ul>
</p>

## Scope

This dataset includes revenues for U.S. federal lands and offshore areas. It does not include Native American lands, privately owned lands, or U.S. state lands. The datasets currently include data tracked and managed by the Department of the Interior’s (DOI) Office of Natural Resources Revenue (ONRR), Bureau of Land Management (BLM), and Office of Surface Mining, Reclamation, and Enforcement.

<h3 alt="Companies below threshold">Why is there a line in the data called 'companies below threshold'?</h3>

Many of the companies that fall below the $100,000 threshold are small companies, individuals, and family trusts. These aggregated payments also make up less than one quarter of one percent of total payments. Payments made by entities that reported less than $100,000 are aggregated (rolled-up) into this category.

<h3 alt="One mine, one product">Why is there a line in the data called 'one mine one product'?</h3>

Disclosing payments of solid mineral companies who produce and sell only one product from one mine can reveal proprietary sales price and contracting information and cause competitive harm to these small companies. The Department of the Interior is legally obligated through the Trades Secrets Act to safeguard this data, so payments from these companies are aggregated (rolled-up) in this category. These aggregated payments make up less than three-thousandths of one percent of all payments.

<h3 alt="Negative values">Why are some values negative?</h3>

Companies can adjust and correct their payments for up to seven years after a transaction takes place. If a company overpays their royalty, rent, or bonus, they are entitled to recoup their overpayment. If the overpayment and recoupment happen in different years, the recoupment will appear as a negative amount in ONRR’s revenue summaries.

<h3 alt="Oil and gas values">Why is there a Gas value, an Oil value and an Oil & Gas value?</h3>

“Oil & Gas” is the commodity category used for offshore oil and gas rents and bonuses. At the time of lease sale, it isn’t known whether a lease will produce oil, gas, or both oil and gas. After a lease starts producing a commodity (or commodities), the lease owner starts paying royalties, and these royalties can then be associated with either oil or gas. Hence, rent and bonus lines of data will be associated with an “Oil & Gas” commodity type, while royalty lines of data will be associated with either “Oil” or “Gas” commodity types.

<h3 alt="Revenue by location and company">Why is the calendar year <span style='font-style:italic'>revenue by location national total</span> slightly different than the <span style='font-style:italic'>revenue by company total</span>?</h3>

Our site has two federal revenue datasets. The one on this page is organized by the company that paid the revenue. The [federal revenue by location dataset](/downloads/federal-revenue-by-location/) is organized by location. However, the national revenue totals are slightly different (by about $90 million). This is because the revenue by location dataset excludes revenue from offshore rights-of-way because they don't map to an offshore planning area.

## Data dictionary

### Fields and definitions

_Calendar Year_ is the period between January 1 and December 31 for a given year.

_Company Name_ Name of company.

_Revenue Type_ Revenues from U.S. natural resources fall into one of several types:
* _Royalties_ A natural resource lease owner pays royalties after the lease starts producing a commodity in <glossary-term>paying quantities</glossary-term>. The amount is based on a percentage of the revenue from the commodity sold. This royalty rate is set in the original lease document that went along with the lease sale. The onshore royalty rate is 12.5%. Offshore leases can have a royalty rates of 12.5%, 16.67%, 18.75%.
* _Bonus_ The amount paid by the highest successful bidder for a natural resource lease. The winning bid. Collected by BLM (Onshore) and ONRR (Offshore).
* _Rents_ A natural resource lease might not produce a commodity in paying quantities for some time after it is sold. Until it does, periodic payments are made for the right to continue exploration and development of the land for future natural resource production. These payments are called rent. The first year rental is collected by BLM and the remaining rental payments are collected by ONRR.
* _Other Revenues_ This category includes revenues that are not included in the royalty, rent, or bonus categories, such as: minimum royalties, estimated royalties, settlement agreements, and interest.
* _Inspection Fees_ This category includes fees for annual inspections performed by the Bureau of Safety and Environmental Enforcement (BSEE) on each offshore permanent structure and drilling rig that conducts drilling, completion, or workover operations. ONRR collects these fees on behalf of BSEE.
* _Civil Penalties_ Civil penalties are assessed for violations of laws applicable to extractive activities. These penalties are issued by ONRR, BOEM, or BSEE, and are collected by ONRR. There are two lines for this data. "Civil penalties" are penalties collected by ONRR, and "Civil penalties including late charges" are penalties collected by BLM.
* _Permit Fees_ Include mining claim fees  paid when mining hardrock minerals, applicants pay a set fee to stake a claim rather than bid on a lease. Also included in this category are Applications to Drill.
* _Abandoned Mine Lands (AML) Fees_ A fee paid by coal companies, $0.28 per ton of surface coal produced, and $0.12 per ton of subsurface coal produced. These fees are placed in the AML fund to address reclamation of abandoned mines from operations prior to 1977.


_Commodity Type_ The DOI collects revenues on over 60 different products. The majority of revenues come from Oil, Gas, Coal, and Renewables (Geothermal and Wind), but you will find many other product categories in these datasets.
* _Asphalt_
* _Clay_
* _Coal_
* _Copper_
* _Gas_
* _Gemstones_
* _Geothermal_
* _Gilsonite_
* _Gold_
* _Hardrock_
* _Hot Springs_
* _Locatable Minerals_ (see below)
* _Mineral Materials_ (see below)
* _N/A_
* _Oil_
* _Oil & Gas_
* _Oil Shale_
* _Other Commodities_ (see below)
* _Other Leasable Minerals_
* _Phosphate_
* _Potash_
* _Potassium_
* _Quartz_
* _Sodium_
* _Sulfur_
* _Wind_

_Revenue_ Total revenue.

### Detailed commodity definitions

_Locatable Minerals_  The federal law governing locatable minerals is the General Mining Law of 1872 (May 10, 1872), which declared all valuable mineral deposits belonging to the United States ... to be free and open to citizens of the United States to explore for, discover, and purchase.  Mineral deposits subject to acquisition in this manner are generally referred to as “locatable minerals.” Locatable minerals include metallic minerals (gold, silver, lead, copper, zinc, nickel, etc.), nonmetallic minerals (fluorspar, mica, certain limestones and gypsum, tantalum, heavy minerals in placer form and gemstones) and certain uncommon variety minerals. It is very difficult to prepare a complete list of locatable minerals because the history of the law has resulted in a definition of minerals that includes economics.

_Mineral Materials_  The BLM makes mineral materials located on public lands, such as sand, gravel, crushed stone, decorative stone, clay, and pumice available for sale under the authority of the Materials Act of 1947.  This law authorizes the BLM to sell these mineral materials at fair market value and to grant free-use permits to government agencies and nonprofit organizations, so long as public land resources, the environment, and the public are protected.  Mineral materials are among our most basic natural resources. In particular, sand, gravel, and crushed stone, also known as construction aggregate, extracted on BLM administered public lands are necessary for making ready-mixed concrete, asphalt, and many other building materials.  By making locally available aggregate supplies available on public lands, BLM can help reduce consumer costs (fuel and energy costs), and reduce environmental impacts (air quality emissions and greenhouse gases).

## Contact us
