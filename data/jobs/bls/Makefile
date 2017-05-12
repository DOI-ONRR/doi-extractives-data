years ?= 2006 2007 2008 2009 2010 2011 2012 2013 2014 2015
all_csv = **/*.annual\ 10\ *.csv
# extractives: NAICS code prefix 21
ext_csv = **/*.annual\ 21\ *.csv
# renewables: NAICS codes for Solar, Wind, and Geothermal
new_csv = **/*.annual\ 22111{4,5,6}\ *.csv

all: join

years: $(years)

join: $(years)
	./join.js $^

years: $(years)

%.zip:
	curl "https://data.bls.gov:443/cew/data/files/$*/csv/$*_annual_by_industry.zip" -o $@

%: %.zip
	mkdir -p $@
	unzip $< -d $@_
	mv $@_/$(all_csv) $@/all.csv
	mv $@_/$(ext_csv) $@/extractives.csv
	rm -f $@/renewables.ndjson
	for f in $@_/$(new_csv); do \
		tito -r csv "$$f" >> $@/renewables.ndjson; \
	done
	tito -w csv $@/renewables.ndjson > $@/renewables.csv
	# rm -r $@_

clean:
	rm -f *.csv

distclean: clean
	rm -rf $(years)
	rm -f *.zip

.PHONY: csvs join years

.PRECIOUS: %.zip
