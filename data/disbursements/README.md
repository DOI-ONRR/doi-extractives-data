# Federal disbursements

This directory contains data concerning federal revenue disbursements
to various federal and state entities such as parks and conservation funds.
This data was provided to 18F by the [Department of the Interior][DOI].

* `county-level.tsv` details all federal disbursements from 2012 to 2017,
  by state or fund, county within states, and includes [Historic
  Preservation Fund][HPF] disbursements. This is the main disbursements file
  received from ONNR.
* `historic-preservation.tsv` more specifically details disbursements to
  the [Historic Preservation Fund (HPF)][HPF], organized by year and state.
* The [lwcf directory](lwcf/) contains more specific data about the
  [Land and Water Conservation Fund (LWCF)][LWCF]. See that directory's
  [README](lwcf/#readme) for more information.

There are a few scripts and temporary files for transforming the source
county-level, historic preservation and lwcf data to be used by the site:

* `rollup.sql` is a sql script that removes and adds back tables for national
   and all disbursement data. It mainly processes the `federal_disbursements`
   table to create these two new tables. This shouldn't need to be edited during
   data updates.
* `federal-pivot.tsv` is a generated file that pulls in different values for
   the total disbursements added up. This only needs to be updated if data
   tests fail. See [Create pivotal table](https://github.com/18F/doi-extractives-data/blob/dev/data/Create-pivot-table.md) for more information.
* `tranform-*.js` all transform parts of the information, such as column names.
   They do not need to be edited for data updates.

[HPF]: http://ncshpo.org/issues/historic-preservation-fund/
[DOI]: https://www.doi.gov/
[ONRR]: https://www.onrr.gov/
[LWCF]: https://www.nps.gov/subjects/lwcf/index.htm
