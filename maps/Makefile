node_bin ?= ../node_modules/.bin/
states = AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY

state-map ?= ./bin/state-map.js --css ../../css/svg.css --debug

all: state-maps viewboxes

state-maps: $(foreach state,$(states),states/$(state).svg) states/all.svg

viewboxes: ../_data/viewboxes.yml

../_data/viewboxes.yml:
	echo "# viewboxes:" > $@
	for state in $(states); do \
		echo "$${state}: \c" >> $@; \
		xpath states/$${state}.svg '//@viewBox' \
			| perl -p -e 's/^.*="([^"]+)"/"$$1"\n/' >> $@; \
	done

states/all.svg: _data/us-topology.json
	$(state-map) $^ > $@

states/%.svg: _data/us-topology.json
	$(state-map) --state $* --counties -- $^ > $@

.PHONY: state-maps viewboxes

