BIN = ./node_modules/.bin

tito = $(BIN)/tito
datex = $(BIN)/datex --require parse=./lib/parse
topojson = $(BIN)/topojson

FILES = \
	national/revenues-yearly.tsv \
	national/royalties-yearly.tsv \
	offshore/revenues-2013.tsv \
	state/revenues-2013.tsv \
	county/revenues-yearly.tsv \
	county-revenues-by-state \
	geo/us-topology.json \
	geo/us-states.json \
	geo/us-outline.json

all: $(FILES)

national/revenues-yearly.tsv: input/site/2003-2013-revenue-data-CY.csv
	mkdir -p $(dir $@)
	$(tito) --read csv $< --write tsv $@

national/royalties-yearly.tsv: input/site/2003-2013-royalty-data.csv
	mkdir -p $(dir $@)
	$(tito) --read csv $< \
		| $(datex) --set 'Royalty = parse.dollars(Royalty)' \
		| tito --write tsv > $@

state/revenues-2013.tsv: input/site/CY13_Federal_Onshore_Revenues_by_State_12-04-2014.csv
	mkdir -p $(dir $@)
	tito --read csv $< \
		| bin/abbr-state.js \
			--states input/geo/states.csv \
			--field State \
			--of tsv > $@

offshore/revenues-2013.tsv: input/site/EITI_Offshore_Revenues_by_Planning_Area_CY2013_12-5-2014.csv
	mkdir -p $(dir $@)
	tito --read csv $< \
		| $(datex) --set 'Revenue = parse.dollars(Revenue)' \
		| tito --write tsv > $@

county/revenues-yearly.tsv: input/onrr/county-revenues.tsv
	mkdir -p $(dir $@)
	tito --read tsv $< \
		| bin/normalize-county-revenues.js \
		| tito --write tsv > $@

county-revenues-by-state: county/revenues-yearly.tsv
	tito --read tsv $< \
		| bin/divvy.js \
			--path 'county/by-state/{{ State }}/revenues-yearly.tsv' \
			--of tsv

county/volumes-yearly.tsv: input/onrr/county-volumes.tsv
	mkdir -p $(dir $@)
	tito --read tsv $< \
		| bin/normalize-county-volumes.js \
		| tito --write tsv > $@

geo: \
	geo/us-topology.json \
	geo/us-topology-filtered.json \
	geo/us-states.json \
	geo/us-outline.json \
	geo/offshore.json

geo/us-topology.json: input/geo/us-10m.json
	mkdir -p $(dir $@)
	bin/map-topology.js \
		--props.states '{abbr: STATE, FIPS: STATE_FIPS}' \
		--filter.states '["AS", "GU", "PR", "VI"].indexOf(abbr) === -1' \
		--props.counties '{state: STATE, county: COUNTY, FIPS: FIPS}' \
		--filter.counties '["AS", "GU", "PR", "VI"].indexOf(state) === -1' \
		--keep land \
		-o $@ -- $<

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

# generate US topology for only those counties with data
geo/us-topology-filtered.json: county/revenues-yearly.tsv
	mkdir -p $(dir $@)
	bin/join-counties.js \
		--in-topo input/geo/us-counties.json \
		--in-states input/geo/states.csv \
		--in-counties $< \
		--inner \
		> $@

geo/offshore.json: input/geo/offshore/*.json
	topojson \
		--id-property MMS_PLAN_A \
		-p id=MMS_PLAN_A \
		-p label=TEXT_LABEL \
		-o $@ -- $^

geo/us.svg: \
		geo/us-outline.json \
		geo/us-topology.json \
		geo/offshore.json
	bin/vectorize.js $^ > $@

clean:
	rm -f $(FILES)

.PHONY: county-revenues-nested geo
