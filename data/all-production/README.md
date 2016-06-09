# Production on All Lands & Waters
This directory contains raw production volume data from [EIA], and the
associated utilities for reading it into our database.

* The [input directory](input/) contains commodity-specific files containing
  annual production volumes.
* [transform-coal.js](transform-coal.js) is the transformation script for
  coal data. (All of the other commodities require no transformation when
  being read into the database.)
* [rollup.sql](rollup.sql) is the SQL script that summarizes the production
  data and creates state ranking tables.

[EIA]: http://www.eia.gov/
