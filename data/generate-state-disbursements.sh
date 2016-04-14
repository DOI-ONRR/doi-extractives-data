#!/bin/bash
./bin/query.js --format ndjson "
    SELECT
        state, source, fund, year,
        ROUND(dollars, 2) AS dollars
    FROM all_disbursements
    WHERE
        LENGTH(state) = 2 AND
        source IS NOT NULL AND
        dollars > 0
    ORDER BY state, source, fund, year
    " | \
  ../node_modules/.bin/nestly --if ndjson \
      -c ../_meta/state_disbursements.yml \
      -o ../_data/state_disbursements.yml
