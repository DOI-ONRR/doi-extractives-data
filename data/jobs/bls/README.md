# Bureau of Labor Statistics (BLS)
This directory contains wage and salary employment data from the [BLS] that is
the result of joining two different data sets for each year listed in the
[Makefile](Makefile#L1). Here's the process:

1. The `Makefile` handles downloading all of the years of data from [this
   archive](http://www.bls.gov/cew/datatoc.htm) and copying the relevant files
   from each zip to the annual directory. You can re-run this process with:

   ```sh
   make years
   ```

   This produces one directory per year, each with one file, `joined.tsv`, and
   a directory of intermediary TSVs for different commodities and groupings,
   which are described in [commodities.yml](#commodities-yml).

   **Note that the zip files from BLS are big (over 100MB in some cases), so
   downloading may take a long time when you first run `make`**

1. The [load script](load.js) loops over an intermediary directory of unzipped
   CSVs, picks the relevant ones by [NAICS code] from
   [commodities.yml](#commodities-yml), and combines them all to produce a
   single TSV for all of the data in a single year.

## Updating
To update this data:

1. Update the list of years in the [Makefile](Makefile#L1).
1. Run:

  ```
  make years join
  ```

Then, update the database and generate new site data:

```sh
# cd back to the project root directory
cd ../../..
make tables/jobs data/jobs
```

When this is done, you should see a diff in `_data/*_jobs.yml` and
`data/county_jobs/*.yml`.

[BLS]: http://www.bls.gov/
