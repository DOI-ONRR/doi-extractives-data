all: self-employment.tsv

self-employment.tsv:
	./get-bea-jobs.js --of ndjson | \
		../bin/abbr-state.js \
			--if ndjson \
			--of tsv \
			--states ../geo/input/states.csv \
			--field Region \
		> $@

clean:
	rm -f self-employment.tsv
