[![CircleCI](https://circleci.com/gh/onrr/doi-extractives-data/tree/dev.svg?style=svg)](https://circleci.com/gh/onrr/doi-extractives-data/tree/dev)

# U.S. Department of the Interior Natural Resource Revenue Data

This is the repository for active development work on [revenuedata.doi.gov](https://revenuedata.doi.gov). See [releases](https://github.com/onrr/doi-extractives-data/releases) for information about the current version of the site.

**For more detailed process, development, and data information, please see our [repository's wiki](https://github.com/onrr/doi-extractives-data/wiki).**

## What

The U.S. earns revenue on natural resources (such as oil, gas, coal and geothermals) extracted from federal lands and waters. This is a major source of revenue for both the federal government, state governments, and local municipalities.

This repository contains the code for revenuedata.doi.gov, which is a website that includes both curated content and raw data to better inform the national and international conversation around extractive industries revenue. It will provide data visualizations and information that’s  understandable to members of the public and can be re-used through other media and applications.

For more information about the history of the site, see [about this site](https://revenuedata.doi.gov/about/).

## Contributing
Content and feature suggestions are welcome via [GitHub Issues](https://github.com/18F/doi-extractives-data/issues). Code contributions are welcome via [pull request](https://help.github.com/articles/using-pull-requests/), although of course we cannot guarantee your changes will be included in the site. Take a look at the issues we've tagged [help wanted](https://github.com/onrr/doi-extractives-data/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22)!

See [CONTRIBUTING](CONTRIBUTING.md) for more information about how to pitch in.

### Public domain

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.

[Ruby]: https://www.ruby-lang.org/en/
[Jekyll]: http://jekyllrb.com/
[Node]: https://nodejs.org/en/

## Development Environment

### How it works
This project uses the [GatsbyJS](https://www.gatsbyjs.org/) open source framework. This framework builds static web pages that then are published to our production environment. You can read more about Gatsby on their website.

#### High Level Overview
Data and content is read into a graphql schema. This graphql schema is then used to create queries to get the data and content needed to create the pages in the site. Pages are generated either by a template or a React component in the pages directory. Once the page is built it is copied to the public directory into the appropriate subdirectory. All javascript, css and data are embedded into the page. At runtime the react components are initialzed and the page is rendered.



### Getting Started
Prerequisites:
- node
- npm

Once you have cloned the repository run:
> `npm install`

Local dev commands:
- `npm run develop` - This will start a local server running on port 8000 by default
- `npm run build` - This will create the static html pages that are used in the production environment
- `npm run server` - If you have run the local build command this wil start a web server so you can view the static html files on port 9000 by default
- `npm run clean` - This wil clean the cache created by the gatsby build process. Use this when you need a refresh the data the site uses.
- `npm run format` - This site uses eslint for fomratting and syntax checking
- `npm run test` - We current use Jest to create unit tests. This command will run all the tests locally.



