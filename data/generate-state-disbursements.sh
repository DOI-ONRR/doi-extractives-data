#!/bin/bash
./bin/query.js --format ndjson "
    SELECT
        state, source, fund, year,
        ROUND(dollars, 2) AS dollars
    FROM state_disbursements
    WHERE dollars > 0
    ORDER BY state, source, fund, year
    " | \
  ../node_modules/.bin/nestly --if ndjson \
      -c ../_meta/state_disbursements.yml \
      -o ../_data/state_disbursements.yml
