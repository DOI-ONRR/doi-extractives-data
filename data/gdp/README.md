# GDP

This directory contains data and tools for updating it from the [BEA] [API].

* `US.tsv` contains national-level GDP data by year.
* `regional.tsv` contains state-level GDP data by year.

## Updating the data
1. If you don't have one yet, get an API key from [BEA][API], and set the `BEA_API_KEY` environment variable like so:

  ```sh
  export BEA_API_KEY="your-key-here"
  ```

1. Ensure the year range is set properly in the API [script to get data](https://github.com/ONRR/doi-extractives-data/blob/842b9c54646bd7c3b891a65b8a30bc0d57c85b4e/data/gdp/get-bea-data.js#L15)
   and the [script to get regional data](https://github.com/ONRR/doi-extractives-data/blob/842b9c54646bd7c3b891a65b8a30bc0d57c85b4e/data/gdp/get-bea-regional.js#L8).
   For instance, if you are adding 2017 data, you should change both of these values to `2008-2017`.

2. Next, run:

  ```sh
  make -B
  ```

If all goes well, this will get all the new data from BEA and update the `US.tsv` and `regional.tsv` files.
You can confirm whether any of the data was changed by running:

```sh
git diff .
```

If there is no diff, then none of the data has changed.

[BEA]: http://www.bea.gov/
[API]: http://www.bea.gov/API/
