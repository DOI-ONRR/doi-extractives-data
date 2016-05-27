# Data tests
These are unit tests for our site data, specifically the YAML and other files
in the [_data directory](../../_data) used by
[Jekyll](https://jekyllrb.com/docs/datafiles/). The goal of these tests is
to ensure the integrity of the data as it moves from Excel or Google
spreadsheets to delimited text files, our intermediate SQLite database, and
eventually into structured data files for use in our Jekyll templates.

So far we have:

* [Federal revenue](revenue.js) tests that compare our state-level data with
  a [pivot table](../../data/revenue/pivot.tsv) provided by ONRR.
