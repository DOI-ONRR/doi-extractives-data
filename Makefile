db ?= data.db
db_url ?= sqlite://$(db)

node_bin ?= ./node_modules/.bin/

tables ?= $(node_bin)tables -d $(db_url)
tito ?= $(node_bin)tito
nestly ?= $(node_bin)nestly
sqlite ?= sqlite3 -bail $(db)

query ?= ./data/bin/query.js --db $(db_url)

load-table = $(tables) -i $(1) -n $(2)
load-model = $(call load-table,$(1),$(2)) --config data/db/models/$(2).js
load-sql = echo "-- loading SQL: $(1) --"; cat $(1) | $(sqlite)
drop-table = echo "-- dropping: $(1) --"; $(sqlite) "DROP TABLE IF EXISTS $(1);"

all: db

clean:
	rm -f $(db)

collections/regional: \
	collections/states \
	collections/offshore_areas \
	collections/offshore_regions

collections/states: data/_input/geo/states.csv
	$(tito) -r csv --map 'd => {{id: d.abbr, title: d.name, FIPS: d.FIPS}}' $^ \
		| $(node_bin)to-jekyll-collection --format ndjson -i /dev/stdin -o _states

collections/offshore_areas: data/_input/geo/offshore/areas.tsv
	$(tito) -r tsv --map 'd => {{id: d.id, title: d.name, region: d.region.toLowerCase(), permalink: ["/offshore", d.region.toLowerCase(), d.id, ""].join("/")}}' $^ \
		| $(node_bin)to-jekyll-collection --format ndjson -i /dev/stdin -o _offshore_areas

collections/offshore_regions: data/_input/geo/offshore/regions.tsv
	$(tito) -r tsv --map 'd => {{id: d.id, title: d.region}}' $^ \
		| $(node_bin)to-jekyll-collection --format ndjson -i /dev/stdin -o _offshore_regions

site-data: \
	data/jobs \
	data/revenue \
	data/state_all_production.yml \
	data/national_all_production.yml \
	data/federal_county_production \
	data/federal_disbursements.yml \
	data/state_exports.yml \
	data/national_exports.yml \
	data/state_federal_production.yml \
	data/state_gdp.yml \
	data/national_gdp.yml \
	data/state_revenues.yml \
	data/national_federal_production.yml \
	data/opt_in_state_revenues \
	data/top_state_products


data/state_all_production.yml:
	$(query) --format ndjson " \
		SELECT \
		  state, year, \
		  product, product_name, units, \
		  ROUND(volume) AS volume, \
		  ROUND(percent, 2) AS percent, \
		  rank \
		FROM all_production_state_rank \
		ORDER BY \
			state, product, year" \
	| $(nestly) --if ndjson \
		-c _meta/state_all_production.yml \
		-o _$@

data/national_all_production.yml:
	$(query) --format ndjson " \
		SELECT \
		  year, \
		  product, product_name, units, \
		  ROUND(volume) AS volume \
		FROM all_national_production \
		ORDER BY \
			product, year" \
	| $(nestly) --if ndjson \
		-c _meta/national_all_production.yml \
		-o _$@

data/state_exports.yml:
	$(query) --format ndjson " \
		SELECT \
		  state, year, \
		  ROUND(value, 2) AS dollars, \
		  ROUND(share * 100, 2) AS percent, \
		  commodity \
		FROM exports \
		WHERE \
			state != 'US' \
		ORDER BY state, year" \
		| $(nestly) --if ndjson \
			-c _meta/state_exports.yml \
			-o _$@

data/national_exports.yml:
	$(query) --format ndjson " \
		SELECT \
		  'US' AS state, year, \
		  SUM(ROUND(value, 2)) AS dollars, \
		  commodity \
		FROM exports \
		GROUP BY year, commodity" \
		| $(nestly) --if ndjson \
			-c _meta/national_exports.yml \
			-o _$@


data/state_gdp.yml:
	$(query) --format ndjson " \
		SELECT \
		  region AS state, year, \
		  value AS dollars, \
		  ROUND(share * 100, 2) as percent \
		FROM gdp \
		WHERE \
			region != 'US' \
		ORDER BY state, year" \
		| $(nestly) --if ndjson \
			-c _meta/state_gdp.yml \
			-o _$@

