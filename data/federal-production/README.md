# Production on federal lands
This directory contains raw federal production volume data from [ONRR] and
associated utilities for reading it into our database.

* [federal-production.tsv](federal-production.tsv) contains both onshore
  (county-level) and offshore (protraction-level) production volume for all
  products from 2005-2016.
  [transform-production.js](transform-production.js) is the
  associated transformation script.
* [rollup.sql](rollup.sql) is the SQL script that summarizes the
  production data and calculates national, state-, and offshore
  region-level totals, and state ranking table.

## Updating the data
To update this data, you will need to re-export the updated spreadsheet
provided by ONRR as "tab-separated values", and save it as `federal-production.tsv`.
That's it!

[ONRR]: http://onrr.gov/
