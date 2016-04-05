#!/bin/bash
db=data.db
tables=../node_modules/.bin/tables

echo "Dropping: ${db}"
rm -f $db

load() {
    # echo "loading $1 -> $2..."
    $tables -d "sqlite://${db}" --config "db/models/${2}.js" -i $1 -n $2
}

load_sql() {
    cat $1 | sqlite3 $db
}

# lookup tables
$tables -d "sqlite://${db}" -i _input/geo/states.csv -n states
$tables -d "sqlite://${db}" -i _input/geo/offshore/areas.tsv \
    -n offshore_planning_areas

# Federal Revenue
load _input/onrr/county-revenues.tsv county_revenue
# Offshore Revenue
load _input/onrr/offshore-revenues.tsv offshore_revenue
# update revenue rollups
load_sql db/rollup-revenue.sql

# Federal Production
load _input/onrr/regional-production.tsv federal_county_production
# Offshore Production
load _input/onrr/offshore-production.tsv federal_offshore_production
# update production rollups
load_sql db/rollup-federal-production.sql

# output some rows for debugging purposes
./bin/query.js "
    SELECT * FROM national_revenue
    WHERE commodity = 'All'"

# output some rows for debugging purposes
./bin/query.js "
    SELECT * FROM federal_national_production
    WHERE commodity LIKE 'Oil%'"

# company data comes in one file per year; the model definition
# in db/models/company_revenue.js sets the year to $COMPANY_YEAR
for company_filename in _input/onrr/company-revenue/*.tsv; do
    filename=${company_filename##*/}
    COMPANY_YEAR="${filename%%.*}" load $company_filename company_revenue
done

# Bureau of Labor Statistics (BLS) data comes in one file per year, too, but
# each row contains a year
for bls_filename in _input/bls/????/extractives.csv; do
    filename=${bls_filename##*/}
    LABOR_YEAR="${filename%%.*}" load $bls_filename bls_employment
done
