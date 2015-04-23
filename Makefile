BIN = ./node_modules/.bin

tito = $(BIN)/tito
datex = $(BIN)/datex --require parse=./lib/parse
output = output

FILES = \
	$(output)/national/revenues-yearly.tsv \
	$(output)/national/royalties-yearly.tsv \
	$(output)/offshore/revenues-2013.tsv \
	$(output)/state/revenues-2013.tsv \
	$(output)/county/revenues-yearly.tsv \
	county-revenues-by-state

all: $(FILES) geo svg

$(output)/national/revenues-yearly.tsv: input/site/2003-2013-revenue-data-CY.csv
	mkdir -p $(dir $@)
	$(tito) --read csv $< --write tsv $@

$(output)/national/royalties-yearly.tsv: input/site/2003-2013-royalty-data.csv
	mkdir -p $(dir $@)
	$(tito) --read csv $< \
		| $(datex) --set 'Royalty = parse.dollars(Royalty)' \
			--require 'util=./lib/util' --set 'Commodity = util.titleCase(Commodity)' \
		| tito --write tsv > $@

$(output)/national/gdp-yearly.tsv:
	mkdir -p $(dir $@)
	bin/get-bea-data.js --geo us -o $@

$(output)/state/revenues-yearly.tsv: $(output)/county/revenues-yearly.tsv
	mkdir -p $(dir $@)
	bin/sum.js \
		--group 'Year,State,Commodity' \
		--sum Revenue \
		-o $@ $<

$(output)/state/revenues-2013.tsv: input/site/CY13_Federal_Onshore_Revenues_by_State_12-04-2014.csv
	mkdir -p $(dir $@)
	tito --read csv $< \
		| bin/abbr-state.js \
			--states input/geo/states.csv \
			--field State \
			--of tsv > $@

$(output)/offshore/revenues-2013.tsv: input/site/EITI_Offshore_Revenues_by_Planning_Area_CY2013_12-5-2014.csv
	mkdir -p $(dir $@)
	tito --read csv $< \
		| $(datex) --set 'Revenue = parse.dollars(Revenue)' \
		| tito --write tsv > $@

$(output)/offshore/revenues-yearly.tsv: input/onrr/offshore-revenues.tsv
	mkdir -p $(dir $@)
	bin/group-offshore-revenues.js \
		--keys Year/Region/Commodity/Product/Type \
		--count Count \
		$< > $@

$(output)/county/revenues-yearly.tsv: input/onrr/county-revenues.tsv
	mkdir -p $(dir $@)
	tito --read tsv $< \
		| bin/normalize-county-revenues.js \
		| tito --write tsv > $@

county-revenues-by-state: $(output)/county/revenues-yearly.tsv
	tito --read tsv $< \
		| bin/divvy.js \
			--path 'county/by-state/{{ State }}/revenues-yearly.tsv' \
			--of tsv

$(output)/county/volumes-yearly.tsv: input/onrr/county-volumes.tsv
	mkdir -p $(dir $@)
	tito --read tsv $< \
		| bin/normalize-county-volumes.js \
		| tito --write tsv > $@

geo: \
	$(output)/geo/us-topology.json \
	$(output)/geo/us-topology-filtered.json \
	$(output)/geo/us-states.json \
	$(output)/geo/us-outline.json \
	$(output)/geo/offshore.json

$(output)/geo/us-topology.json: input/geo/us-10m.json
	mkdir -p $(dir $@)
	bin/map-topology.js \
		--props.states '{abbr: STATE, FIPS: STATE_FIPS}' \
		--filter.states '["AS", "GU", "PR", "VI"].indexOf(abbr) === -1' \
		--props.counties '{state: STATE, county: COUNTY, FIPS: FIPS}' \
		--filter.counties '["AS", "GU", "PR", "VI"].indexOf(state) === -1' \
		-o $@ -- $<

# generate US topology for only those counties with data
$(output)/geo/us-topology-filtered.json: $(output)/county/revenues-yearly.tsv $(output)/geo/us-topology.json
	mkdir -p $(dir $@)
	bin/join-counties.js \
		--in-topo $(output)/geo/us-topology.json \
		--in-states input/geo/states.csv \
		--in-counties $(output)/county/revenues-yearly.tsv \
		--inner \
		> $@

$(output)/geo/us-outline.json: $(output)/geo/us-states.json
	$(BIN)/topojson-merge \
		--io states \
		--oo USA \
		--key '"USA"' $< \
		| bin/extract-topology.js --layer USA > $@

$(output)/geo/us-states.json: $(output)/geo/us-topology.json
	mkdir -p $(dir $@)
	bin/extract-topology.js \
		--layer states \
		$< > $@

$(output)/geo/offshore.json: input/geo/offshore/*.json
	$(BIN)/topojson \
		--id-property MMS_PLAN_A \
		-p id=MMS_PLAN_A \
		-p label=TEXT_LABEL \
		-o $@ -- $^

$(output)/geo/%-simple.json: $(output)/geo/%.json
	topojson --properties --simplify 2e-6 -o $@ $<

svg: \
	$(output)/svg/all.svg \
	$(output)/svg/land.svg \
	$(output)/svg/states.svg \
	$(output)/svg/counties.svg \
	$(output)/svg/offshore.svg \
	$(output)/svg/filtered.svg

$(output)/svg/all.svg: \
		$(output)/geo/us-topology.json \
		$(output)/geo/offshore.json
	mkdir -p $(dir $@)
	bin/vectorize.js $^ > $@

$(output)/svg/land.svg: input/geo/us-10m.json
	mkdir -p $(dir $@)
	bin/extract-topology.js --layer land $< \
		| bin/vectorize.js /dev/stdin > $@

$(output)/svg/states.svg: $(output)/geo/us-states.json
	mkdir -p $(dir $@)
	bin/vectorize.js $< > $@

$(output)/svg/counties.svg: $(output)/geo/us-topology.json
	mkdir -p $(dir $@)
	bin/extract-topology.js --layer counties $< \
		| bin/vectorize.js /dev/stdin > $@

$(output)/svg/offshore.svg: $(output)/geo/offshore.json
	mkdir -p $(dir $@)
	bin/vectorize.js $< > $@

$(output)/svg/filtered.svg: $(output)/geo/us-topology-filtered.json
	mkdir -p $(dir $@)
	bin/vectorize.js $< > $@

$(output)/svg/outer.svg: $(output)/geo/us-outline.json $(output)/geo/offshore.json
	bin/vectorize.js --p0 $^ > $@

clean:
	rm -f $(FILES)

.PHONY: county-revenues-nested geo svg
