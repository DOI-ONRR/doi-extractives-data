# where our npm-installed executables reside
BIN = ../node_modules/.bin

SHELL = bash

input ?= _input/

# commonly used executables
tito = $(BIN)/tito
datex = $(BIN)/datex

# force TopoJSON to use spherical projections
topo_options ?= --spherical --bbox

# revenue-related files
REVENUE_FILES = \
	county/revenues.tsv \
	offshore/revenues.tsv \
	company/revenue

# production volume files
PRODUCTION_FILES = \
	state/production.tsv \
	offshore/production.tsv

# a list of all of the individual files to build.
# unless otherwise noted, all of these files are broken
# down by year and commodity
FILES = \
	$(REVENUE_FILES) \
	$(PRODUCTION_FILES) \
	$(EXPORT_FILES) \
	$(GDP_FILES) \
	geo svg

all: $(FILES)

revenue: $(REVENUE_FILES)

production: $(PRODUCTION_FILES)

company/revenue:
	mkdir -p $@
	for file in $(input)onrr/company-revenue/*.tsv; do \
		bin/parse-company-revenue.js \
			--if tsv \
			--of tsv \
			$$file > "$@/$${file##*/}"; \
	done

# state production volumes by commodity and product
state/production.tsv: county/production.tsv
	mkdir -p $(dir $@)
	bin/sum.js \
		--group 'Year,State,Commodity,Product' \
		--sum 'Volume' \
		-o $@ $<

# offshore revenues by region and area
offshore/revenues.tsv: $(input)onrr/offshore-revenues.tsv
	mkdir -p $(dir $@)
	bin/group-offshore-revenues.js \
		--keys Year/Region/Area/Commodity/Type \
		$< > $@

# offshore production volumes by region and area
# FIXME: revisit whether we need this when we get new production data
offshore/production.tsv: $(input)onrr/regional-production.tsv
	mkdir -p $(dir $@)
	$(tito) --read tsv $< \
		| $(datex) --filter 'Shore === "Offshore"' \
		| $(tito) --write tsv \
		| bin/group-offshore-production.js \
			--keys Year/Region/Area/Commodity/Product \
			> $@

# county revenues
county/revenues.tsv: $(input)onrr/county-revenues.tsv
	mkdir -p $(dir $@)
	$(tito) --read tsv $< \
		| bin/normalize-county-revenues.js \
			--in-states geo/input/states.csv \
		| $(tito) --write tsv > $@

# county production volumes
county/production.tsv: $(input)onrr/regional-production.tsv
	mkdir -p $(dir $@)
	$(tito) --read tsv $< \
		| $(datex) --filter 'Shore === "Onshore"' \
		| bin/normalize-county-production.js \
			--in-states geo/input/states.csv \
		| tito --write tsv > $@

geo: \
	geo/us-topology.json \
	geo/us-topology-filtered.json \
	geo/us-states.json \
	geo/us-outline.json \
	geo/offshore.json

geo/us-topology.json: geo/input/us-10m.json
	mkdir -p $(dir $@)
	bin/map-topology.js \
		--id.states 'abbr' \
		--props.states '{abbr: STATE, FIPS: STATE_FIPS}' \
		--filter.states '["AS", "GU", "PR", "VI"].indexOf(abbr) === -1' \
		--props.counties '{state: STATE, name: COUNTY, FIPS: FIPS}' \
		--filter.counties '["AS", "GU", "PR", "VI"].indexOf(state) === -1' \
		-o $@ -- $<
	bin/add-state-names.js --states geo/input/states.csv $@

# generate US topology for only those counties with data
geo/us-topology-filtered.json: county/revenues.tsv geo/us-topology.json
	mkdir -p $(dir $@)
	bin/join-counties.js \
		--in-topo geo/us-topology.json \
		--in-states geo/input/states.csv \
		--in-counties county/revenues.tsv \
		--inner \
		> $@

geo/us-outline.json: geo/us-states.json
	$(BIN)/topojson-merge \
		--io states \
		--oo USA \
		--key '"USA"' $< \
		| bin/extract-topology.js --layer USA > $@

geo/us-states.json: geo/us-topology.json
	mkdir -p $(dir $@)
	bin/extract-topology.js \
		--layer states \
		$< > $@

geo/offshore.json: geo/input/offshore/*.json
	$(BIN)/topojson $(topo_options) --properties -o $@ -- $^

geo/offshore-regions.json: geo/offshore-simple.json
	bin/offshore-regions.json $< $@

geo/%-simple.json: geo/%.json
	$(BIN)/topojson $(topo_options) --properties --simplify 1e-8 -o $@ $<

svg: \
	svg/all.svg \
	svg/land.svg \
	svg/states.svg \
	svg/counties.svg \
	svg/offshore.svg \
	svg/filtered.svg

svg/all.svg: \
		geo/us-topology.json \
		geo/offshore.json
	mkdir -p $(dir $@)
	bin/vectorize.js $^ > $@

svg/land.svg: geo/input/us-10m.json
	mkdir -p $(dir $@)
	bin/extract-topology.js --layer land $< \
		| bin/vectorize.js /dev/stdin > $@

svg/states.svg: geo/us-states.json
	mkdir -p $(dir $@)
	bin/vectorize.js $< > $@

svg/counties.svg: geo/us-topology.json
	mkdir -p $(dir $@)
	bin/extract-topology.js --layer counties $< \
		| bin/vectorize.js /dev/stdin > $@

svg/offshore.svg: geo/offshore.json
	mkdir -p $(dir $@)
	bin/vectorize.js $< > $@

svg/filtered.svg: geo/us-topology-filtered.json
	mkdir -p $(dir $@)
	bin/vectorize.js $< > $@

svg/outer.svg: geo/us-outline.json geo/offshore.json
	bin/vectorize.js --p0 $^ > $@

geo/input/offshore/%.json:
	cd geo/input/offshore && make

clean:
	rm -f $(FILES)
	cd geo/input/offshore && make clean

distclean: clean
	cd geo/input/offshore && make distclean

.PHONY: \
	revenue production \
	geo \
	svg
