# Data processing scripts
These [Node] scripts are used to parse, transform and format tabular and
geographic data from the [input directory](../input). Each one provides help
usage via the `--help` (or `-h`) flag, e.g.:

```sh
$ bin/vectorize.js --help

vectorize.js [options] a.json b.json

Options:
  --proj           the d3 geo projection (default: custom Albers USA)   
  --center         projection center in the form "lon,lat"              
  --scale          projection scale as a float                          
  --translate      projection translation in the form "x,y"             
  --width          the SVG width in pixels                [default: 960]
  --height         the SVG height in pixels               [default: 650]
  --graticule, -g  draw a graticule for debugging purposes     [boolean]
  --p0             draw a circle at the first point in each topology
                   (for debugging)                             [boolean]
  -o               write the SVG to this file   [default: "/dev/stdout"]
```

See the [Makefile](../Makefile) for more info.

[Node]: https://nodejs.org/
