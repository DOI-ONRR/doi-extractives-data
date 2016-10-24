node_bin ?= ../node_modules/.bin/
svgo ?= $(node_bin)svgo --disable=cleanupIDs
svgeo ?= $(node_bin)svgeo --projection ../lib/albers-custom.js --mesh --
topojson ?= $(node_nin)topojson
raster_scale ?= 4
states = AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY

all: \
	state-maps \
	viewboxes \
	land/combined.gif

state-maps: \
	$(foreach state,$(states),states/$(state).svg) \
	states/all.svg

viewboxes: ../_data/viewboxes.yml

optimize-svg:
	$(svgo) -f states

land/combined.gif: land/federal.gif land/tribal.gif
	composite $^ $@

land/%.gif: land/%.png
	convert -posterize 2 -transparent-color white $^ $@

land/%.png: land/%.json
	./bin/rasterize.js --scale $(raster_scale) $^ > $@

land/federal.json: data/shp/fedlanp010g.shp
	$(topojson) -p FEATURE1 federal=$^ > $@.tmp
	$(topojson)-merge --io federal --oo federal \
		-k d.properties.FEATURE1 -- $@.tmp > $@
	rm $@.tmp

land/tribal.json: data/shp/indlanp010g.shp
	$(topojson) tribal=$^ > $@

data/shp/%.shp:
	mkdir -p $(dir $@)
	cd $(dir $@); \
		curl -s "ftp://rockyftp.cr.usgs.gov/vdelivery/Datasets/Staged/SmallScale/Data/Boundaries/$*.shp_nt00966.tar.gz" \
			| tar -xzvf -

states/all.svg: data/us-topology.json
	./bin/state-map.js $^ | $(svgo) -i - -o $@

states/%.svg: data/us-topology.json
	./bin/state-map.js --state $* --counties -- $^ \
		| $(svgo) -i - -o $@

offshore/all.svg: data/offshore.json
	mkdir -p $(dir $@)
	$(svgeo) $^ > $@

../_data/viewboxes.yml:
	echo "# viewboxes:" > $@
	for state in all $(states); do \
		echo "$${state}: \c" >> $@; \
		xpath states/$${state}.svg '//@viewBox' \
			| perl -p -e 's/^.*="([^"]+)"/"$$1"\n/' >> $@; \
	done

clean:
	rm -f states/*.svg
	rm -f land/*.png land/*.gif

distclean:
	rm -f data/shp

.PHONY: \
	state-maps \
	viewboxes
