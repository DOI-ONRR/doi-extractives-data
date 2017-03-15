db ?= .data.db
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

collections/states: data/geo/input/states.csv
	$(tito) -r csv --map 'd => {{id: d.abbr, title: d.name, FIPS: d.FIPS}}' $^ \
		| $(node_bin)to-jekyll-collection --format ndjson -i /dev/stdin -o _states

collections/offshore_areas: data/geo/input/offshore/areas.tsv
	$(tito) -r tsv --map 'd => {{id: d.id, title: d.name, region: d.region.toLowerCase(), permalink: ["/offshore", d.region.toLowerCase(), d.id, ""].join("/")}}' $^ \
		| $(node_bin)to-jekyll-collection --format ndjson -i /dev/stdin -o _offshore_areas

collections/offshore_regions: data/geo/input/offshore/regions.tsv
	$(tito) -r tsv --map 'd => {{id: d.id, title: d.region}}' $^ \
		| $(node_bin)to-jekyll-collection --format ndjson -i /dev/stdin -o _offshore_regions

site-data: \
	data/jobs \
	data/revenue \
	data/all_production \
	data/federal_production \
	data/exports \
	data/top_state_products \
	data/offshore_federal_production

data/all_production: tables/all_production \
	data/national_all_production.yml \
	data/state_all_production.yml

data/state_all_production.yml:
	$(query) --format ndjson " \
		SELECT \
			state, year, \
			product, units, \
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
			product, units, \
			ROUND(volume) AS volume \
		FROM all_national_production \
		ORDER BY \
			product, year" \
	| $(nestly) --if ndjson \
		-c _meta/national_all_production.yml \
		-o _$@

data/exports: \
	data/state_exports.yml \
	data/national_exports.yml

data/state_exports.yml:
	$(query) --format ndjson " \
		SELECT \
			state, year, commodity, \
			ROUND(SUM(value), 2) AS dollars \
		FROM exports \
		GROUP BY state, year, commodity \
		ORDER BY state, year, dollars DESC \
		" | $(nestly) --if ndjson \
			-c _meta/state_exports.yml \
			-o _$@

data/national_exports.yml:
	$(query) --format ndjson " \
		SELECT \
			'US' AS state, year, \
			ROUND(SUM(value), 2) AS dollars, \
			commodity \
		FROM exports \
		WHERE \
			commodity = 'Total' \
		GROUP BY year, commodity" \
		| $(nestly) --if ndjson \
			-c _meta/national_exports.yml \
			-o _$@

data/gdp: tables/gdp \
	data/state_gdp.yml \
	data/national_gdp.yml

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
		FROM state_bls_employment \
		WHERE \
			region_id IS NOT NULL \
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
			SUBSTR('0' || fips, -5, 5) AS fips, \
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
			region != 'US' \
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
			region == 'US' \
		ORDER BY state, year" \
		| $(nestly) --if ndjson \
			-c _meta/state_jobs.yml \
			-o _$@

data/tribal_revenue.yml:
	$(query) --format ndjson " \
		SELECT \
			year, commodity, revenue_type, \
			ROUND(SUM(revenue), 2) AS revenue \
		FROM tribal_revenue \
		GROUP BY year, commodity, revenue_type \
		ORDER BY year, revenue DESC" \
		| $(nestly) --if ndjson \
			-c _meta/tribal_revenue.yml \
			-o _$@

data/revenue: \
	data/county_revenue \
	data/national_revenues.yml \
	data/national_revenues_by_type.yml \
	data/opt_in_state_revenues \
	data/state_revenues.yml \
	data/state_revenues_by_type.yml \
	data/offshore_revenue_areas \
	data/offshore_revenue_regions.yml \
	data/offshore_revenues_by_type.yml \
	data/reconciliation.yml \
	data/tribal_revenue.yml

data/county_revenue:
	$(query) --format ndjson " \
		SELECT \
			state, \
			SUBSTR('0' || fips, -5, 5) AS fips, \
			county, \
			year, \
			ROUND(revenue) AS revenue \
		FROM county_revenue \
		WHERE \
			state IS NOT NULL AND \
			county IS NOT NULL AND \
			revenue_type = 'All' \
		ORDER BY state, fips, year" \
		| $(nestly) --if ndjson \
			-c _meta/county_revenue.yml \
			-o '_$@/{state}.yml'

