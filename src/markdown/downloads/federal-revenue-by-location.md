---
title: Revenue by Year | Documentation
layout: downloads
permalink: /downloads/federal-revenue-by-location/
tag:
- Data
- Downloads
- Documentation
- Federal
- Native American
- Indian
- Revenue
- Location
- By location
---

<custom-link to="/downloads/" className="breadcrumb link-charlie">Downloads</custom-link> /
# Revenue by Year

> We offer revenue data files for both calendar year and fiscal year. The calendar year datasets is for years 2003-2018, and the fiscal year data set is for years 2003-2019. They are all <glossary-term>accounting year</glossary-term> data.

Download calendar year data (2003-2018):

<ul class="downloads-download_links list-unstyled">
  <li><excel-link to="/downloads/revenue/calendar_year_revenue.xlsx">Calendar year revenue (Excel, 2.8 MB)</excel-link></li>
  <li><csv-link to="/downloads/csv/revenue/calendar_year_revenue.csv">Calendar year revenue (csv, 5.4 MB)</csv-link></li>
</ul>

Download fiscal year data (2003-2019):

<ul class="downloads-download_links list-unstyled">
  <li><excel-link to="/downloads/revenue/fiscal_year_revenue.xlsx">Fiscal year revenue (Excel, 3.4 MB)</excel-link></li>
  <li><csv-link to="/downloads/csv/revenue/fiscal_year_revenue.csv">Fiscal year revenue (csv, 5.2 MB)</csv-link></li>
</ul>

## Scope

These datasets include natural resource revenues for U.S. federal lands and offshore areas, along with Native American lands. It does not include privately-owned lands or U.S. state lands.

Federal revenue data is available by location, but Native American data is only available at the national level to protect private and personally identifiable information.

The datasets include data tracked and managed by the Department of the Interior’s Office of Natural Resources Revenue.

<h3 alt="Negative values">Why are some values negative?</h3>

Companies can adjust and correct their payments for up to seven years after a transaction takes place. If a company overpays their royalty, rent, or bonus, they are entitled to recoup their overpayment. If the overpayment and recoupment happen in different years, the recoupment will appear as a negative amount in the Office of Natural Resources Revenue's revenue summaries.

<h3 alt="Oil and gas values">Why is there a Gas value, an Oil value and an Oil & Gas value?</h3>

“Oil & Gas” is the commodity category used for offshore oil and gas rents and bonuses. At the time of lease sale, it isn’t known whether a lease will produce oil, gas or both oil and gas. After a lease starts producing a commodity (or commodities), the lease owner starts paying royalties. These can then be associated with either oil or gas. Hence, rent and bonus lines of data will be associated with an “Oil & Gas” commodity type, while royalty lines of data will be associated with either “Oil” or “Gas” commodity types.

<h3 alt="Revenue by location and by company"> Why is the calendar year <span style='font-style:italic'>revenue by location national total</span> slightly different than the <span style='font-style:italic'>revenue by company total</span>?</h3>

Our site has two federal revenue datasets. The one on this page is organized by location. [The federal revenue by company dataset](/downloads/federal-revenue-by-company/) is organized by the company that paid the revenue. However, the national revenue totals are slightly different (by about $90 million). This is because the revenue by location dataset excludes revenue from offshore rights-of-way because they don't map to an offshore planning area.

<h3 alt="Geothermal rate details">Note: Geothermal rate details</h3>

The fees and rates for revenue from geothermal resources on federal land depend on whether the land is leased competitively or noncompetitively.

Also, different fee rates apply to pre-2005 leases and to direct use facilities:

* For leases signed before the Energy Policy Act of 2005, the lease holder’s reasonable actual transmission and generation costs are deducted from gross proceeds from electricity sales, and the resulting value is multiplied by the lease royalty rate (usually 10%).
* For <glossary-term>direct use</glossary-term>, the lease holder pays the equivalent value of the least expensive, reasonable alternative energy source. Thermal energy utilized must be measured by lease holder at the inlet and outlet of facility. The resulting value is multiplied by the lease royalty rate of 10%.

