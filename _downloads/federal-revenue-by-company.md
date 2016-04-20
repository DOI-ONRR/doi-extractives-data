---
title: Federal Revenue by Company | Documentation
layout: content
permalink: /downloads/federal-revenue-by-company/
title_display: Federal Revenue by Company
breadcrumb: Downloads
---


> This dataset provides natural resource
revenues data by company for calendar years 2013-2015. This new dataset is
a product of USEITI and represents cooperation between government,
industry, and civil society to create and confirm this information, and
provide it in a way that adds to the national dialogue on natural resource
extraction. This data set will be updated in the first quarter of the
calendar year.

<p class="downloads-download_links-intro">Download calendar year data:
  <ul class="downloads-download_links list-unstyled">
    <li><a href="{{site.baseurl}}/downloads/federal_revenue_by_company_CY2013-CY2015_2016-03-04.xlsx"><icon class="icon-cloud icon-padded"></icon>
    Full dataset (xlsx, 128 KB)</a></li>
    {% for doc in site.federal-revenue-by-company %}
    <li><a href="{{ site.baseurl }}/data/company/revenue/{{ doc.year }}.tsv"><icon class="icon-cloud icon-padded"></icon>
    {{ doc.year }} dataset (tsv)</a></li>
    {% endfor %}
  </ul>
</p>

