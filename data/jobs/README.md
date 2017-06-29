# Employment data

This directory contains **self-employment jobs data** related to
natural resource extraction. For **wage and salary data**, see the
[bls subdirectory](bls/).

* `self-employment.tsv` contains state-level self-employment figures
  by year.

## Updating the data

1. If you don't have one yet, get an API key from [BEA API][API],
   and set the `BEA_API_KEY` environment variable like so:

  ```sh
  export BEA_API_KEY="your-key-here"
  ```

1. Ensure that the year range is set properly in the API script
   [here](get-bea-jobs.js#L11).  For instance, if you are adding
   2015 data (which was still not released as of November, 2016),
   you should change both of the value to `2006-2015`.

1. Next, run:

  ```sh
  make -B
  ```

If all goes well, this will get all the new data from BEA and update
`self-employment.tsv`. You can confirm whether any of the data was
changed by running:

```sh
git diff .
```

If there is no diff, then none of the data has changed.

[BEA]: http://www.bea.gov/
[API]: http://www.bea.gov/API/
