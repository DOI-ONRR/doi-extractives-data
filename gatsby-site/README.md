# gatsby-starter-default

Minimalistic starter template for Gatsby with Redux to get you started.

## Demo

https://caki0915.github.io/gatsby-starter-redux/

## Features

* [Redux](https://github.com/reactjs/redux) and [Redux-devtools](https://github.com/gaearon/redux-devtools).
* [Emotion](https://github.com/emotion-js/emotion) with a basic theme and SSR
* [Typography.js](https://kyleamathews.github.io/typography.js/)
* Eslint rules based on Prettier and Airbnb

## Install

For an overview of the project structure please refer to the [Gatsby documentation - Building with Components](https://www.gatsbyjs.org/docs/building-with-components/)

Install this starter (assuming Gatsby is installed) by running from your CLI:

```
gatsby new your-project-name https://github.com/caki0915/gatsby-starter-redux
```

## Deploy

Steps:
1. Update gatsby-config.js to include the appropriate path-prefix
2. Run gatsby build --prefix-paths
3. Update the generated pages with the related frontmatter.
  # About Page Frontmatter
  
---
title: About
layout: none
permalink: /about/
redirect_from: /about/whats-new/
---

4. Copy contents in the gatsby-site/public to gatsby-public
