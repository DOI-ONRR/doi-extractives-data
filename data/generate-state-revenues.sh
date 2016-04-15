#!/bin/bash
./bin/query.js --format ndjson "
    SELECT
      state, product, year,
      ROUND(percent, 1) AS percent,
      ROUND(revenue) AS revenue,
      rank
    FROM state_revenue_rank
    WHERE revenue != 0
    ORDER BY
        state, product, year" \
    | ../node_modules/.bin/nestly --if ndjson \
        -c ../_meta/state_revenues.yml \
        -o ../_data/state_revenues.yml
