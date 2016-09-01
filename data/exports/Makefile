all: exports-by-industry.tsv

exports-by-industry.tsv: top-state-exports.tsv
	./parse-census-commodities.js $< | \
		../bin/abbr-state.js \
			--states ../_input/geo/states.csv \
			--if tsv --of tsv \
		> $@
