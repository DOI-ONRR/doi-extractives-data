base_url ?= http://www.boem.gov/Oil-and-Gas-Energy-Program/Mapping-and-Data
shp_filter ?= "MMS_PLAN_A IS NOT NULL AND MMS_PLAN_A NOT IN ('LND', 'NUS')"
# regions ?= alaska atlantic gulf pacific
regions ?= atlantic gulf pacific

all: $(foreach region,$(regions),$(region).json) offshore.json

test: all
	for name in $(regions); do echo "feature ids in $${name}:"; jq ".objects.$${name}.geometries[] | {id: .id, name: .properties.name}" $$name.json; done

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
		| topojson \
			--stitch-poles \
			--id-property MMS_PLAN_A \
			-p name=TEXT_LABEL \
			-o $@ -- $*=/dev/stdin

offshore.json: $(foreach region,$(regions),$(region).json)
	topojson --properties -o $@ -- $^

clean:
	rm -f *.json

distclean: clean
	rm -rf shp
