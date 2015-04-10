BIN = ./node_modules/.bin

tito = $(BIN)/tito
datex = $(BIN)/datex --require parse=./lib/parse

FILES = \
	national/revenues-yearly.tsv \
	national/royalties-yearly.tsv \
	offshore/revenues-2013.tsv \
	state/revenues-2013.tsv \
	county/revenues-yearly.tsv \
	county-revenues-by-state

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
		| scripts/abbr-state.js \
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
		| scripts/normalize-county-revenues.js \
		| tito --write tsv > $@

county-revenues-by-state: county/revenues-yearly.tsv
	tito --read tsv $< \
		| scripts/divvy.js \
			--path 'county/by-state/{{ State }}/revenues.tsv' \
			--of tsv

geo/us-topology.json:
	mkdir -p $(dir $@)
	scripts/join-counties.js \
		--in-topo input/geo/us-counties.json \
		--in-states input/geo/states.csv \
		> $@

# generate US topology for only those counties with data
geo/us-topology-filtered.json: county/revenues-yearly.tsv
	mkdir -p $(dir $@)
	scripts/join-counties.js \
		--in-topo input/geo/us-counties.json \
		--in-states input/geo/states.csv \
		--in-counties $< \
		--inner \
		> $@

clean:
	rm -f $(FILES)

.PHONY: county-revenues-nested
