# Production on All Lands & Waters
This directory contains raw production volume data from [EIA], and the
associated utilities for reading it into our database.

* The [commodity directory](commodity/) contains commodity-specific files
  containing annual production volumes.
* To refresh the data in the `commodity` directory, you'll need to set the
  `EIA_API_KEY` environment variable to your [EIA API key], then run:

  ```
  ./update.js
  ```

  To change the range of years that are fetched from the EIA API, change the
  [`start`](./update.js#L17) and [`end`](./update#L18) parameters to the start
  and end years of the desired range.
* There is no transform necessary for these values because they come directly
  from the API. :tada:
* [rollup.sql](rollup.sql) is the SQL script that summarizes the production
  data and creates state ranking tables.

[EIA]: http://www.eia.gov/
[EIA API key]: http://www.eia.gov/opendata/register.cfm
