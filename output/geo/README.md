# Generated geographic data
This directory contains geographic data files for various US boundaries. Unless
otherwise noted, these files use the [TopoJSON] format, a [GeoJSON]-like
serialization that's much more efficient in terms of file size.

* `offshore.json`: offshore planning areas, generated from the
  [geo/offshore](../../input/geo/offshore) input data.
* `us-outline.json`: just the outline of the US, for making icons and thumbnails
* `us-states.json`: just the US state outlines
* `us-topology.json`: US outline (`objects.USA`), counties and states encoded
  as a single topology.
* `us-topology-filtered.json`: a version of `us-topology.json` with only counties
  that have corresponding data in the [yearly revenues spreadsheet](../county/revenues-yearly.tsv).

For more info on how these files are created, see the [Makefile](../Makefile).

[TopoJSON]: https://github.com/mbostock/topojson/wiki/
[GeoJSON]: http://geojson.org/
