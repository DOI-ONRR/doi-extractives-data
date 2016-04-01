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


###
# Federal Revenue
###
# load revenue by county
load _input/onrr/county-revenues.tsv county_revenue
# create "all commodity" rows by county
query "
    INSERT INTO county_revenue
        (year, state, county, fips, commodity, revenue)
    SELECT
        year, state, county, fips, 'All', SUM(revenue)
    FROM county_revenue
    GROUP BY
        year, state, county, fips"
# create state_revenue as a view on county revenue
query "
    CREATE VIEW state_revenue AS
    SELECT year, state, commodity, product, SUM(revenue) AS revenue
    FROM county_revenue
    GROUP BY year, state, commodity, product"

###
# Federal Production
###
# load production by county
load _input/onrr/county-production.tsv county_production
# create state rollups
query "
    CREATE VIEW state_production AS
    SELECT year, state, commodity, product, SUM(volume) AS volume
    FROM county_production
    GROUP BY year, state, commodity, product"
# create national rollups
query "
    CREATE VIEW national_production AS
    SELECT year, commodity, product, SUM(volume) AS volume
    FROM state_production
    GROUP BY year, commodity, product"

# output some rows for debugging purposes
./bin/query.js "
    SELECT * FROM national_production
    WHERE commodity LIKE 'Oil%'"

###
# Offshore Revenue
###
# load revenue by offshore region and area
load _input/onrr/offshore-revenues.tsv offshore_revenue

# create "all commodity" rows by region
query "
    INSERT INTO offshore_revenue
        (year, region, planning_area, offshore_area, protraction, commodity, revenue)
    SELECT
        year, region, planning_area, offshore_area, protraction, 'All', SUM(revenue)
    FROM offshore_revenue
    GROUP BY
        year, region, planning_area, offshore_area, protraction"

# create regional_revenue as an aggregate view on state_revenue and
# offshore_revenue
query "
    CREATE VIEW regional_revenue AS
    SELECT year, commodity, product, SUM(revenue) AS revenue
    FROM state_revenue
    GROUP BY year, commodity, product
    UNION
    SELECT year, commodity, product, SUM(revenue) AS revenue
    FROM offshore_revenue
    GROUP BY year, commodity, product"
# then create national_revenue as an aggregate view on regional_revenue
query "
    CREATE VIEW national_revenue AS
    SELECT year, commodity, product, SUM(revenue) AS revenue
    FROM regional_revenue
    GROUP BY year, commodity, product"

# output some rows for debugging purposes
./bin/query.js "SELECT * FROM national_revenue WHERE commodity = 'All'"

exit 0

load _input/onrr/offshore-production.tsv offshore_production

for company_year in _input/onrr/company-revenue/*.tsv; do
    $tables -n company_revenue -i $company_year
done
