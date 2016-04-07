#!/bin/bash
./bin/query.js --format json "
    SELECT
      region_id AS state, year,
      extractive_jobs AS jobs,
      percent
    FROM bls_employment
    WHERE
      region_id IS NOT NULL AND
      county IS NULL
    ORDER BY state, year" | \
  ../node_modules/.bin/nestly --if json \
      -c ../_meta/state_jobs.yml \
      -o ../_data/state_jobs.yml

./bin/query.js --format json "
    SELECT
      region_id AS state,
      fips,
      county,
      year,
      extractive_jobs AS jobs,
      percent
    FROM bls_employment
    WHERE
      region_id IS NOT NULL AND
      county IS NOT NULL
    ORDER BY state, fips, year" | \
  ../node_modules/.bin/nestly --if json \
      -c ../_meta/county_jobs.yml \
      -o '../_data/county_jobs/{state}.yml'
