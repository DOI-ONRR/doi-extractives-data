node_bin ?= ../node_modules/.bin/
states = AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY

state-map ?= ./bin/state-map.js --css ../../css/svg.css --debug

all: state-maps viewboxes

state-maps: $(foreach state,$(states),states/$(state).svg) states/all.svg

viewboxes: ../_data/viewboxes.yml

data/fedland.json: _data/shp/fedlanp010g.shp
	topojson -p FEATURE1 fedland=$^ > _$@.tmp
	topojson-merge --io fedland --oo fedland \
		-k 'd.properties.FEATURE1' -- _$@.tmp > _$@
	rm _$@.tmp

_data/shp/fedlanp010g.shp: data/shp/fedlanp010g.shp

data/shp/fedlanp010g.shp:
	mkdir -p _$(dir $@)
	cd _$(dir $@); \
		curl -s "ftp://rockyftp.cr.usgs.gov/vdelivery/Datasets/Staged/SmallScale/Data/Boundaries/fedlanp010g.shp_nt00966.tar.gz" \
			| tar -xzvf -

data/shp/indlanp010g.shp:
	mkdir -p _$(dir $@)
	cd _$(dir $@); \
		curl -s "ftp://rockyftp.cr.usgs.gov/vdelivery/Datasets/Staged/SmallScale/Data/Boundaries/indlanp010g.shp_nt00968.tar.gz" \
		| tar -xzvf -

states/all.svg: _data/us-topology.json
	$(state-map) $^ > $@

states/%.svg: _data/us-topology.json
	$(state-map) --state $* --counties -- $^ > $@

../_data/viewboxes.yml:
	echo "# viewboxes:" > $@
	for state in all $(states); do \
		echo "$${state}: \c" >> $@; \
		xpath states/$${state}.svg '//@viewBox' \
			| perl -p -e 's/^.*="([^"]+)"/"$$1"\n/' >> $@; \
	done

.PHONY: state-maps viewboxes

