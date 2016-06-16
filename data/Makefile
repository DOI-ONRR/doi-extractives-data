# where our npm-installed executables reside
BIN = ../node_modules/.bin

SHELL = bash

input ?= _input/

# commonly used executables
tito = $(BIN)/tito
datex = $(BIN)/datex

# force TopoJSON to use spherical projections
topo_options ?= --spherical --bbox

all: geo

# GEO: dependencies are topojson and GDAL
# 	npm install topojson
# 	brew install gdal
#
# Geo data obtained from:
# http://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-admin-1-states-provinces/

geo: geo/de-topology.json

geo/de-states.json: \
		$(input)geo/states-provinces/ne_10m_admin_1_states_provinces_shp.shp \
		$(input)geo/states-provinces/ne_10m_admin_1_states_provinces_shp.dbf \
		$(input)geo/states-provinces/ne_10m_admin_1_states_provinces_shp.shx
	rm -f $@
	ogr2ogr -f GeoJSON -where "sr_adm0_a3 IN ('DEU')" $@ $<

geo/de-topology.json: geo/de-states.json
	topojson --id-property=id,name -p id,name -e state/states.tsv -o $@ -- states=$<
