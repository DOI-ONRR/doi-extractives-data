U.S. Extractive Industries Data and Information
=======================================================

##What

The U.S. earns revenue on natural resources extracted from its Federal lands, both onshore and offshore. This is a major source of revenue for both the country and local municipalities, and includes revenue from resources such as oil, gas, coal and geothermals.

This repository contains the code for useiti.doi.gov, which is a website that includes both curated content and raw data that will inform the national and international conversation around extractive industries revenue. It will provide a valuable resource for data and information analysis and visualizations that can be readily understood and accessed by the public for re-use through other media and applications.

##Why

This effort is part of the President’s [Open Government Partnership National Action Plan](http://www.whitehouse.gov/blog/2013/12/06/united-states-releases-its-second-open-government-national-action-plan), which commits the U.S. to ensuring that taxpayers are receiving every dollar due for extraction of the U.S.’s natural resources.

The U.S. also recently became a part of an international standard called the [Extractive Industries Transparency Initiative (EITI)](http://www.eiti.org/). EITI is a global coalition of governments, companies and civil society working together to improve openness and accountable management of revenues from natural resources. For more information on the U.S. process of implementing the EITI standard, see the [USEITI homepage](http://www.doi.gov/eiti). The U.S. will be the first developed country to sign on to and follow the standard.

##About this website

This is the development branch of the v2 [US EITI](https://useiti.doi.gov) site. 

## Getting Started
1. Get [Node.js](https://nodejs.org)
2. Install the dependencies with `npm install`
3. Run the web server with `npm start`

## Data
See the [data](data/) directory for more info.

## Styleguide
```sh
npm install -g npm-exec
npm run build-styleguide
```

## Tests
To run the tests:

```sh
npm install --dev
npm test
```

##Roadmap

Broadly, we are working now on:
* Exploring how lease contract information and data can be integrated into the site in a way that meets user needs
* Exploring how production data can be added to the site in a way that meets user needs
* Develop site information architecture so that it is clear that it is a part of USEITI, can accomodate new datasets and has a stronger 'why you're here and why you should care' message
* Reaching out to users to see how we did with the Beta, and learn from them where to head next

For a more detailed roadmap, please see our [repository's wiki](https://github.com/18F/doi-extractives-data/wiki).


##Contributing

Content and feature suggestions are welcome via GitHub Issues. Code contributions are welcome via pull request, although of course we cannot guarantee your changes will be included in the site.


### Public domain

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.
