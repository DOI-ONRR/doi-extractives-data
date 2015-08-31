# where our npm-installed executables reside
BIN = ../node_modules/.bin

# commonly used executables
tito = $(BIN)/tito
datex = $(BIN)/datex

# force TopoJSON to use spherical projections
topo_options ?= --spherical

# revenue-related files
REVENUE_FILES = \
	output/national/revenues.tsv \
	output/state/revenues.tsv \
	output/county/revenues.tsv \
	output/offshore/revenues.tsv \
	output/regional/resource-revenues.tsv \
	output/regional/revenues.tsv \
	county-revenues-by-state \
	county-resource-revenues-by-state

# production volume files
PRODUCTION_FILES = \
	output/national/production.tsv \
	output/state/production.tsv \
	output/county/production.tsv \
	output/offshore/production.tsv

# Census-derived export figures
EXPORT_FILES = \
	output/state/exports-by-industry.tsv

# GDP figures from the Bureau of Economic Analysis
GDP_FILES = \
	output/national/gdp.tsv \
	output/state/gdp.tsv

# a list of all of the individual files to build.
# unless otherwise noted, all of these files are broken
# down by year and commodity
FILES = \
	$(REVENUE_FILES) \
	$(PRODUCTION_FILES) \
	$(EXPORT_FILES) \
	geo svg \
	$(GDP_FILES)

all: $(FILES)

# national revenues by commodity and revenue type
output/national/revenues.tsv: output/state/revenues.tsv output/offshore/revenues.tsv
	mkdir -p $(dir $@)
	bin/sum.js \
		--group 'Year,Commodity,Type' \
		--sum 'Revenue' \
		-o $@ $^

# national production volumes by commodity and product
output/national/production.tsv: output/state/production.tsv output/offshore/production.tsv
	mkdir -p $(dir $@)
	bin/sum.js \
		--group 'Year,Commodity,Product' \
		--sum 'Volume' \
		-o $@ $^

# national GDP figures
output/national/gdp.tsv:
	mkdir -p $(dir $@)
	bin/get-bea-data.js --geo us -o $@

# state listing
output/state/states.tsv: input/geo/states.csv
	$(tito) --read csv $< | \
		$(datex) --map '{id: abbr, name: name, FIPS: FIPS}' | \
		$(tito) --write tsv > $@

# state revenues by commodity and revenue type
output/state/revenues.tsv: output/county/revenues.tsv
	mkdir -p $(dir $@)
	bin/sum.js \
		--group 'Year,State,Commodity,Type' \
		--sum 'Revenue' \
		-o $@ $<

# state production volumes by commodity and product
output/state/production.tsv: output/county/production.tsv
	mkdir -p $(dir $@)
	bin/sum.js \
		--group 'Year,State,Commodity,Product' \
		--sum 'Volume' \
		-o $@ $<

# state GDP figures
output/state/gdp.tsv:
	mkdir -p $(dir $@)
	bin/get-bea-data.js --geo state -o $@

# state export figures
output/state/exports-by-industry.tsv: input/census/top-state-exports.tsv
	mkdir -p $(dir $@)
	bin/parse-census-commodities.js $< | \
		bin/add-resource-group.js | \
		bin/abbr-state.js --if tsv --of tsv \
		> $@

# offshore revenues by region and area
output/offshore/revenues.tsv: input/onrr/offshore-revenues.tsv
	mkdir -p $(dir $@)
	bin/group-offshore-revenues.js \
		--keys Year/Region/Area/Commodity/Type \
		$< > $@

# offshore production volumes by region and area
output/offshore/production.tsv: input/onrr/offshore-production.tsv
	mkdir -p $(dir $@)
	bin/group-offshore-production.js \
		--keys Year/Region/Area/Commodity/Product \
		$< > $@

# regional (state and offshore) revenues
output/regional/revenues.tsv: output/state/revenues.tsv output/offshore/revenues.tsv
	mkdir -p $(dir $@)
	bin/union-regions.js \
		--onshore output/state/revenues.tsv \
		--states input/geo/states.csv \
		--offshore output/offshore/revenues.tsv \
		--areas input/geo/offshore/areas.tsv \
		| bin/sum.js \
			--group 'Year,Region,Commodity,Type' \
			--sum 'Revenue' \
			-o $@

# regional (state and offshore) revenues by resource group
output/regional/resource-revenues.tsv: output/regional/revenues.tsv
	cat $< \
		| bin/add-resource-group.js \
		| bin/sum.js \
			--group 'Year,Region,Resource' \
			--sum 'Revenue' \
			-o $@

# county listings
output/county/counties.tsv: output/geo/us-topology.json
	bin/extract-properties.js --layer counties $< | \
		$(datex) --map '{state: state, name: county, FIPS: FIPS}' | \
		$(tito) --write tsv > $@

