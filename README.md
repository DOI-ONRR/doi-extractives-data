U.S. Extractive Industries Data and Information
=======================================================

##What

The U.S. earns revenue on natural resources extracted from its Federal lands, both onshore and offshore. This is a major source of revenue for both the country and local municipalities, and includes revenue from resources such as oil, gas, coal and geothermals.

This repository contains the code for useiti.doi.gov, which is a website that includes both curated content and raw data that will inform the national and international conversation around extractive industries revenue. It will provide a valuable resource for data and information analysis and visualizations that can be readily understood and accessed by the public for re-use through other media and applications.

##Why

This effort is part of the President’s [Open Government Partnership National Action Plan](http://www.whitehouse.gov/blog/2013/12/06/united-states-releases-its-second-open-government-national-action-plan), which commits the U.S. to ensuring that taxpayers are receiving every dollar due for extraction of the U.S.’s natural resources.

The U.S. also recently became a part of an international standard called the [Extractive Industries Transparency Initiative (EITI)](http://www.eiti.org/). EITI is a global coalition of governments, companies and civil society working together to improve openness and accountable management of revenues from natural resources. For more information on the U.S. process of implementing the EITI standard, see the [USEITI homepage](http://www.doi.gov/eiti). The U.S. will be the first developed country to sign on to and follow the standard.

##About this website

doi-extractives-data is a static HTML/CSS/JS site built with a templating language called Jekyll. It also uses Sass as a preprocessor for its CSS.

<!--The site navigation and lists of resources that appear on the /resources page are maintained in easy-to-read YAML files (".yml") in the /_data directory.

GitHub is our CMS for this project. Content editors have GitHub accounts, edit the Markdown and YAML files themselves, and eventually, will preview the results on a github.io page. Once this site is out of Beta, pushes to the live server will be handled by the development team.

The site's interactive features are all JavaScript components, making Ajax (CORS) calls to external data sources. Search is powered by Beckley. The curated list of searchable resources is in /_data.-->

##Compiling and publishing changes

We depend on a few Ruby gems:

* `gem install jekyll`
* `gem install kramdown`
* `gem install psych -- --enable-bundled-libyaml`

We also depend on several Sass libraries and tools:

* `gem install sass`
* `gem install bourbon`
* `gem install neat`

If you are not familiar with how to work with Bourbon and Neat, visit their website at [bourbon.io](http://bourbon.io/).

To keep our code updating continuously as we edit, we use `jekyll serve --baseurl '' --watch`. As of Jekyll 2.2.0, [gh-pages compiles Sass natively](https://github.com/blog/1867-github-pages-now-runs-jekyll-2-2-0).

##Roadmap

Broadly, we are working now on:
* Exploring how lease contract information and data can be integrated into the site in a way that meets user needs
* Exploring how production data can be added to the site in a way that meets user needs
* Develop site information architecture so that it is clear that it is a part of USEITI, can accomodate new datasets and has a stronger 'why you're here and why you should care' message
* Reaching out to users to see how we did with the Beta, and learn from them where to head next

##Contributing

Content and feature suggestions are welcome via GitHub Issues. Code contributions are welcome via pull request, although of course we cannot guarantee your changes will be included in the site.


### Public domain

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.
