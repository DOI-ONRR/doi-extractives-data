all: US.tsv regional.tsv states.tsv

US.tsv:
	./get-bea-data.js --geo us -o $@

regional.tsv:
	./get-bea-regional.js | \
		../bin/abbr-state.js \
			--if tsv \
			--of tsv \
			--states ../_input/geo/states.csv \
			--field Region \
			> $@

states.tsv:
	./get-bea-data.js --geo state -o $@