data/national_gdp.yml:
	$(query) --format ndjson " \
		SELECT \
		  region AS state, year, \
		  value AS dollars, \
		  ROUND(share * 100, 2) as percent \
		FROM gdp \
		WHERE \
			region == 'US' \
		ORDER BY state, year" \
		| $(nestly) --if ndjson \
			-c _meta/state_gdp.yml \
			-o _$@

data/jobs: \
	data/state_jobs.yml \
	data/national_jobs.yml \
	data/county_jobs \
	data/state_self_employment.yml \
	data/national_self_employment.yml

data/state_jobs.yml:
	$(query) --format ndjson " \
		SELECT \
		  region_id AS state, year, \
		  extractive_jobs AS jobs, \
		  ROUND(percent, 2) AS percent \
		FROM bls_employment \
		WHERE \
		  region_id IS NOT NULL AND \
		  county IS NOT NULL \
		ORDER BY state, year" \
		| $(nestly) --if ndjson \
			-c _meta/state_jobs.yml \
			-o _$@

data/national_jobs.yml:
	$(query) --format ndjson " \
		SELECT \
		  region_id AS state, year, \
		  extractive_jobs AS jobs, \
		  ROUND(percent, 2) AS percent \
		FROM national_bls_employment \
		WHERE \
		  region_id IS NOT NULL \
		ORDER BY state, year" \
		| $(nestly) --if ndjson \
			-c _meta/national_jobs.yml \
			-o _$@

data/county_jobs:
	$(query) --format ndjson " \
		SELECT \
		  region_id AS state, \
		  fips, \
		  county, \
		  year, \
		  extractive_jobs AS jobs, \
		  ROUND(percent, 2) AS percent \
		FROM bls_employment \
		WHERE \
		  region_id IS NOT NULL AND \
		  county IS NOT NULL \
		ORDER BY state, fips, year" \
		| $(nestly) --if ndjson \
			-c _meta/county_jobs.yml \
			-o '_$@/{state}.yml'

data/state_self_employment.yml:
	$(query) --format ndjson " \
		SELECT \
		  region AS state, year, \
		  jobs, \
		  ROUND(share, 2) AS percent \
		FROM self_employment \
		WHERE \
		  region IS NOT NULL AND \
		  region != 'US' AND \
		  jobs > 0  \
		ORDER BY state, year" \
		| $(nestly) --if ndjson \
			-c _meta/state_jobs.yml \
			-o _$@

data/national_self_employment.yml:
	$(query) --format ndjson " \
		SELECT \
		  region AS state, year, \
		  jobs, \
		  ROUND(share, 2) AS percent \
		FROM self_employment \
		WHERE \
		  region IS NOT NULL AND \
		  region == 'US' \
		ORDER BY state, year" \
		| $(nestly) --if ndjson \
			-c _meta/state_jobs.yml \
			-o _$@

data/revenue: \
	data/national_revenues.yml \
	data/state_revenues.yml \
	data/county_revenue \
	data/state_revenues_by_type.yml \
	data/national_revenues_by_type.yml

data/county_revenue:
	$(query) --format ndjson " \
		SELECT \
		  state, \
		  fips, \
		  county, \
		  year, \
		  ROUND(revenue) AS revenue \
		FROM county_revenue \
		WHERE \
		  state IS NOT NULL AND \
		  county IS NOT NULL \
		ORDER BY state, fips, year" \
		| $(nestly) --if ndjson \
			-c _meta/county_revenue.yml \
			-o '_$@/{state}.yml'

data/federal_disbursements.yml:
	$(query) --format ndjson " \
		SELECT \
		  region, source, fund, year, \
		  ROUND(dollars, 2) AS dollars \
		FROM federal_disbursements \
		WHERE \
		  dollars > 0 \
		ORDER BY dollars DESC" \
		| $(nestly) --if ndjson \
			-c _meta/federal_disbursements.yml \
			-o _$@

