#!/bin/bash
# top N states for each product category in each year
top=10
# minimum percent of nation-wide total
percent=10
./bin/query.js --format json "
    SELECT
        state, product, percent, rank, year,
        'revenue' AS category
    FROM state_revenue_rank
    WHERE rank <= ${top} AND percent > ${percent}
UNION
    SELECT
        state, product, percent, rank, year,
        'federal_production' AS category
    FROM federal_production_state_rank
    WHERE rank <= ${top} AND percent > ${percent}
        AND LENGTH(state) = 2
UNION
    SELECT
        state, product, percent, rank, year,
        'all_production' AS category
    FROM all_production_state_rank
    WHERE rank <= ${top} AND percent > ${percent}
ORDER BY state, year, rank, percent DESC
    " | ../node_modules/.bin/nestly --if json \
        -c ../_meta/top_state_products.yml \
        -o '../_data/top_state_products/{state}.yml'
