# Maps!
This is where we do all of our static map generation. The idea behind the
static map approach is a radical departure from how we used to do maps
differently.

### Before
Previously, the outputs from our [data scripts](../data/Makefile) were
primarily TopoJSON and tab-separated values, both of which were loaded in the
browser, the geometry projected, tabular data joined, and appearance (map zoom,
feature fill, etc.) determined at runtime. It was a *very* flexible approach,
but has some serious issues:

1. It's tough on browser performance:
  * The US TopoJSON, which contains state and county boundaries, weighs in at
    836K uncompressed. We did a lot of work to ensure that this file was only
    loaded and parsed once (with an in-memory cache), but even that can still
    take a long time on some (perhaps *most*) browsers and hardware
    configurations.
  * Projecting the TopoJSON at runtime is also processor-intensive. We don't
    cache the projected features (which are also much bigger in memory than
    their TopoJSON representation), which means that each map is doing a *lot*
    of duplicate work.
1. Loading blocks, in two ways:
  * While JSON loading doesn't block the browser's UI thread, *parsing does*,
    inevitably leading to a either a (hopefully) brief, but unignorable pause
    when each TopoJSON file is loaded.
  * Any JavaScript that wants to color a map's features needs to wait for the
    map to load, because there are no "hooks" in the DOM for individual
    features until they've been parsed and rendered by the map component's own
    JavaScript. This introduced another layer of asynchronicity to deal with,
    complicating the coordination with fetching tabular data.

The result wasn't *bad*, but it wasn't great either. Our `<eiti-map>` custom
element allowed us to declaratively (and programmatically, in our Jekyll
templates) place lots of different maps on each page and style them in
intersting ways, but the performance and integration overhead were high.

### After
The new approach pushes most of the processor-intensive work into static build
steps that generate SVG and image files with reusable layers for each type of
feature that we need in our maps: state and county polygons, the line "meshes"
that separate them, and raster layers for more complex areas, such as federal
land ownership. This means that, ignoring data-driven fills (for now), we can
build and style maps *entirely* from [SVG &lt;use&gt;][svg use] elements that
each reference one "layer" in our stack:

```html
<svg class="map" viewBox="0 0 960 670">
  <use fill="#ccc" xlink:href="/maps/states/all.svg#states"/>
  <use fill="#f00" xlink:href="/maps/states/all.svg#CA"/>
  <use stroke="#fff" xlink:href="/maps/states/CA.svg#counties-mesh"/>
  <use stroke="#999" xlink:href="/maps/states/all.svg#states-mesh"/>
  <use stroke="0f00" xlink:href="/maps/states/all.svg#CA"/>
</svg>
```

The trick here is the [SVG viewBox attribute][viewbox], which tells the browser
to zoom in to a given region of the SVG's canvas, and can also establish the
SVG element's [intrinsic aspect ratio][svg scaling]. All of our SVG files share
a common screen coordinate space because we generate them with the same map
projection, so zooming the outermost `<svg>` element affects all of them in the
same way. (Another really cool thing about the `viewBox` is that if you can add
CSS `padding` to your SVG element, the zoomed region will be inset by that
distance. No transforms needed!)

There are two important things that we need to do in the "reference" SVG
files to make this work the way we want it to:

1. In order to style these "placed" elements individually with CSS or
   attributes on each `<use>` element, we need to set the `fill`, `stroke`,
   and `stroke-width` styles for each `<path>` to `inherit`. This allows the
   styles from the referencing document to cross the `<use>` boundary.

1. Normally, scaling elements with will scale their stroke widths, which
   looks *really* bad. The trick to defeating this is to give each `<path>`
   a `vector-effect="non-scaling-stroke"` attribute, which tells the browser
   to keep the stroke a constant width regardless of scale.

Armed with these reusable, addressable vectors, we can do pretty much
anything that we were able to with the old approach. From a performance
perspective, we're also in much better shape:

* As of this writing, the SVG for states is 480K (216K gzipped), and the
  largest county SVG for a single state is that of Texas at 184K (a slim 48K
  gzipped). So on a page with multiple county maps of Texas, we're looking
  at less than 300K to download all of the data. Compressed, all of the
  state and county maps combined take up about 800K. Simplification of the
  geometries and SVG optimization with a tool like [svgo][svgo] could reduce
  the file size footprint even more.

* We can now dynamically style individual features without worrying about
  whether the map is loaded, assuming that each feature gets its own `<use>`
  element. For instance, we can create a choropleth by applying a color
  scale that uses data attributes on each one, and the JavaScript can be
  synchronous because it doesn't need to wait for the shapes to load: Just
  set the `fill` attribute, and the browser handles the rest. And if we do
  need to do anything fancy (for instance, zoom into a feature whose bounds
  aren't known when we generate the page), we can listen for the `load`
  event on an SVG element before doing our magic.

## Tasks
All of the build tasks are defined in the [Makefile](Makefile). For instance,
to rebuild everyting from scratch:

```sh
make clean all
# or, to skip the clean step and treat everything as stale
make -B all
```

There are a couple of expectations baked into these build scripts:

1. You've already run `npm install` at the project root.

1. To build the optimized image layers (e.g. for land ownership), you'll need
   the [ImageMagick][ImageMagick] `convert` tool. You can install this on OS X
   with:

   ```sh
   brew install imagemagick
   ```


## State Maps
The [states directory](states/) contains SVG maps for each US state (with
counties), and an `all.svg` containing all of the state boundaries. To build
them, run:

```sh
make -B state-maps
```

Currently, each map is generated individually by the same script:
[state-map.js](bin/state-map.js). This may be replaced with [svgeo][svgeo], or
with a script that generates all of the maps in one run, which would be much
faster than reloading the US TopoJSON once for each file.


## SVG viewBox Data
In order to get the maps working without JavaScript, we need access to the
pixel bounds of each state in our Jekyll templates. These bounds are called the
[viewBox][viewBox] in SVG, and the format is a space-separated string:

```
x y width height
```

Currently, the way we extract these is **very hacky**: we use the `xpath` CLI
tool to query the root `viewBox` attribute of each SVG file and parse out the
value with a Perl one-liner, then print each one out to successively build up
YAML output that gets written to
[/_data/viewboxes.yml](../_data/viewboxes.yml). One way to improve this would
be to output viewBox data as the SVG files are generated, so that we don't have
to query the resulting files and can do away with the shell script munging.


## Land Ownership Layers
Land ownership data is very precise, and as a result it's difficult to turn
into reasonably small vector data. So what we're currently doing is generating
retina-resolution (2x) images of the land ownership data in pure black, then
scaling them down in SVG and reducing their opacity in CSS. The build process
for a single layer looks like this:

1. **TopoJSON to PNG**

  The first step in generating these layers is to output an unoptimized PNG
  with 8-bit transparency. The [rasterize.js](bin/rasterize.js) script takes
  one or more TopoJSON filenames and draws every polygon in each with a black
  fill and half-pixel stroke (to fill in the thin gaps between adjacent
  polygons). As of this writing, the federal land PNG weighed 380K.

1. **PNG to GIF**

  Next, we use [ImageMagick][ImageMagick] to posterize the PNG down to 2
  colors, treat white as transparent, and convert to GIF. The 8-bit GIF version
  of the federal land PNG is much slimmer at 88K.


[ImageMagick]: http://www.imagemagick.org/
[viewBox]: https://sarasoueidan.com/blog/svg-coordinate-systems/#svg-viewbox
[svg use]: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use
[svg scaling]: https://css-tricks.com/scale-svg/#article-header-id-3
[svgo]: https://github.com/svg/svgo
