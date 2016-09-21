# Bureau of Labor Statistics (BLS)
This directory contains data from the BLS that's the result of joining two
different data sets for each year listed in the [Makefile](Makefile#L1).
Here's the process:

1. The `Makefile` handles downloading all of the years of data from [this
   archive](http://www.bls.gov/cew/datatoc.htm) and copying the relevant
   files from each zip to the annual directory. You can re-run this process
   with:

   ```sh
   make years
   ```

   This produces one directory per year, each with two files:

  * `all.csv` contains total annual employment at both the state and
    county level for all industries.
  * `extractives.csv` is similarly structured, but contains employment
    figures for "Mining, quarrying, and oil and gas extraction" at the
    state and county levels.

  **Note** that the zip files from BLS are big (over 100MB in some cases),
  so downloading may take a long time when getting

1. The [join script](join.js) loops over the annual directories and joins
   the `all.csv` and `extractives.csv` files in each, producing an
   `joined.tsv` for each year that _should_ contain one row for each state
   and county with data that details the number of of extractives jobs in
   the `Jobs` column, the `Total` number of jobs in all industries, and the
   `Share` expressed as a fraction: `Jobs / Total`.

   You can join one or more years individually by running, for example:

   ```sh
   ./join.js 2014 2015
   ```

   Or, to join them all:

   ```sh
   make join
   ```

## Updating
To update this data:

1. Update the list of years in the [Makefile](Makefile#L1).
1. Run:

  ```
  make years join
  ```

To then update the database and generate new site data:

```sh
# cd back to the project root directory
cd ../../..
make tables/jobs data/jobs
```

When this is done, you should see a diff in `_data/*_jobs.yml` and
`data/county_jobs/*.yml`.
