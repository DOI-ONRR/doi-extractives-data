# U.S. Extractive Industries Data and Information

## What

The U.S. earns revenue on natural resources extracted from its Federal lands, both onshore and offshore. This is a major source of revenue for both the country and local municipalities, and includes revenue from resources such as oil, gas, coal and geothermals.

This repository contains the code for useiti.doi.gov, which is a website that includes both curated content and raw data that will inform the national and international conversation around extractive industries revenue. It will provide a valuable resource for data and information analysis and visualizations that can be readily understood and accessed by the public for re-use through other media and applications.

## Why

This effort is part of the President’s [Open Government Partnership National Action Plan](http://www.whitehouse.gov/blog/2013/12/06/united-states-releases-its-second-open-government-national-action-plan), which commits the U.S. to ensuring that taxpayers are receiving every dollar due for extraction of the U.S.’s natural resources.

The U.S. also recently became a part of an international standard called the [Extractive Industries Transparency Initiative (EITI)](http://www.eiti.org/). EITI is a global coalition of governments, companies and civil society working together to improve openness and accountable management of revenues from natural resources. For more information on the U.S. process of implementing the EITI standard, see the [USEITI homepage](http://www.doi.gov/eiti). The U.S. will be the first developed country to sign on to and follow the standard.

## About this website
This is the development branch of the v2 [US EITI](https://useiti.doi.gov) site.

## Data
The [data catalog](https://github.com/18F/doi-extractives-data/wiki/Data-Catalog) explains what most of the data is and where it came from. See the [data](data/) directory for more detailed info and instructions on updating the data.

## Running the Site
This site is made with [Jekyll]. To run it locally, clone this repository then:

1. Get [Jekyll] and the necessary dependencies: `bundle install`
1. Install all node dependencies: `npm install`
1. Set the $NODE_ENV to `dev`: `export NODE_ENV=dev`
1. Package js files with webpack: `webpack --watch`
1. Run the web server: `bundle exec jekyll serve` (or just `jekyll serve` if you have Jekyll installed globally)
1. Visit the local site at [http://localhost:4000](http://localhost:4000)

## Deployment
This site is deployed on [Federalist](https://federalist.18f.gov), and will one day be deployed automatically whenever commits are pushed to the `master` branch. For now, see the [preview URLs wiki page](https://github.com/18F/doi-extractives-data/wiki/Preview-urls) for more information.

If deploying the site to a production environment, make sure to minify the JS files:
1. Set the $NODE_ENV to `prod`: `export NODE_ENV=prod`
1. Package js files with webpack: `webpack --watch`
1. Re-run the web server: `bundle exec jekyll serve`

## Styleguide
```sh
npm install --dev
npm run init-styleguide
cd styleguide-template && npm install
cd ..
npm run watch
```

## Tests
The JavaScript tests currently only cover a small portion of data processing utilities. You can run them with [Node]:

```sh
npm install --dev
npm test
```

## Code Style
We use [Hound CI](https://houndci.com/) to enforce SCSS and JavaScript
formatting conventions on new commits. You can run both of the linters with:

```sh
npm run lint
```

This runs both of the linters below in series.

#### JavaScript Linting
Hound uses [jshint](http://jshint.com/), which you can install as part of the
npm package's `devDependencies` with:

```sh
npm install --dev
```

Or you can install it globally with `npm i -g jshint`. Then, to lint the
JavaScript, run:

```sh
npm run lint-js
```

#### SCSS Linting
Hound uses [scss-lint](https://github.com/brigade/scss-lint), which you can
install with `gem install scss_lint` if you haven't already run `bundle
install` to get Jekyll and its dependencies. To lint the SCSS files, run:

```sh
bundle exec scss-lint -c .scss-lint.yml
```

or simply:

```sh
npm run lint-scss
```

## Roadmap
Broadly, we are working now on:

* Exploring how lease contract information and data can be integrated into the site in a way that meets user needs
* Exploring how production data can be added to the site in a way that meets user needs
* Develop site information architecture so that it is clear that it is a part of USEITI, can accomodate new datasets and has a stronger 'why you're here and why you should care' message
* Reaching out to users to see how we did with the Beta, and learn from them where to head next

For a more detailed roadmap, please see our [repository's wiki](https://github.com/18F/doi-extractives-data/wiki).


## Contributing
Content and feature suggestions are welcome via [GitHub Issues](https://github.com/18F/doi-extractives-data/issues). Code contributions are welcome via [pull request](https://help.github.com/articles/using-pull-requests/), although of course we cannot guarantee your changes will be included in the site.


### Public domain

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.

[Ruby]: https://www.ruby-lang.org/en/
[Jekyll]: http://jekyllrb.com/
[Node]: https://nodejs.org/en/
