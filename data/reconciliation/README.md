# Revenue reconciliation

This data details the [reconciliation of federal revenues](https://useiti.doi.gov/how-it-works/reconciliation/)
from 2013 and 2016. They were produced by [Deloitte](http://deloitte.com), the
consultant hired by [Department of the Interior](http://doi.gov) to produce the
original US EITI report.

For each year (`{year}`), there exists:

* `input/{year}.tsv` is the input data exported from the corresponding Excel file's "Data" table.
* `input/{year}-taxes.tsv` is an _optional_ TSV of corporate tax data from each Excel file's "Taxes Reconciliation Data" table.
* `output/{year}.tsv` is the transformed data ready for use in our data pipeline.

## Updating
1. Update or add the yearly `input/{year}.tsv` file, e.g. `input/2017.tsv`, and
   (optionally) `input/{year}-taxes.tsv`, by exporting as tab-separated values
   from Excel.
1. Run:

  ```sh
  make -B
  ```
  
This should produce a new file, `output/{year}.tsv`. To update the new YAML
data, `cd` back up to the project root and run:

```sh
make -B tables/reconciliation data/reconciliation
```

You should then have either a new or updated file in
`_data/reconciliation/{year}.yml`.
