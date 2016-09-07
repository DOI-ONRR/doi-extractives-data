all: revenue.tsv

input.tsv:
	# FIXME
	echo "I don't know where to find this!"

revenue.tsv: input.tsv
	./parse-reconciliation.js \
		--if tsv \
		--of tsv \
		$< > $@
