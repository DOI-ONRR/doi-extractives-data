#!/bin/bash
./bin/query.js --format json "
    SELECT
      state, product, year,
      ROUND(revenue) AS revenue,
      rank
    FROM state_revenue_rank
    WHERE revenue != 0
    ORDER BY
        state, product, year" \
    | ../node_modules/.bin/nestly --if json \
        -c ../_meta/state_revenues.yml \
        -o ../_data/state_revenues.yml
