#!/bin/bash
db=data.db
db_url="sqlite://${db}"
tables=../node_modules/.bin/tables
tito=../node_modules/.bin/tito

echo "Dropping: ${db}"
rm -f $db

load() {
    # echo "loading $1 -> $2..."
    $tables -d $db_url --config "db/models/${2}.js" -i $1 -n $2
}

load_sql() {
    cat $1 | sqlite3 $db
}


# lookup tables
$tables -d $db_url -i _input/geo/states.csv -n states
$tables -d $db_url -i _input/geo/offshore/areas.tsv \
    -n offshore_planning_areas

# Federal Production
load _input/onrr/regional-production.tsv federal_county_production
# Offshore Production
load _input/onrr/offshore-production.tsv federal_offshore_production
# update production rollups
load_sql db/rollup-federal-production.sql

# All Lands Production: Coal
# FIXME: this shouldn't need a model anymore; we should be able to
# do this with a streaming transform
load _input/eia/commodity/coal.tsv all_production_coal

# All Lands Production: Oil
$tito --multiple --map ./transform/all_production_oil.js \
    -r tsv _input/eia/commodity/oil.tsv \
    | $tables -t ndjson -d $db_url -n all_production_oil

# All Lands Production: Natural Gas (part 1)
$tito --multiple --map ./transform/all_production_naturalgas.js \
    -r tsv _input/eia/commodity/naturalgas.tsv \
    | $tables -t ndjson -d $db_url -n all_production_naturalgas

# All Lands Production: Natural Gas (part 2)
$tito --multiple --map ./transform/all_production_naturalgas2.js \
    -r tsv _input/eia/commodity/naturalgas2.tsv \
    | $tables -t ndjson -d $db_url -n all_production_naturalgas

# All Lands Production: Renewables
# XXX I ended up having to write to a temp file here for some reason;
# streaming this right into tables should work...
renewables_tmp=_input/eia/commodity/renewables.ndjson
$tito --multiple --map ./transform/all_production_renewables.js \
    -r tsv _input/eia/commodity/renewables.tsv > $renewables_tmp
$tables -t ndjson -d $db_url -n all_production_renewables -i $renewables_tmp
rm $renewables_tmp

load_sql db/rollup-all-production.sql

# output some rows for debugging purposes
./bin/query.js "
    SELECT * FROM all_national_production
    WHERE year = 2013"

# Federal Revenue
load _input/onrr/county-revenues.tsv county_revenue
# Offshore Revenue
load _input/onrr/offshore-revenues.tsv offshore_revenue
# update revenue rollups
load_sql db/rollup-revenue.sql

# output some rows for debugging purposes
./bin/query.js "
    SELECT * FROM national_revenue
    WHERE commodity = 'All'"

# output some rows for debugging purposes
./bin/query.js "
    SELECT * FROM federal_national_production
    WHERE product LIKE 'Oil%'"

# company data comes in one file per year; the model definition
# in db/models/company_revenue.js sets the year to $COMPANY_YEAR
for company_filename in _input/onrr/company-revenue/????.tsv; do
    filename=${company_filename##*/}
    COMPANY_YEAR="${filename%%.*}" load $company_filename company_revenue
done

# Bureau of Labor Statistics (BLS) data comes in one file per year, too, but
# each row contains a year
for jobs_filename in _input/bls/????/joined.tsv; do
    load $jobs_filename bls_employment
done
load_sql db/rollup-employment.sql

# Load GDP table
$tables -d $db_url -i gdp/regional.tsv -n gdp

# Load exports table
$tables -d $db_url -i state/exports-by-industry.tsv -n exports

# Disbursements
$tito --read tsv _input/onrr/disbursements/state.tsv \
    --filter State \
    --map ./_input/onrr/disbursements/state.js \
    | $tables -t ndjson -d $db_url -n state_disbursements
load_sql db/rollup-state-disbursements.sql