data/disbursements: \
	data/federal_disbursements.yml

data/federal_disbursements.yml:
	$(query) --format ndjson " \
		SELECT \
			region, source, fund, year, \
			ROUND(SUM(dollars), 2) AS dollars \
		FROM federal_disbursements \
		WHERE \
			dollars > 0 \
		GROUP BY region, source, fund, year \
		ORDER BY year, dollars DESC, fund" \
		| $(nestly) --if ndjson \
			-c _meta/federal_disbursements.yml \
			-o _$@

data/federal_production: \
	data/federal_county_production \
	data/national_federal_production.yml \
	data/state_federal_production.yml

data/offshore_federal_production: \
	data/offshore_federal_production_areas \
	data/offshore_federal_production_regions.yml

data/state_federal_production.yml:
	$(query) --format ndjson " \
		SELECT \
			state, product, product_name, units, year, \
			ROUND(volume) AS volume, \
			CASE \
				WHEN volume IS NULL \
				THEN null \
				ELSE ROUND(volume) \
			END AS volume, \
			ROUND(percent, 2) AS percent, rank \
		FROM federal_production_state_rank \
		WHERE \
			state != 'Withheld' \
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
			product IS NOT NULL \
		ORDER BY \
			product, product_name, units, year" \
		| $(nestly) --if ndjson \
			-c _meta/national_federal_production.yml \
			-o _$@

data/offshore_federal_production_regions.yml:
	$(query) --format ndjson " \
		SELECT \
			year, region_id, \
			product, product_name, units, \
			ROUND(volume) AS volume \
		FROM federal_offshore_region_production \
		ORDER BY \
			region_id, product, product_name, units, year" \
		| $(nestly) --if ndjson \
			-c _meta/offshore_federal_production_regions.yml \
			-o _$@

data/offshore_federal_production_areas:
	$(query) --format ndjson " \
		SELECT \
			year, \
			region_id, \
			area_id, \
			area_name, \
			product, product_name, units, \
			ROUND(volume) AS volume \
		FROM federal_offshore_area_production \
		WHERE \
			region_id IS NOT NULL \
		ORDER BY \
			region_id, \
			area_id, year" \
		| $(nestly) --if ndjson \
			-c _meta/offshore_federal_production_areas.yml \
			-o '_$@/{region_id}.yml'

data/federal_county_production:
	$(query) --format ndjson " \
		SELECT \
			state, \
			SUBSTR('0' || fips, -5, 5) AS fips, \
			county, \
			year, \
			product, product_name, units, \
			ROUND(volume) AS value \
		FROM federal_county_production \
		WHERE \
			state IS NOT NULL AND \
			fips IS NOT NULL AND \
			state != 'Withheld' AND \
			county IS NOT NULL AND \
			product IS NOT NULL \
		ORDER BY state, fips, year" \
		| $(nestly) --if ndjson \
			-c _meta/county_production.yml \
			-o '_$@/{state}.yml'


data/state_revenues.yml:
	$(query) --format ndjson " \
		SELECT \
			state, commodity, year, \
			CASE \
				WHEN revenue >= 0 THEN ROUND(percent, 1) \
				ELSE NULL \
			END AS percent, \
			ROUND(revenue) AS revenue, \
			rank \
		FROM state_revenue_rank \
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
		WHERE year IS NOT NULL \
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

data/offshore_revenues_by_type.yml:
	$(query) --format ndjson " \
		SELECT \
			region_id, commodity, revenue_type, year, \
			ROUND(revenue) AS revenue \
		FROM offshore_region_revenue_type \
		WHERE revenue IS NOT NULL \
		ORDER BY \
			region_id, revenue DESC, commodity, year" \
		| $(nestly) --if ndjson \
			-c _meta/offshore_revenues_by_type.yml \
			-o _$@

data/reconciliation:
	$(query) --format ndjson " \
		SELECT \
			year, company, revenue_type, \
			reported_gov, reported_company, reported_note, \
			variance_dollars, variance_percent, variance_material \
		FROM reconciliation \
		ORDER BY reported_gov DESC, company, revenue_type" \
		| $(nestly) --if ndjson \
			-c _meta/reconciliation.yml \
			-o '_$@/{year}.yml'

