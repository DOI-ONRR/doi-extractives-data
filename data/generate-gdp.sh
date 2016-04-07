#!/bin/bash
./bin/query.js --format json "
    SELECT
      region AS state, year,
      value AS dollars,
      round(share * 100, 1) as percent
    FROM gdp
    WHERE
      region != 'US'
    ORDER BY state, year" | \
  ../node_modules/.bin/nestly --if json \
      -c ../_meta/state_gdp.yml \
      -o ../_data/state_gdp.yml
