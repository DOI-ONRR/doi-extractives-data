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
  # Explore Data Page Frontmatter
  
---
title: Explore data
layout: none
permalink: /explore/
redirect_from:
  - /explore/exports/
  - /explore/gdp/
  - /explore/jobs/
  - /explore/all-lands-production/
  - /explore/federal-production/
  - /explore/disbursements/
  - /explore/federal-revenue-by-location/
---

4. Delete all contents of gatsby-public
5. Copy contents in the gatsby-site/public to gatsby-public

## Leveraging Atomic Design Methodology
Our React component code is organized by leveraging the Atomic Design Methodology approach. This helps us in organizing our code in logical way that is not bound by our current site design. 

## D3 and React Integration Approach
Since both React and D3 want to control the DOM we had to decide on a approach to leverage the best of both worlds. We wanted to leverage React for its Virtual DOM, Redux for its data management and D3 for its charting/math capabilties. So in order for us to maximize what we wanted from all libraries we decide on a "React Lifecycle Methods" approach. Here is a great article that summarizes the various approaches we reviewed.

https://www.smashingmagazine.com/2018/02/react-d3-ecosystem/

More about the React Lifecycle Method approach

http://nicolashery.com/integrating-d3js-visualizations-in-a-react-app/

https://medium.com/@sxywu/on-d3-react-and-a-little-bit-of-flux-88a226f328f3



