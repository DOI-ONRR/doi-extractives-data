# Federal Revenue
Files in this directory:

* [onshore.tsv](onshore.tsv): county-level onshore revenue with the following
  columns:
  * `Land Category`: always "Federal Onshore"
  * `CY`: i.e. "Calendar Year"
  * `County Name`
  * `FIPS`: 5-digit county FIPS code
  * `Revenue Type`: "Rents", "Royalties", "Bonus", "Other Revenues"
  * `Mineral Lease Type`: e.g. "Oil & Gas" (vast majority), "Hardrock",
    "Geothermal", "Coal"
  * `Commodity`: "Oil & Gas (Non-Royalty)", "Gas", "NGL", "Oil", "Coal", etc.
      * `Product`: "Unprocessed (Wet) Gas", "Oil", "Processed (Residue) Gas", "Gas
    Plant Products", etc.
  * `Total`: the revenue total, formatted as a dollar amount, e.g.
    `$1,810,092.43` or `($27,173.82)` for negative values.