data/state_federal_production.yml:
	$(query) --format ndjson " \
		SELECT \
		  state, product, product_name, units, year, \
		  ROUND(volume) AS volume, \
		  ROUND(percent, 2) AS percent, rank \
		FROM federal_production_state_rank \
		ORDER BY \
			state, product, product_name, units, year" \
		| $(nestly) --if ndjson \
			-c _meta/state_federal_production.yml \
			-o _$@


data/national_federal_production.yml:
	$(query) --format ndjson " \
		SELECT \
		  product, product_name, units, year, \
		  ROUND(volume) AS volume \
		FROM federal_national_production \
		WHERE \
		  volume != 0 AND \
		  volume IS NOT NULL \
		ORDER BY \
			product, product_name, units, year" \
		| $(nestly) --if ndjson \
			-c _meta/national_federal_production.yml \
			-o _$@

data/federal_county_production:
	$(query) --format ndjson " \
		SELECT \
		  state, \
		  fips, \
		  county, \
		  year, \
		  product, product_name, units, \
		  ROUND(volume) AS value \
		FROM federal_county_production \
		WHERE \
		  state IS NOT NULL AND \
		  county IS NOT NULL AND \
		  product IS NOT NULL AND \
		  value IS NOT NULL \
		ORDER BY state, fips, year" \
		| $(nestly) --if ndjson \
			-c _meta/county_production.yml \
			-o '_$@/{state}.yml'


data/state_revenues.yml:
	$(query) --format ndjson " \
		SELECT \
		  state, commodity, year, \
		  ROUND(percent, 1) AS percent, \
		  ROUND(revenue) AS revenue, \
		  rank \
		FROM state_revenue_rank \
		WHERE revenue != 0 \
		ORDER BY \
			state, commodity, year" \
		| $(nestly) --if ndjson \
			-c _meta/state_revenues.yml \
			-o _$@

data/national_revenues.yml:
	$(query) --format ndjson " \
		SELECT \
		  commodity, year, \
		  ROUND(revenue) AS revenue \
		FROM national_revenue \
		WHERE revenue != 0 \
		ORDER BY \
			commodity, year" \
		| $(nestly) --if ndjson \
			-c _meta/national_revenues.yml \
			-o _$@

data/state_revenues_by_type.yml:
	$(query) --format ndjson " \
		SELECT \
		  state, commodity, revenue_type, year, \
		  ROUND(revenue) AS revenue \
		FROM state_revenue_type \
		WHERE revenue IS NOT NULL \
		ORDER BY \
			state, revenue DESC, commodity, year" \
		| $(nestly) --if ndjson \
			-c _meta/state_revenues_by_type.yml \
			-o _$@

data/national_revenues_by_type.yml:
	$(query) --format ndjson " \
		SELECT \
		  commodity, revenue_type, year, \
		  ROUND(revenue) AS revenue \
		FROM national_revenue_type \
		WHERE revenue IS NOT NULL \
		ORDER BY \
			revenue DESC, commodity, year" \
		| $(nestly) --if ndjson \
			-c _meta/national_revenues_by_type.yml \
			-o _$@

data/top_state_products:
	# top N states for each product category in each year
	top=3 percent=20; \
	$(query) --format ndjson " \
		SELECT \
		  state, commodity AS product, \
		  NULL AS name, NULL AS units, \
		  ROUND(percent, 2) AS percent, rank, year, \
		  ROUND(revenue, 2) AS value, \
		  revenue AS order_value, \
		  'revenue' AS category \
		FROM state_revenue_rank \
		WHERE rank <= $${top} OR percent >= $${percent} \
	UNION \
		SELECT \
		  state, product, \
		  product_name AS name, units, \
		  ROUND(percent, 2), rank, year, \
		  ROUND(volume, 2) AS value, \
		  (100 - rank) AS order_value, \
		  'federal_production' AS category \
		FROM federal_production_state_rank \
		WHERE (rank <= $${top} OR percent >= $${percent}) \
			AND LENGTH(state) = 2 \
	UNION \
		SELECT \
		  state, product, \
		  product_name AS name, units, \
		  ROUND(percent, 2), rank, year, \
		  ROUND(volume, 2) AS value, \
		  (100 - rank) AS order_value, \
		  'all_production' AS category \
		FROM all_production_state_rank \
		WHERE (rank <= $${top} OR percent >= $${percent}) \
			AND year > 2004 \
	ORDER BY state, year, order_value DESC, percent DESC" \
		| $(nestly) --if ndjson \
			-c _meta/top_state_products.yml \
			-o '_$@/{state}.yml'

