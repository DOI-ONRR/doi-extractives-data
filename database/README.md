Hasura with docker compose

https://docs.hasura.io/1.0/graphql/manual/getting-started/docker-simple.html

the docker-compose.yaml contains the specifics for getting hasura up and running.  It specifies the database volume to be outside the repo directory ($PWD/../../volumes) as the volume gets set up with permisions that doesn't allow git to store.  In addition we wouldn't want to store the volume anyway.

The database is accessible via port 5433:

psql -h localhost -p 5433 -U postgres onrr_db


To create the database:

node create.db.js

To load the database:

node load.db.js ../../downloads/csv/revenue/monthly_revenue.csv
node load.db.js ../../downloads/csv/revenue/fiscal_year_revenue.csv 


