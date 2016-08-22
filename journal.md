# Resource Map Project Journal

This are notes that should help anybody wanting to emulate what we did here, thats
adapting the source code of https://github.com/18F/doi-extractives-data to our needs
and deploy it to production, allowing the client to update the data without technical
support or coding involved.

## Installation issues we faced

We encountered a problem running npm install on MacOS with Node 5.10.1, something with pty.js package

```
CXX(target) Release/obj.target/pty/src/unix/pty.o
In file included from ../src/unix/pty.cc:20:
../../nan/nan.h:324:27: error: redefinition of 'NanEnsureHandleOrPersistent'
  NAN_INLINE v8::Local<T> NanEnsureHandleOrPersistent(const v8::Local<T> &val) {
```

But we were able to run the project successful anyways, ignoring the error in npm
install, apparently all the other packages were installed correctly.

## German map setup

The geo data uses TopoJSON format, so we need to get a German map with states in
this format.

Following this tutorial https://milkator.wordpress.com/2013/02/25/making-a-map-of-germany-with-topojson/

Needed to install topojson npm package, also needed the GDAL library, for this we
used Homebrew.

The German states data link from the tutorial was broken so I found the same file
in a github repo, not that you actually need 3 files for a “shapefile”
(shp, .shx, .dbf).

The shape file comes from http://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-admin-1-states-provinces/.

This file contains most of the countries so it could be used to generate
this map for all of them.

I'm including the commands to generate the topojson from this file in the data/Malefile,
the only thing that was hard for getting this topojson to render was figuring out the
projection needed to be changed to “mercator” in the template.

In IE the stroke was very tick, turns out IE doesn’t support the option vector-effect:
non-scaling-stroke; which takes care of the stroke not scaling up in a SVG when zoomed
in, to make up for this we set the stroke-width to 0.1px, and 0.2px on hover.

## Making it multi language

To support multiple language we used "jekyll-multiple-languages-plugin"
https://github.com/Anthony-Gaudino/jekyll-multiple-languages-plugin

Most of the translation data are place in two separate (.yml) files (en.yml, de.yml) along with that some of the translation are also generating with help of Javascript files.

Adding new static Data:
1. If you want to add new section or paragraph than place it inside respected HTML file along with name and it's traslated content in language YML files.
2. For each link used in website need to check its language and depending on the language we need to place url. For your reference check header.html links.

Adding new language:
1. If you want to add new language entry than place its flag and respected entry inside header file.
2. create new language file (ex. en.yml) inside _i18n folder
3. Follow and assign site url depending on the language selection.

## Updating the data without technical support

In order to allow the client to update the data of the site without developers
assistance we created an Admin panel as a Node.js app, that allows to upload excel
files and converts them into the appropiate data format (.tsv and .json).

The Node.js app has a form where the client can select the year they want to upload
data to, and attach the excel necessary files (at the moment one for production data
and one for the production charts data). Then the Node.js app will convert the excel
files to .tsv and .json and place them in the data directory of this Jekyll site,
then rebuilding the site to pickup the new data.
