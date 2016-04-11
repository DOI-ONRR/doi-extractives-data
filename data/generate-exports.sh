#!/bin/bash
./bin/query.js --format json "
    SELECT
      state, year,
      value AS dollars,
      round(share * 100, 1) AS percent,
      commodity
    FROM exports
    WHERE
      state != 'US'
  ORDER BY state, year" | \
  ../node_modules/.bin/nestly --if json \
      -c ../_meta/state_exports.yml \
      -o ../_data/state_exports.yml