data/offshore_revenue_regions.yml:
	$(query) --format ndjson " \
		SELECT \
			commodity, year, \
			region_id, \
			ROUND(revenue) AS revenue \
		FROM offshore_region_revenue \
		WHERE revenue IS NOT NULL \
		ORDER BY \
			revenue DESC, commodity, year" \
		| $(nestly) --if ndjson \
			-c _meta/offshore_revenue_regions.yml \
			-o _$@

data/offshore_revenue_areas:
	$(query) --format ndjson " \
		SELECT \
			commodity, year, \
			region_id, area_id, area_name, \
			ROUND(revenue) AS revenue \
		FROM offshore_area_revenue \
		WHERE revenue IS NOT NULL \
		ORDER BY \
			revenue DESC, commodity, year" \
		| $(nestly) --if ndjson \
			-c _meta/offshore_revenue_areas.yml \
			-o '_$@/{region_id}.yml'

data/top_state_products:
	# top N states for each product category in each year
	top=5 percent=20; \
	$(query) --format ndjson " \
		SELECT \
			state, commodity AS product, \
			NULL AS name, NULL AS units, \
			CASE \
				WHEN revenue >= 0 THEN ROUND(percent, 1) \
				ELSE NULL \
			END AS percent, \
			rank, year, \
			ROUND(revenue, 2) AS value, \
			revenue AS order_value, \
			'revenue' AS category \
		FROM state_revenue_rank \
		WHERE rank <= $${top} \
	UNION \
		SELECT \
			state, product, \
			product_name AS name, units, \
			ROUND(percent, 2) AS percent, rank, year, \
			ROUND(volume, 2) AS value, \
			(100 - rank) AS order_value, \
			'federal_production' AS category \
		FROM federal_production_state_rank \
		WHERE (rank <= $${top}) \
			AND LENGTH(state) = 2 \
	UNION \
		SELECT \
			state, product, \
			product AS name, units, \
			ROUND(percent, 2) AS percent, rank, year, \
			ROUND(volume, 2) AS value, \
			(100 - rank) AS order_value, \
			'all_production' AS category \
		FROM all_production_state_rank \
		WHERE (rank <= $${top}) \
			AND year > 2004 \
	ORDER BY \
		category, state, year, \
		order_value DESC, percent DESC" \
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
			state, year, source, dest, \
			ROUND(dollars) AS dollars \
		FROM opt_in_state_revenues \
		ORDER BY \
			state, year, dollars DESC" \
		| $(nestly) --if ndjson \
			-c _meta/opt_in_state_revenues.yml \
			-o '_$@/{state}.yml'

db: $(db)

$(db): \
	tables/geo \
	tables/revenue \
	tables/federal_production \
	tables/all_production \
	tables/company_revenue \
	tables/jobs \
	tables/gdp \
	tables/exports \
	tables/disbursements \
	tables/land_stats \
	tables/opt_in_state_revenues

tables/geo: \
	tables/states \
	tables/offshore_regions \
	tables/offshore_planning_areas

tables/states: data/geo/input/states.csv
	@$(call drop-table,states)
	$(call load-table,$^,states)

tables/offshore_regions: data/geo/input/offshore/regions.tsv
	@$(call drop-table,offshore_regions)
	$(call load-table,$^,offshore_regions)

tables/offshore_planning_areas: data/geo/input/offshore/areas.tsv
	@$(call drop-table,offshore_planning_areas)
	$(call load-table,$^,offshore_planning_areas)

tables/revenue: \
	tables/county_revenue \
	tables/offshore_revenue \
	tables/reconciliation \
	tables/civil_penalties_revenue
	@$(call load-sql,data/revenue/rollup.sql)

tables/offshore_revenue: data/revenue/offshore.tsv
	@$(call drop-table,offshore_revenue)
	tmp=$^.ndjson; \
	$(tito) -r tsv --map ./data/revenue/transform-offshore.js \
		$^ > $$tmp && \
	$(tables) -i $$tmp -t ndjson -n offshore_revenue && \
	rm $$tmp

