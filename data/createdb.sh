#!/bin/bash
db=data.db

echo "Dropping: ${db}"
rm -f $db

load() {
    # echo "loading $1 -> $2..."
    ../node_modules/.bin/tables -d "sqlite://${db}" --config "db/models/${2}.js" -i $1 -n $2
}

query() {
    # echo "query: ${1}"
    sqlite3 $db "$1"
}

load _input/onrr/county-revenues.tsv county_revenue
load _input/onrr/county-production.tsv county_production
query "
    INSERT INTO county_revenue (year, state, commodity, revenue)
    SELECT year, state, 'All', SUM(revenue)
    FROM county_revenue
    GROUP BY year, state
"
query "
    CREATE VIEW state_revenue AS
    SELECT year, state, commodity, product, SUM(revenue) AS revenue
    FROM county_revenue
    GROUP BY year, state, commodity, product
"
query "
    CREATE VIEW national_revenue AS
    SELECT year, commodity, product, SUM(revenue) AS revenue
    FROM state_revenue
    GROUP BY year, commodity, product
"
./bin/query.js "SELECT * FROM national_revenue WHERE commodity = 'All'"
exit 0

$tables -n county_production -i _input/onrr/county-production.tsv
$tables -n offshore_revenue -i _input/onrr/offshore-revenues.tsv
$tables -n offshore_production -i _input/onrr/offshore-production.tsv

for company_year in _input/onrr/company-revenue/*.tsv; do
    $tables -n company_revenue -i $company_year
done