<p class="u-margin-top" markdown="1">We also have [notes on this data](https://github.com/18F/doi-extractives-data/wiki/Data-Catalog#company-revenue) from the web development team as they built the interactions on this site.</p>

## Scope

This dataset includes revenues for U.S. federal lands and offshore areas. It does not include Indian lands, privately-owned lands, or U.S. state lands. The datasets currently include data tracked and managed by the Department of the Interior’s (DOI) Office of Natural Resources Revenue (ONRR), Bureau of Land Management (BLM), and Office of Surface Mining, Reclamation, and Enforcement.

## Why is there a line in the data called 'companies below threshold'?

The USEITI Multi-Stakeholder Group agreed to an annual reporting threshold of $100,000 because these aggregated payments make up less than one quarter of one percent of total payments. Many of the companies that fall below this threshold are small companies, individuals, and family trusts. Payments made by entities that reported less than $100,000 are aggregated (rolled-up) into this category.

## Why is there a line in the data called 'one mine one product'?

Disclosing payments of solid mineral companies who only produce and sell only one product from one mine can reveal proprietary sales price and contracting information and cause competitive harm to these small companies. The Department of the Interior is legally obligated through the Trades Secrets Act to safeguard this data, so payments from these companies are aggregated (rolled-up) in this category. These aggregated payments make up less than three thousandths of one percent of all payments.

## Why are some values negative?

Companies can adjust and correct their payments for up to seven years after a transaction takes place. If a company overpays their royalty, rent, or bonus, they are entitled to recoup their overpayment. If the overpayment and recoupment happen in different years, the recoupment will appear as a negative amount in ONRR’s revenue summaries.

## Why is there a Gas value, an Oil value and an Oil & Gas value?

“Oil & Gas” is the commodity category used for offshore oil and gas rents and bonuses. At the time of lease sale, it isn’t known whether a lease will produce oil, gas, or both oil and gas. After a lease starts producing a commodity (or commodities), the lease owner starts paying royalties, and these royalties can then be associated with either oil or gas. Hence, rent and bonus lines of data will be associated with an “Oil & Gas” commodity type, while royalty lines of data will be associated with either “Oil” or “Gas” commodity types.

## Why is the calendar year revenue by location national total slightly different than the revenue by company total?

Our site has two federal revenue datasets. The one on this page is organized by the company that paid the revenue. [This one]({{ site.baseurl }}/downloads/federal-revenue-by-location/) is organized by location. However, the national revenue totals on these datasets are slightly different (by about 90 million dollars). This is because the the company revenues dataset excludes revenue from offshore right-of-ways because they don't map to an offshore planning area.

## Data dictionary

### Fields and definitions

**Company Name.** Name of company.

**Revenue Type.** Revenues from U.S. natural resources fall into one of several types:

* **Royalties.** A natural resource lease owner pays royalties after the lease starts producing a commodity in {{ "paying quantities" | term_end }}. The amount is based on a percentage of the revenue from the commodity sold. This royalty rate is set in the original lease document that went along with the lease sale, the onshore royalty rate is 12.5%, offshore leases can have a royalty rates of 12.5%, 16.67%, 18.75%.
* **Bonus.** The amount paid by the highest successful bidder for a natural resource lease. The winning bid. Collected by BLM (Onshore) and ONRR (Offshore).
* **Rents.** A natural resource lease might not produce a commodity in paying quantities for some time after it is sold. Until it does, periodic payments are made for the right to continue exploration and development of the land for future natural resource production. These payments are called rent. The first year rental is collected by BLM and the remaining rental payments are collected by ONRR.
* **Other revenues.** This category includes revenues that are not included in the royalty, rent, or bonus categories, such as; minimum royalties, estimated royalties, settlement agreements, and interest.
* **Inspection fees.** This category includes fees for annual inspections performed by the Bureau of Safety and Environmental Enforcement (BSEE) on each offshore permanent structure and drilling rig that conducts drilling, completion, or workover operations. ONRR collects these fees on behalf of BSEE.
* **Civil penalties.** Civil penalties are assessed for violations of laws applicable to extractive activities. These penalties are issued by ONRR, BOEM, and/or BSEE, and are collected by ONRR. There are two lines for this data. "Civil penalties" are penalties collected by ONRR, and "Civil penalties including late charges" are penalties collected by BLM.
* **Permit Fees.** Include mining claim fees  paid when mining hardrock minerals, applicants pay a set fee to stake a claim rather than bid on a lease. Also included in this category are Applications to Drill.
* **Abandoned mine lands (AML) fees.** A fee paid by coal companies, $0.28 per ton of surface coal produced, and $0.12 per ton of subsurface coal produced. These fees are placed in the AML fund to address reclamation of abandoned mines from operations prior to 1977.


**Commodity Type.** The DOI collects revenues on over 60 different products. The majority of revenues come from Oil, Gas, Coal, and Renewables (Geothermal and Wind), but you will find many other product categories in these datasets.

**Revenue.** Total revenue.

### Advanced information

Commodities can be further broken down into products. These are the products that could fall into the commodity categories found in these datasets.

**Coal.** Coal (ton), Coal-Bituminous-Raw (ton).

**Gas.** Coal Bed Methane (mcf), Flash Gas (mcf), Fuel Gas (mcf), Gas Hydrate (mcf), Gas Lost - Flared or Vented (mcf), Nitrogen (mcf), Processed (Residue) Gas (mcf), Unprocessed (Wet) Gas (mcf), NGL (Gas Plant Products).

**Oil.** Asphaltic Crude (bbl), Black Wax Crude (bbl), Condensate (bbl), Drip or Scrubber Condensate (bbl), Drip or Scrubber Condensate (bbl), Fuel Oil (bbl), Inlet Scrubber (bbl), Oil (bbl), Oil Lost (bbl), Other Liquid Hydrocarbons (bbl), Sour Crude (bbl), Sweet Crude (bbl), Yellow Wax Crude (bbl).

**Geothermal.** Geothermal - Direct Utilization, Hundreds of Gallons (cgal), Geothermal - Direct Utilization, Millions of BTUs (mmbtu), Geothermal - Electrical Generation, Kilowatt Hours (kwh), Geothermal - Electrical Generation, Thousands of Pounds (klb), Geothermal - sulfur (lton).

**Wind.** Wind.

**Locatable Minerals.**  The federal law governing locatable minerals is the General Mining Law of 1872 (May 10, 1872), which declared all valuable mineral deposits belonging to the United States ... to be free and open to citizens of the United States to explore for, discover, and purchase.  Mineral deposits subject to acquisition in this manner are generally referred to as “locatable minerals.” Locatable minerals include metallic minerals (gold, silver, lead, copper, zinc, nickel, etc.), nonmetallic minerals (fluorspar, mica, certain limestones and gypsum, tantalum, heavy minerals in placer form and gemstones) and certain uncommon variety minerals. It is very difficult to prepare a complete list of locatable minerals because the history of the law has resulted in a definition of minerals that includes economics.

**Mineral Materials.**  The BLM makes mineral materials located on public lands, such as sand, gravel, crushed stone, decorative stone, clay, and pumice available for sale under the authority of the Materials Act of 1947.  This law authorizes the BLM to sell these mineral materials at fair market value and to grant free-use permits to Government agencies and nonprofit organizations, so long as public land resources, the environment and the public are protected.  Mineral materials are among our most basic natural resources.  In particular, sand, gravel, and crushed stone, also known as construction aggregate, extracted on BLM administered public lands are necessary for making ready-mixed concrete, asphalt, and many other building materials.  By making locally available aggregate supplies available on public lands, BLM can help reduce consumer costs (fuel and energy costs), and reduce environmental impacts (air quality emissions and greenhouse gases). 

**Other Commodities.** Anhydrous Sodium Sulfate (ton), Borax-Decahydrate (ton), Borax-Pentahydrate (ton), Boric Acid (ton), Carbon Dioxide Gas (CO2) (mcf), Cinders (ton), Clay (ton), Copper Concentrate (ton), Gilsonite (ton), Gold (ton), Gypsum (ton), Helium (bbl), Langbeinite (ton), Lead Concentrate (ton), Leonardite (ton), Limestone (ton), Magnesium Chloride Brine (ton), Manure Salts (ton), Muriate Of Potash-Granular (ton), Muriate Of Potash-Standard (ton), Other (ton), Phosphate Raw Ore (ton), Potash (ton), Purge Liquor (ton), Quartz Crystal (lb), Salt (ton), Sand/Gravel (ton), Sand/Gravel-Cubic Yards (cyd), Silver (oz), Soda Ash (ton), Sodium Bi-Carbonate (ton), Sodium Bisulfite (ton), Sodium Sesquicarbonate (ton), Sulfide (ton), Sulfur (lton), Sylvite-Raw Ore (ton), Trona Ore (ton), Zinc Concentrate (ton).

