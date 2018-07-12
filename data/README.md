# NRRD data
This directory contains all of the input data, scripts for parsing and
transforming them, and the resulting ["output" files in the _data directory](_data/). These tools also use
[Node](https://nodejs.org/), and the dependencies are managed with
[npm](https://www.npmjs.com/) in the parent directory's
[package.json](../package.json).

If you have not run the data scripts before, you'll need to start by creating a local `sqlite` database:

1. `make db`

To update the data that powers the site:

1. Replace a dataset's "input" .tsv file
2. Update the sqlite tables and update the `.yml` files in `_data`:
```sh
make site-data
```

## Handling CSVs and TSVs
Much of the data that we encounter is made available to us as a Microsoft Excel document. If this is the case, the most reliable way to convert this data to a functional .tsv is as follows:
1. "Save as" a .csv file
2. Convert that file to a .tsv using the `scripts/csv_tsv.rb` ruby script:
```
ruby scripts/csv_tsv.rb path/to/csv.csv /path/to/new/tsv.tsv
```

**Note**: One dataset, company revenue, is handled directly as a tsv. To update this dataset, [follow these directions](https://github.com/onrr/doi-extractives-data/tree/master/data/company-revenue) instead.

Check out the [Makefile](Makefile) and the [bin directory](bin/) if you want to
see how the sausage is made.

## Tests
To run the tests, make sure the dev dependencies are installed from the parent
directory:

```sh
cd ..
npm install --dev
```

Then, in this directory, run:

```sh
npm test
```

**Note**: If the tests fail, it is likely that you will need to update the pivot table (generally a file prefixed with `pivot-`) for that data. Read instructions on [creating a pivot table](Create-pivot-table.md).

See [this issue](https://github.com/onrr/doi-extractives-data/issues/493) for
some background on what we're aiming to do here. Progress on importing all of
the data we need is tracked in
[this issue](https://github.com/onrr/doi-extractives-data/issues/496).