The Bureau of Land Management has [more information about geothermal energy on federal lands](https://www.blm.gov/programs/energy-and-minerals/renewable-energy/geothermal-energy).

## Data dictionary

### Fields and definitions

_Year_

* _Calendar year_ is the period between January 1 and December 31 for a given year.
* _Fiscal year_ The year the revenue was generated. The federal fiscal year runs from October 1 of the prior year through September 30 of the year being described. For example, Fiscal Year 2018 is between October 1, 2017,  and September 30, 2018.

_Land Class_

* _Federal_ [Federal lands](https://fas.org/sgp/crs/misc/R42346.pdf) are owned by or under the jurisdiction of the federal government, including: public domain lands, acquired lands, military acquired lands, and [Outer Continental Shelf](https://www.boem.gov/OCS-Lands-Act-History/)
* _Native American_ Includes Tribal lands held in trust by the federal government for a tribe’s use, and allotments held in trust by the federal government for individual Native American use

_Land Category_

* _Onshore_ situated or occurring on land.
* _Offshore_ submerged lands located farther than three miles off a state’s coastline, or three marine leagues into the Gulf of Mexico off of Texas and Western Florida

_State_ Contains the name of the state

_County_ Contains county, parish, and borough names

_FIPS Code_ Federal Information Processing Standards (FIPS), now known as Federal Information Processing Series, are numeric codes assigned by the National Institute of Standards and Technology (NIST). Typically, FIPS codes deal with US states and counties. US states are identified by a 2-digit number, while US counties are identified by a 3-digit number.

_Offshore Region_ The Bureau of Ocean Energy Management separates offshore area into four regions: Gulf of Mexico, Atlantic, Pacific and Alaska. For more information on offshore regions, including spatial boundaries, see the Bureau of Ocean Energy Management's maps and GIS data.

_Offshore Planning Area_ Offshore regions are broken out into planning areas. For more information on offshore planning areas, including spatial boundaries, see the Bureau of Ocean Energy Management's maps and GIS data.

_Offshore Block or Offshore Area_ is a geographic bound area found inside offshore planning areas.
Offshore Protraction is a geographic bound area found inside offshore areas.

_Revenue Type_ Revenues from U.S. natural resources fall into one of several types:

* _Royalties_ A natural resource lease holder pays royalties after the lease starts producing a commodity in paying quantities. The amount is based on a percentage of the revenue from the commodity sold. The exact percentage is set in the original lease document that went along with the lease sale.
* _Bonus_ The amount paid by the highest successful bidder for a natural resource lease. The winning bid.
* _Other Revenues_ This category includes revenues that are not included in the royalty, rent, or bonus categories, such as minimum royalties, estimated royalties, settlement agreements, and interest.
* _Rents_ A natural resource lease might not produce anything in paying quantities for some time after it is sold. Until it does, periodic payments are made for the right to continue exploration and development of the land for future natural resource production. These payments are called rent.

_Mineral Lease Type_ Is the type of lease revenue is being generated from. An oil and gas mineral lease type can generate revenue not only from oil & gas but also, CO2, helium, NGL, and sulfur.
* _Asphalt_
* _Chat_
* _Cinders_
* _Clay_
* _Coal_
* _Copper_
* _Garnet_
* _Gemstones_
* _Geothermal_
* _Gilsonite_
* _Gold_
* _Gypsum_
* _Hardrock_
* _Hot Springs_
* _Limestone_
* _Mining - unspecified_
* _Oil & Gas_
* _Oil Shale_
* _Phosphate_
* _Potassium_
* _Quartz_
* _Sand & Gravel_
* _Silica Sand_
* _Sodium_
* _Sulfur_
* _Tar Sands_
* _Wind_

_Commodity Type_ The Department of the Interior collects revenues on over 60 different products. The majority of revenues come from Oil & Gas, Coal, and Renewables (Geothermal and Wind), but you will find many other product categories in these datasets.
* _Asphalt_
* _Chat_
* _Cinders_
* _Clay_
* _CO2_
* _Coal_
* _Copper_
* _Gas_
* _Gemstones_
* _Geothermal_
* _Gilsonite_
* _Gold_
* _Gypsum_
* _Hardrock_
* _Helium_
* _Hot Springs_
* _Limestone_
* _Mining - unspecified_
* _NGL_
* _Oil_
* _Oil & Gas_
* _Oil Shale_
* _Phosphate_
* _Potassium_
* _Quartz_
* _Sand & Gravel_
* _Silica Sand_
* _Sodium_
* _Sulfur_
* _Tar Sands_
* _Wind_

_Product_ Commodity type is often further broken down into product.
* _Anhydrous Sodium Sulfate_
* _Borax-Anhydrous_
* _Borax-Decahydrate_
* _Borax-Pentahydrate_
* _Boric Acid_
* _Boric Oxide_
* _Borrow Sand & Gravel_
* _Brine Barrels_
* _Calcium Chloride_
* _Carbon Dioxide_
* _Carbon Dioxide Gas (CO2)_
* _Caustic_
* _Cinders_
* _Clay_
* _Coal_
* _Coal Bed Methane_
* _Coal Waste (Sub-Econ)_
* _Coal-Bituminous-Processed_
* _Coal-Bituminous-Raw_
* _Coal-Fines Circuit_
* _Coal-Lignite-Raw_
* _Coal-Subbituminous-Processed_
* _Coal-Subbituminous-Raw_
* _Cobalt Concentrate_
* _Condensate_
* _Copper_
* _Copper Concentrate_
* _Drip or Scrubber Condensate_
* _Ferro Phosphorous Slag_
* _Flash Gas_
* _Fuel Gas_
* _Fuel Oil_
* _Gas Hydrate_
* _Gas Lost - Flared or Vented_
* _Gas Plant Products_
* _Geothermal - Commercially Demineralized H2O_
* _Geothermal - Direct Use, Millions of Gallons_
* _Geothermal - Direct Utilization, Hundreds of Gallons_
* _Geothermal - Direct Utilization, Millions of BTUs_
* _Geothermal - Direct Utilization, Other_
* _Geothermal - Electrical Generation, Kilowatt Hours_
* _Geothermal - Electrical Generation, Other_
* _Geothermal - Electrical Generation, Thousands of Pounds_
* _Geothermal - sulfur_
* _Gilsonite_
* _Gold_
* _Gold Ore_
* _Gold Placer_
* _Granulated Langbeinite_
* _Gypsum_
* _Hardrock_
* _Helium_
* _Hydrogen - Hydrogen_
* _Indian Oil- Asphaltic_
* _Indian Oil- Black Wax_
* _Indian Oil- Sour_
* _Indian Oil- Sweet_
* _Indian Oil- Yellow Wax_
* _Inlet Scrubber_
* _Langbeinite_
* _Langbeinite-Coarse_
* _Langbeinite-Granular_
* _Langbeinite-Special Std_
* _Langbeinite-Standard_
* _Lead Concentrate_
* _Leonardite_
* _Limestone_
* _Magnesium Chloride Brine_
* _Manure Salts_
* _Molybdenum Concentrate_
* _Muriate Of Potash-Coarse_
* _Muriate Of Potash-Granular_
* _Muriate Of Potash-Standard_
* _Nitrogen_
* _Oil_
* _Oil- Black Wax_
* _Oil Lost_
* _Oil- Sour_
* _Oil- Sweet_
* _Oil- Yellow Wax_
* _Other Liquid Hydrocarbons_
* _Phosphate Concentrate_
* _Phosphate Raw Ore_
* _Potash_
* _Potassium_
* _Potassium Sulphate Special Std_
* _Potassium Sulphate-Granular_
* _Potassium Sulphate-Standard_
* _Processed (Residue) Gas_
* _Purge Liquor_
* _Quartz Crystal_
* _Salt_
* _Salt-Waste_
* _Sand/Gravel_
* _Sand/Gravel-Cubic Yards_
* _Silver_
* _Soda Ash_
* _Soda Ash-Coarse_
* _Soda Ash-Granular_
* _Sodium Bi-Carbonate_
* _Sodium Bicarbonate Animal Feed_
* _Sodium Bisulfite_
* _Sodium Decahydrate_
* _Sodium Metabisulfite_
* _Sodium Sesquicarbonate_
* _Sulfide_
* _Sulfur_
* _Sylvite-Raw Ore_
* _Trona Ore_
* _Unprocessed (Wet) Gas_
* _Wavellite_
* _Zinc Concentrate_

_Revenue_ Total revenue.


## Contact us
