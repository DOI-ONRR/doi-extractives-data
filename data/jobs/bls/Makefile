years ?= 2006 2007 2008 2009 2010 2011 2012 2013 2014 2015
all_csv = **/*.annual\ 10\ *.csv
ext_csv = **/*.annual\ 21\ *.csv

all: join

years: $(years)

join: $(years)
	./join.js $^

years: $(years)

%.zip:
	curl "http://data.bls.gov/cew/data/files/$*/csv/$*_annual_by_industry.zip" -o $@

%: %.zip
	mkdir -p $@
	unzip $< "$(all_csv)" "$(ext_csv)" -d $@_
	mv $@_/$(all_csv) $@/all.csv
	mv $@_/$(ext_csv) $@/extractives.csv
	rm -r $@_

distclean: clean
	rm -f *.zip

clean:
	rm -f *.csv

.PHONY: csvs join years
