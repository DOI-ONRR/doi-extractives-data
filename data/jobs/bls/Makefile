years = 2007 2008 2009 2010 2011 2012 2013 2014 2015 2016
csv_pattern = "**/*.annual\ 10\ *.csv" "**/*.annual\ 21*.csv" "**/*.annual\ 22*.csv"

all: years

years: $(years)
	echo $(years)

%.zip:
	curl "https://data.bls.gov:443/cew/data/files/$*/csv/$*_annual_by_industry.zip" -o $@

%: %.zip
	mkdir -p $@/commodity
	unzip -q $< -d $@_ $(csv_pattern)
	mv    $@_/$@.annual.by_industry/*.csv $@_
	rmdir $@_/$@.annual.by_industry
	./load.js --config commodities.yml --in $@_ --year $@ --out $@
	# rm -r $@_

clean:
	rm -f *.csv

distclean: clean
	rm -rf $(years)
	rm -f *.zip

.PHONY: csvs join years

.PRECIOUS: %.zip
