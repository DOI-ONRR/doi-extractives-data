# Federal revenue by company

This directory contains data about federal revenue by company from the [Office of Natural Resource Revenue (ONRR)][ONRR].
The data is organized in the `input` directory by year, and you can update the corresponding files in the `output`
directory by running:

```sh
make
```

When we receive 2016 data, for instance, we will export a tab-separated values file from Excel (or Google Sheets), place
it into the `input` directory, then run `make` to produce `output/2016.tsv`.

[ONRR]: https://www.onrr.gov/
