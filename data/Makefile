# where our npm-installed executables reside
BIN = ../node_modules/.bin

SHELL = bash

# force TopoJSON to use spherical projections
topo_options ?= --spherical --bbox

# revenue-related files
REVENUE_FILES = \
	company/revenue

# a list of all of the individual files to build.
# unless otherwise noted, all of these files are broken
# down by year and commodity
FILES = \
	$(REVENUE_FILES) \
	$(EXPORT_FILES) \
	$(GDP_FILES) \
	geo svg

all: $(FILES)

revenue: $(REVENUE_FILES)

company/revenue:
	mkdir -p $@
	for file in company/revenue/*.tsv; do \
		bin/parse-company-revenue.js \
			--if tsv \
			--of tsv \
			$$file > "$@/$${file##*/}"; \
	done

geo: \
	geo/us-topology.json \
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
	svg/offshore.svg

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
	revenue \
	geo \
	svg
