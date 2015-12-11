years ?= 2004 2005 2006 2007 2008 2009 2010 2011 2012 2013
zips = $(foreach year,$(years),$(year).zip)
csvs = $(foreach year,$(years),$(year).csv)

all: $(csvs)

%.zip:
	curl "http://www.bls.gov/cew/data/files/$*/csv/$*_annual_by_industry.zip" -o $@

%.csv: %.zip
	unzip $< '*.annual 21 *.csv'
	mv $*.annual.by_industry/*.csv $@
	rm -r $*.annual.by_industry

distclean: clean
	rm -f *.zip

clean:
	rm -f *.csv
