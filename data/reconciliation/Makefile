all: output

output: input
	mkdir -p $@
	for file in input/*.tsv; do \
		filename="$${file##*/}"; \
		REVENUE_YEAR="$${filename%%.*}" ./parse-reconciliation.js \
			--if tsv \
			--of tsv \
			$$file > "$@/$${filename}"; \
	done

clean:
	rm -f output/*.tsv
