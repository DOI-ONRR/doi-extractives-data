# Exports

This directory contains data detailing natural resource extraction-related
exports figures (in US Dollars) by state and at the national level.

* `exports-by-industry.tsv` is the result of our update process that gets read
  into our database and output as YAML for the site to consume.
* `top-state-exports.tsv` is an Excel export from a US Census spreadsheet. See below for updating instructions.
  
## Updating the data
1. Download [this spreadsheet](https://www.census.gov/foreign-trade/statistics/state/data/exstall.xls)
   from [this US Census page](https://www.census.gov/foreign-trade/statistics/state/data/index.html).
1. Export the spreadsheet from Excel as "tab-separated values" and save it as `top-state-exports.tsv`.
1. Run:

  ```sh
  make -B
  ```
  
This will run the new data through the `parse-census-commodities.js` script and produce
an updated `exports-by-industry.tsv`.
