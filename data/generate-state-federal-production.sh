#!/bin/bash
./bin/query.js --format json "
    SELECT
      state, product, year, ROUND(volume) AS volume
    FROM federal_state_production
    ORDER BY state, product, year" | \
  ../node_modules/.bin/nestly --if json \
      -c ../_meta/state_federal_production.yml \
      -o ../_data/state_federal_production.yml
