# Federal revenue
This directory contains data for federal revenue collected by the
[Office of Natural Resource Revenue (ONRR)][ONRR]. The files:

* `offshore.tsv` is exported from an Excel spreadsheet, and contains
  offshore revenue by calendar year down to the [protraction] level.
  (We sum the revenue figures at the _offshore region_ level for the site.)
  The columns are:
  * `Land Category`: always "Federal Offshore"
  * `CY`: i.e. "Calendar Year"
  * `Offshore Region`: see [this map](https://github.com/onrr/doi-extractives-data/wiki/Data-Catalog#offshore-areas)
  * `Offshore Planning Area`: the sub-area of the offshore region
  * `BOEM Block Name`: ?
  * `BOEM Protraction`: the lowest level of geographic detail. See [BOEM's protraction diagrams](https://www.boem.gov/Official-Protraction-Diagrams/) for more info.
  * `Revenue Type`: "Rents", "Royalties", "Bonus", "Other Revenues"
  * `Mineral Lease Type`: e.g. "Oil & Gas" (vast majority), "Hardrock",
    "Geothermal", "Coal"
  * `Commodity`: "Oil & Gas (Non-Royalty)", "Gas", "NGL", "Oil", "Coal", etc.
  * `Product`: "Unprocessed (Wet) Gas", "Oil", "Processed (Residue) Gas", "Gas Plant Products", etc.
  * `Total`: the revenue total, formatted as a dollar amount, e.g.
    `$1,810,092.43` or `($27,173.82)` for negative values.

* `onshore.tsv` is exported from an Excel spreadsheet, and contains
  county-level onshore revenue by calendar year with the following columns:
  * `Land Category`: always "Federal Onshore"
  * `CY`: i.e. "Calendar Year"
  * `County Name`
  * `FIPS`: 5-digit county FIPS code
  * `Revenue Type`: "Rents", "Royalties", "Bonus", "Other Revenues"
  * `Mineral Lease Type`: e.g. "Oil & Gas" (vast majority), "Hardrock",
    "Geothermal", "Coal"
  * `Commodity`: "Oil & Gas (Non-Royalty)", "Gas", "NGL", "Oil", "Coal", etc.
  * `Product`: "Unprocessed (Wet) Gas", "Oil", "Processed (Residue) Gas", "Gas Plant Products", etc.
  * `Total`: the revenue total, formatted as a dollar amount, e.g.
    `$1,810,092.43` or `($27,173.82)` for negative values.

* `civil-penalties.csv` contains only civil penalties and other revenue
  amounts, organized by year and revenue type.

[ONRR]: https://www.onrr.gov/
[protraction]: https://www.boem.gov/Official-Protraction-Diagrams/
