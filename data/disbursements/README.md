# Federal disbursements

This directory contains data concerning federal revenue disbursements
to various federal and state entities such as parks and conservation funds.
This data comes from the [Department of the Interior][DOI].

* `county-level.tsv` details all federal disbursements from 2012 to 2017,
  by state or fund, county within states, and includes [Historic
  Preservation Fund][HPF] disbursements. This is the main disbursements file
  received from the Office of Natural Resources Revenue.
* `historic-preservation.tsv` more specifically details disbursements to
  the [Historic Preservation Fund (HPF)][HPF], organized by year and state.
* The [`lwcf directory`](lwcf/) contains more specific data about the
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
   tests fail. See [Create pivotal table](https://github.com/ONRR/doi-extractives-data/blob/dev/data/Create-pivot-table.md) for more information.
* `tranform-*.js` all transform parts of the information, such as column names.
   They do not need to be edited for data updates.

### To update data:

1. Update `county-level.tsv`, `historic-preservation.tsv` and/or `lwcf` data
   with updated tsv data from ONNR.
2. Ensure the column headers stay the same.
3. Run `make data/disbursements`
4. Ensure the `_data/federal_disbursements.yml` file changed after the make
command runs.

[HPF]: http://ncshpo.org/issues/historic-preservation-fund/
[DOI]: https://www.doi.gov/
[ONRR]: https://www.onrr.gov/
[LWCF]: https://www.nps.gov/subjects/lwcf/index.htm
