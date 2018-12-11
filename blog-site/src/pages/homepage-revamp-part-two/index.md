---
title: "How we decided to rebuild our open-data homepage: part two"
authors:
- Ryan Johnson
- Jeff Keene
excerpt: We recently rebuilt the Natural Resources Revenue Data homepage. In our second post about the rebuild, we share how we converted the homepage to GatsbyJS with React/Redux, GraphQL, and D3 to visualize data sourced from Excel files.
tags:
- open data
- natural resources revenue data
- gatsbyjs
- graphql
- design
- data visualization
- excel
- d3
- react
- redux
date: "2018-12-20"
---

_This is part two of a two-part series about our homepage redesign. [Read part one here](/homepage-revamp/)._

A few months ago, our small team at the Office of Natural Resources Revenue decided we needed to refactor our [open-data website](https://revenuedata.doi.gov/). We knew we were in for a massive undertaking, as the site was originally built largely with [Jekyll](https://jekyllrb.com/), with significant custom coding to furnish bespoke features, automate data updates, and compile and deploy the site with 18F's fantastic static-site hosting service, [Federalist](https://federalist.18f.gov/).

When our team took over the site from [18F](https://18f.gsa.gov/), one issue came to the 