BIN ?= ../../../../node_modules/.bin

base_url ?= http://www.boem.gov/Oil-and-Gas-Energy-Program/Mapping-and-Data
shp_filter ?= "MMS_PLAN_A IS NOT NULL AND MMS_PLAN_A NOT IN ('LND', 'NUS')"
regions ?= alaska atlantic gulf pacific
region_files ?= $(foreach region,$(regions),$(region).json)

topo_options ?= --spherical --stitch-poles
topojson ?= $(BIN)/topojson $(topo_options)

# regions ?= atlantic gulf pacific

all: $(region_files) offshore.json

test: offshore.json
	jq '.objects[] | .geometries[] | {id, region: .properties.region, name: .properties.name}' offshore.json
	for name in $(regions); do echo "feature ids in $${name}:"; jq ".objects.$${name}.geometries[] | {id, properties}" $$name.json; done

shp/alaska.zip:
	mkdir -p $(basename $@)
	curl -L "$(base_url)/Alaska/planarea.aspx" > $@

shp/atlantic.zip:
	mkdir -p $(basename $@)
	curl -L "$(base_url)/ATL_PLAN(3).aspx" > $@

shp/gulf.zip:
	mkdir -p $(basename $@)
	curl -L "http://www.data.boem.gov/homepg/pubinfo/repcat/arcinfo/zipped/planarea.zip" > $@

shp/pacific.zip:
	mkdir -p $(basename $@)
	curl -L "$(base_url)/Pacific-files/PC_PLANAREA.aspx" > $@

shp/%.shp: shp/%.zip
	unzip -d $(basename $@) $<
	for file in $(basename $@)/*.???; do mv $$file $(basename $@).$${file##*.}; done
	rmdir $(basename $@)

%.json: shp/%.shp
	ogr2ogr -f GeoJSON -t_srs EPSG:4326 -where $(shp_filter) /dev/stdout $< \
		| $(topojson) \
			--id-property MMS_PLAN_A \
			-p name=TEXT_LABEL \
			-o $@ -- $*=/dev/stdin
	cat $@ | topojson -e areas.tsv -p region,name -o $@

offshore.json: $(foreach region,$(regions),$(region).json)
	$(topojson) --properties -o $@ -- $^

clean:
	rm -f *.json

distclean: clean
	rm -rf shp
