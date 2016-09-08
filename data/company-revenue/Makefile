all: output

output: input
	mkdir -p $@
	for file in input/*.tsv; do \
		./parse-company-revenue.js \
			--if tsv \
			--of tsv \
			$$file > "$@/$${file##*/}"; \
	done

clean:
	rm -f output/*.tsv