# divvy up counties.csv into separate files by state
counties-by-state: output/county/counties.tsv
	$(tito) --read tsv $< \
		| bin/divvy.js \
			--path 'output/county/by-state/{{ state }}/counties.tsv' \
			--of tsv

# county revenues
output/county/revenues.tsv: input/onrr/county-revenues.tsv
	mkdir -p $(dir $@)
	$(tito) --read tsv $< \
		| bin/normalize-county-revenues.js \
		| $(tito) --write tsv > $@

# divvy up county revenues into separate files by state
county-revenues-by-state: output/county/revenues.tsv
	$(tito) --read tsv $< \
		| bin/divvy.js \
			--path 'output/county/by-state/{{ State }}/revenues.tsv' \
			--of tsv

county-resource-revenues-by-state: output/county/revenues.tsv
	$(tito) --read tsv $< \
		| bin/add-resource-group.js \
			--if ndjson \
			--of ndjson \
		| bin/sum.js \
			--if ndjson \
			--group 'Year,State,County,FIPS,Resource' \
			--sum 'Revenue' \
			--of ndjson \
		| bin/divvy.js \
			--if ndjson \
			--path 'output/county/by-state/{{ State }}/resource-revenues.tsv' \
			--of tsv

# county production volumes
output/county/production.tsv: input/onrr/county-production.tsv
	mkdir -p $(dir $@)
	$(tito) --read tsv $< \
		| bin/normalize-county-production.js \
		| $(tito) --write tsv > $@

geo: \
	output/geo/us-topology.json \
	output/geo/us-topology-filtered.json \
	output/geo/us-states.json \
	output/geo/us-outline.json \
	output/geo/offshore.json

output/geo/us-topology.json: input/geo/us-10m.json
	mkdir -p $(dir $@)
	bin/map-topology.js \
		--id.states 'abbr' \
		--props.states '{abbr: STATE, FIPS: STATE_FIPS}' \
		--filter.states '["AS", "GU", "PR", "VI"].indexOf(abbr) === -1' \
		--props.counties '{state: STATE, county: COUNTY, FIPS: FIPS}' \
		--filter.counties '["AS", "GU", "PR", "VI"].indexOf(state) === -1' \
		-o $@ -- $<

# generate US topology for only those counties with data
output/geo/us-topology-filtered.json: output/county/revenues.tsv output/geo/us-topology.json
	mkdir -p $(dir $@)
	bin/join-counties.js \
		--in-topo output/geo/us-topology.json \
		--in-states input/geo/states.csv \
		--in-counties output/county/revenues.tsv \
		--inner \
		> $@

output/geo/us-outline.json: output/geo/us-states.json
	$(BIN)/topojson-merge \
		--io states \
		--oo USA \
		--key '"USA"' $< \
		| bin/extract-topology.js --layer USA > $@

output/geo/us-states.json: output/geo/us-topology.json
	mkdir -p $(dir $@)
	bin/extract-topology.js \
		--layer states \
		$< > $@

output/geo/offshore.json: input/geo/offshore/*.json
	$(BIN)/topojson $(topo_options) --properties -o $@ -- $^

output/geo/%-simple.json: output/geo/%.json
	$(BIN)/topojson $(topo_options) --properties --simplify 1e-8 -o $@ $<

svg: \
	output/svg/all.svg \
	output/svg/land.svg \
	output/svg/states.svg \
	output/svg/counties.svg \
	output/svg/offshore.svg \
	output/svg/filtered.svg

output/svg/all.svg: \
		output/geo/us-topology.json \
		output/geo/offshore.json
	mkdir -p $(dir $@)
	bin/vectorize.js $^ > $@

output/svg/land.svg: input/geo/us-10m.json
	mkdir -p $(dir $@)
	bin/extract-topology.js --layer land $< \
		| bin/vectorize.js /dev/stdin > $@

output/svg/states.svg: output/geo/us-states.json
	mkdir -p $(dir $@)
	bin/vectorize.js $< > $@

output/svg/counties.svg: output/geo/us-topology.json
	mkdir -p $(dir $@)
	bin/extract-topology.js --layer counties $< \
		| bin/vectorize.js /dev/stdin > $@

output/svg/offshore.svg: output/geo/offshore.json
	mkdir -p $(dir $@)
	bin/vectorize.js $< > $@

output/svg/filtered.svg: output/geo/us-topology-filtered.json
	mkdir -p $(dir $@)
	bin/vectorize.js $< > $@

output/svg/outer.svg: output/geo/us-outline.json output/geo/offshore.json
	bin/vectorize.js --p0 $^ > $@

input/geo/offshore/%.json:
	cd input/geo/offshore && make

clean:
	rm -f $(FILES)
	cd input/geo/offshore && make clean

distclean: clean
	cd input/geo/offshore && make distclean

.PHONY: \
	counties-by-state \
	county-revenues-by-state \
	county-resource-revenues-by-state \
	geo \
	svg
