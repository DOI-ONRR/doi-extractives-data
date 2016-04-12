#!/bin/bash
./bin/query.js --format ndjson "
    SELECT
      state, year,
      ROUND(value, 2) AS dollars,
      ROUND(share * 100, 2) AS percent,
      commodity
    FROM exports
    WHERE
      state != 'US'
  ORDER BY state, year" | \
  ../node_modules/.bin/nestly --if ndjson \
      -c ../_meta/state_exports.yml \
      -o ../_data/state_exports.yml
