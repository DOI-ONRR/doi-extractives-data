BIN = ./node_modules/.bin

tito = $(BIN)/tito
datex = $(BIN)/datex --require parse=./lib/parse

FILES = \
	national/revenues-yearly.tsv \
	national/royalties-yearly.tsv \
	offshore/revenues-2013.tsv \
	states/revenues-2013.tsv

all: $(FILES)

national/revenues-yearly.tsv: input/site/2003-2013-revenue-data-CY.csv
	mkdir -p $(dir $@)
	$(tito) --read csv $< --write tsv $@

national/royalties-yearly.tsv: input/site/2003-2013-royalty-data.csv
	mkdir -p $(dir $@)
	$(tito) --read csv $< \
		| $(datex) --set 'Royalty = parse.dollars(Royalty)' \
		| tito --write tsv > $@

states/revenues-2013.tsv: input/site/CY13_Federal_Onshore_Revenues_by_State_12-04-2014.csv
	mkdir -p $(dir $@)
	tito --read csv $< \
		| scripts/abbr-state.js --states input/geo/states.csv --field State \
		| tito --write tsv > $@

offshore/revenues-2013.tsv: input/site/EITI_Offshore_Revenues_by_Planning_Area_CY2013_12-5-2014.csv
	mkdir -p $(dir $@)
	tito --read csv $< \
		| $(datex) --set 'Revenue = parse.dollars(Revenue)' \
		| tito --write tsv > $@

clean:
	rm -f $(FILES)

.PHONY: county-revenues