data/land_stats.yml:
	$(query) --format ndjson " \
		SELECT \
		  s.state AS state, \
		  COALESCE(state.abbr, 'US') AS region_id, \
		  state_acres, federal_acres, federal_percent \
		FROM land_stats AS s \
		LEFT JOIN states AS state ON \
			state.name = s.state" \
		| $(nestly) --if ndjson \
			-c _meta/land_stats.yml \
			-o _$@

data/opt_in_state_revenues:
	mkdir -p _$@
	$(query) --format ndjson " \
		SELECT \
			state, year, source, dest, dollars \
		FROM opt_in_state_revenues \
		ORDER BY state, year, dollars DESC" \
		| $(nestly) --if ndjson \
			-c _meta/opt_in_state_revenues.yml \
			-o '_$@/{state}.yml'

db: $(db)

$(db): \
	tables/geo \
	tables/revenue \
	tables/federal-production \
	tables/all-production \
	tables/company_revenue \
	tables/jobs \
	tables/self_employment \
	tables/gdp \
	tables/exports \
	tables/disbursements \
	tables/land_stats \
	tables/opt_in_state_revenues

tables/geo: \
	tables/states \
	tables/offshore_planning_areas

tables/states: data/_input/geo/states.csv
	@$(call drop-table,states)
	$(call load-table,$^,states)

tables/offshore_planning_areas: data/_input/geo/offshore/areas.tsv
	@$(call drop-table,offshore_planning_areas)
	$(call load-table,$^,offshore_planning_areas)

tables/revenue: \
	tables/county_revenue
	@$(call drop-table,offshore_revenue)
	$(call load-model,data/_input/onrr/offshore-revenues.tsv,offshore_revenue)
	@$(call load-sql,data/revenue/rollup.sql)

tables/county_revenue: data/revenue/onshore.tsv
	@$(call drop-table,county_revenue)
	# $(call load-model,data/_input/onrr/county-revenues.tsv,county_revenue)
	tmp=$^.ndjson; \
	$(tito) --map ./data/revenue/transform-onshore.js -r tsv $^ > $$tmp && \
	$(tables) -t ndjson -n county_revenue -i $$tmp && \
	rm $$tmp

tables/federal-production: \
	tables/federal_county_production \
	tables/federal_offshore_production
	@$(call load-sql,data/federal-production/rollup.sql)

tables/federal_county_production: data/federal-production/onshore.tsv
	@$(call drop-table,federal_county_production)
	tmp=$^.ndjson; \
	$(tito) --map ./data/federal-production/transform-onshore.js -r tsv $^ > $$tmp && \
	$(tables) -t ndjson -n federal_county_production -i $$tmp && \
	rm $$tmp

tables/federal_offshore_production: data/federal-production/offshore.tsv
	@$(call drop-table,federal_offshore_production)
	tmp=$^.ndjson; \
	$(tito) --map ./data/federal-production/transform-offshore.js -r tsv $^ > $$tmp && \
	$(tables) -t ndjson -n federal_offshore_production -i $$tmp && \
	rm $$tmp

tables/all-production: \
	tables/all_production_coal \
	tables/all_production_oil \
	tables/all_production_naturalgas \
	tables/all_production_renewables
	@$(call load-sql,data/all-production/rollup.sql)

tables/all_production_coal: data/all-production/input/coal-????.tsv
	@$(call drop-table,all_production_coal)
	tmp=data/all-production/input/coal-all.ndjson; \
	for filename in $^; do \
		$(tito) --map ./data/all-production/transform-coal.js -r tsv $$filename >> $$tmp; \
	done; \
	$(tables) -t ndjson -n all_production_coal -i $$tmp; \
	rm $$tmp