tables/county_revenue: data/revenue/onshore.tsv
	@$(call drop-table,county_revenue)
	tmp=$^.ndjson; \
	$(tito) --map ./data/revenue/transform-onshore.js -r tsv $^ > $$tmp && \
	$(tables) -t ndjson -n county_revenue -i $$tmp && \
	rm $$tmp

tables/reconciliation: data/reconciliation/output
	@$(call drop-table,reconciliation)
	tmp=$^/all.ndjson; \
	for revenue_filename in $^/????.tsv; do \
		$(tito) -r tsv --map ./data/reconciliation/transform.js \
			$$revenue_filename >> $$tmp; \
	done; \
	$(tables) -i $$tmp -t ndjson -n reconciliation && \
	rm $$tmp

tables/civil_penalties_revenue: data/revenue/civil-penalties.tsv
	@$(call drop-table,civil_penalties_revenue)
	tmp=$^.ndjson; \
	$(tito) --map ./data/revenue/transform-civil-penalties.js -r tsv $^ > $$tmp && \
	$(tables) -t ndjson -n civil_penalties_revenue -i $$tmp && \
	rm $$tmp

tables/tribal_revenue: data/revenue/tribal.tsv
	@$(call drop-table,tribal_revenue)
	$(tito) --map ./data/revenue/transform-tribal.js -r tsv $^ \
		| $(tables) -t ndjson -n tribal_revenue

tables/federal_production: data/federal-production/federal-production.tsv
	@$(call drop-table,federal_local_production)
	tmp=$^.ndjson; \
	$(tito) --map ./data/federal-production/transform-production.js -r tsv $^ > $$tmp && \
	$(tables) -t ndjson -n federal_local_production -i $$tmp && \
	rm $$tmp
	@$(call load-sql,data/federal-production/rollup.sql)

tables/all_production: data/all-production/product
	@$(call drop-table,all_production)
	tmp=$^/all.ndjson; \
	for tsv in $^/*.tsv; do \
		$(tito) -r tsv $$tsv >> $$tmp; \
	done; \
	$(tables) -t ndjson -n all_production -i $$tmp && \
	rm $$tmp
	@$(call load-sql,data/all-production/rollup.sql)

tables/company_revenue: data/company/years
	@$(call drop-table,company_revenue)
	tmp=$^/all.ndjson; \
	for company_filename in $^/????.tsv; do \
		filename="$${company_filename##*/}"; \
		COMPANY_YEAR="$${filename%%.*}"; \
		$(tito) -r tsv --map ./data/company/transform.js \
			$$company_filename >> $$tmp; \
	done; \
	$(tables) -i $$tmp -t ndjson -n company_revenue && \
	rm $$tmp

tables/jobs: tables/bls tables/self_employment

tables/bls: data/jobs/bls
	@$(call drop-table,bls_employment)
	tmp=$^/all.ndjson; \
	for jobs_filename in $^/????/joined.tsv; do \
		$(tito) -r tsv --map ./data/jobs/transform.js \
			$$jobs_filename >> $$tmp; \
	done; \
	$(tables) -i $$tmp -t ndjson -n bls_employment && \
	rm $$tmp
	@$(call load-sql,data/jobs/rollup-bls.sql)

tables/self_employment: data/jobs/self-employment.tsv
	@$(call drop-table,self_employment)
	$(call load-table,$^,self_employment)
	@$(call load-sql,data/jobs/rollup-self-employment.sql)

tables/gdp: data/gdp/regional.tsv
	@$(call drop-table,gdp)
	$(call load-table,$^,gdp)

tables/exports: data/exports/exports-by-industry.tsv
	@$(call drop-table,exports)
	$(call load-table,$^,exports)
	@$(call load-sql,data/exports/rollup.sql)

tables/disbursements: \
	tables/federal_disbursements \
	tables/disbursements_historic_preservation
	@$(call load-sql,data/disbursements/rollup.sql)

tables/federal_disbursements: data/disbursements/county-level.tsv
	@$(call drop-table,federal_disbursements)
	$(tito) -r tsv --map ./data/disbursements/transform-county-level.js $^ > $^.ndjson
	$(tables) -t ndjson -n federal_disbursements -i $^.ndjson
	rm $^.ndjson

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

.PHONY: db
