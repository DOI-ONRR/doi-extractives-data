# Production on Federal Lands
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

[ONRR]: http://onrr.gov/