tables/all_production_oil: data/all-production/input/oil.tsv
	@$(call drop-table,all_production_oil)
	$(tito) -r tsv --multiple --map ./data/transform/all_production_oil.js $^ \
		| $(tables) -t ndjson -n all_production_oil

tables/all_production_naturalgas:
	@$(call drop-table,all_production_naturalgas)
	$(tito) -r tsv data/all-production/input/naturalgas.tsv \
		--multiple --map ./data/transform/all_production_naturalgas.js \
		| $(tables) -t ndjson -n all_production_naturalgas
	$(tito) -r tsv data/all-production/input/naturalgas2.tsv \
		--multiple --map ./data/transform/all_production_naturalgas2.js \
		| $(tables) -t ndjson -n all_production_naturalgas

tables/all_production_renewables: data/all-production/input/renewables.tsv
	@$(call drop-table,all_production_renewables)
	renewables_tmp=data/all-production/input/renewables.ndjson; \
	$(tito) --multiple --map ./data/transform/all_production_renewables.js -r tsv $^ \
		> $$renewables_tmp; \
	$(tables) -t ndjson -n all_production_renewables -i $$renewables_tmp; \
	rm $$renewables_tmp

tables/company_revenue: data/_input/onrr/company-revenue
	@$(call drop-table,company_revenue)
	for company_filename in $^/????.tsv; do \
		filename="$${company_filename##*/}"; \
		COMPANY_YEAR="$${filename%%.*}" $(tables) \
			-i $$company_filename \
			-n company_revenue \
			--config data/db/models/company_revenue.js; \
	done

tables/jobs: data/_input/bls
	@$(call drop-table,bls_employment)
	for jobs_filename in $^/????/joined.tsv; do \
		$(tables) -i $$jobs_filename -n bls_employment \
			--config data/db/models/bls_employment.js; \
	done
	@$(call load-sql,data/db/rollup-employment.sql)

tables/self_employment: data/jobs/self-employment.tsv
	@$(call drop-table,self_employment)
	$(call load-table,$^,self_employment)
	@$(call load-sql,data/db/rollup-self-employment.sql)

tables/gdp: data/gdp/regional.tsv
	@$(call drop-table,gdp)
	$(call load-table,$^,gdp)

tables/exports: data/state/exports-by-industry.tsv
	@$(call drop-table,exports)
	$(call load-table,$^,exports)

tables/disbursements: \
	tables/federal_disbursements \
	tables/disbursements_historic_preservation
	@$(call load-sql,data/disbursements/rollup.sql)

tables/federal_disbursements: data/disbursements/federal.tsv
	@$(call drop-table,federal_disbursements)
	$(tito) -r tsv --map ./data/disbursements/transform-federal.js $^ \
		| $(tables) -t ndjson -n federal_disbursements

tables/disbursements_historic_preservation: data/disbursements/historic-preservation.tsv
	@$(call drop-table,disbursements_historic_preservation)
	$(tito) -r tsv --multiple \
		--map ./data/disbursements/transform-hpf.js \
		 $^ \
		| $(tables) -t ndjson -n disbursements_historic_preservation

tables/land_stats: data/land-stats/land-stats.tsv
	@$(call drop-table,land_stats)
	$(tito) --map ./data/land-stats/transform.js -r tsv $^ \
		| $(tables) -t ndjson -n land_stats


tables/opt_in_state_revenues: data/state/opt-in/
	@$(call drop-table,opt_in_state_revenues)
	for state_dir in $^??; do \
		STATE=$${state_dir##$^} \
		$(tito) --multiple --map ./data/state/opt-in/revenue-transform.js \
			-r tsv $${state_dir}/revenue-distribution.tsv > $${state_dir}/revenue-distribution.ndjson; \
		$(tables) -t ndjson -n opt_in_state_revenues -i $${state_dir}/revenue-distribution.ndjson; \
		rm $${state_dir}/revenue-distribution.ndjson; \
	done
