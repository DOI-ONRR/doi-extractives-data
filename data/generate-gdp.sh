#!/bin/bash
./bin/query.js --format ndjson "
    SELECT
      region AS state, year,
      value AS dollars,
      ROUND(share * 100, 2) as percent
    FROM gdp
    WHERE
      region != 'US'
    ORDER BY state, year" | \
  ../node_modules/.bin/nestly --if ndjson \
      -c ../_meta/state_gdp.yml \
      -o ../_data/state_gdp.yml
