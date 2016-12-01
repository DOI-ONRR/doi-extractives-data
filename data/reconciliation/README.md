# Revenue reconciliation

This data details the [reconciliation of federal revenues](https://useiti.doi.gov/how-it-works/reconciliation/)
from 45 countries in the year 2013. It was produced by [Deloitte](http://deloitte.com), the consultant hired by
[Department of the Interior](http://doi.gov) to produce the original US EITI report.

* `input.tsv` is the input data delivered to us from Deloitte.
* `revenue.tsv` is the automatically transformed data suitable for input in our data pipeline.

## Updating
1. Get an updated `input.tsv` file.
1. Run:

  ```sh
  make -B
  ```
  
This will produce an updated `revenue.tsv` file.
