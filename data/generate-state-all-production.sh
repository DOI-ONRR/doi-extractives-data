#!/bin/bash
./bin/query.js --format json "
    SELECT
      state, product, year,
      ROUND(volume) AS volume,
      rank
    FROM all_production_state_rank
    ORDER BY
        state, product, year" | \
  ../node_modules/.bin/nestly --if json \
      -c ../_meta/state_all_production.yml \
      -o ../_data/state_all_production.yml
