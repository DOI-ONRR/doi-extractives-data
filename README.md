U.S. Federal Extractive Industries Data and Information
=======================================================

++What

A website to include both curated content and raw data that will inform the national and international conversation around extractive industries revenue. It will provide a valuable resource for data and information analysis and visualizations that can be readily understood and accessed by the public for re-use through other media and applications.

++Why

This effort is part of the President’s [Open Government Partnership National Action Plan](http://www.whitehouse.gov/blog/2013/12/06/united-states-releases-its-second-open-government-national-action-plan), which commits the U.S. to ensuring that taxpayers are receiving every dollar due for extraction of the U.S.’s natural resources.

The U.S. also recently became a part of an international standard called the [Extractive Industries Transparency Initiative (EITI)](http://www.eiti.org/). EITI is a global coalition of governments, companies and civil society working together to improve openness and accountable management of revenues from natural resources. For more information on the U.S. process of implementing the EITI standard, see the [USEITI homepage](http://www.doi.gov/eiti). The U.S. will be the first developed country to sign on to and follow the standard.

++About this website

doi-extractives-data is a static HTML/CSS/JS site built with a templating language called Jekyll. It also uses Sass as a preprocessor for its CSS.

<!--The site navigation and lists of resources that appear on the /resources page are maintained in easy-to-read YAML files (".yml") in the /_data directory.

GitHub is our CMS for this project. Content editors have GitHub accounts, edit the Markdown and YAML files themselves, and eventually, will preview the results on a github.io page. Once this site is out of Beta, pushes to the live server will be handled by the development team.

The site's interactive features are all JavaScript components, making Ajax (CORS) calls to external data sources. Search is powered by Beckley. The curated list of searchable resources is in /_data.-->

++Compiling and publishing changes

We depend on a few Ruby gems:

* `gem install jekyll`
* `gem install kramdown`
* `gem install psych -- --enable-bundled-libyaml`

We also depend on several Sass libraries and tools:

* `gem install sass`
* `gem install bourbon`
* `gem install neat`
* `gem install bitters`

If you are not familiar with how to work with Bourbon, Neat and Bitters, visit their website at [bourbon.io](http://bourbon.io/).

To keep our code updating continuously as we edit, we use `jekyll serve --baseurl '' --watch`. To keep our Sass compiling continuously, we use `sass --watch sass/styles.scss:css/styles.css`.

<!-- Markdown and YAML editing happens in the `gh-pages` branch, so the [preview page](https://18f.github.io/doi-extractives-data) is automatically updated as we commit edits. The static compiled HTML is updated into the `master` branch. To generate the static files and push them to `master`, we run `rake publish`. (See the `Rakefile` in the root directory for details on how this works.) -->

++Contributing

Content and feature suggestions are welcome via GitHub Issues. Code contributions are welcome via pull request, although of course we cannot guarantee your changes will be included in the site.

++License
<p xmlns:dct="http://purl.org/dc/terms/" xmlns:vcard="http://www.w3.org/2001/vcard-rdf/3.0#">
  <a rel="license"
     href="http://creativecommons.org/publicdomain/zero/1.0/">
    <img src="http://i.creativecommons.org/p/zero/1.0/88x31.png" style="border-style: none;" alt="CC0" /></a>
  <br /><br />
  To the extent possible under law,
  <a rel="dct:publisher"
     href="http://18f.gsa.gov">
    <span property="dct:title">18F</span></a>
  has waived all copyright and related or neighboring rights to this work.
This work is published from:
<span property="vcard:Country" datatype="dct:ISO3166"
      content="US" about="http://18f.gsa.gov">
  United States</span>.
</p>


