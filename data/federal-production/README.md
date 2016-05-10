# Production on Federal Lands
This directory contains raw federal production volume data from [ONRR] and
associated utilities for reading it into our database.

* [offshore.tsv](offshore.tsv) contains protraction-level offshore
  production volumes for calendar years 2004-2013.
  [transform-offshore.js](transform-offshore.js) is the associated
  transformation script.
* [onshore.tsv](onshore.tsv) contains county-level onshore production
  volumes for calendar years 2005-2014.
  [transform-onshore.js](transform-onshore.js) is the associated
  transformation script.
* [rollup.sql](rollup.sql) is the SQL script that summarizes the onshore and
  offshore production data and creates state ranking tables.

[ONRR]: http://onrr.gov/
