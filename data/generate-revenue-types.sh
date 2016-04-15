#!/bin/bash
./bin/query.js --format ndjson "
    SELECT
        state, year, revenue_type,
        ROUND(SUM(revenue)) AS revenue
    FROM county_revenue
    WHERE revenue_type IS NOT NULL
    GROUP BY
        state, revenue_type, year
    ORDER BY
        state, revenue_type, year" \
    | ../node_modules/.bin/nestly --if ndjson \
        -c ../_meta/revenue_types.yml \
        -o ../_data/revenue_types.yml


