all: exports-by-industry.tsv

exports-by-industry.tsv: top-state-exports.tsv
	./parse-census-commodities.js $< | \
		../bin/abbr-state.js \
			--states ../geo/input/states.csv \
			--if tsv --of tsv \
		> $@
