---
title: "How we decided to rebuild our open-data homepage: part two"
authors:
- Ryan Johnson
- Jeff Keene
excerpt: In our second post about our homepage rebuild, we share how we converted our homepage to GatsbyJS with React/Redux, GraphQL, and D3 to visualize data sourced from Excel files, as we refactor the entire site.
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

## An early obstacle

When our team was hired to transition the site from [18F](https://18f.gsa.gov/) in late 2017, one issue emerged as an immediate concern. Our team was issued Windows 7 laptops, and we had a problem (thankfully, we've since received Windows 10 machines), but the site's codebase wasn't particularly cross-platform friendly. Jekyll is built on Ruby: the former isn't officially supported on Windows, and the latter doesn't ship with Windows (as it does with macOS). To complicate matters further, the script to perform the most routine content management on the site – update the production, revenue, and disbursements data – assumed macOS/Linux output paths (forward slashes); the script broke on Windows.

Of course, we could have refactored just the data-update script, but that would have prevented macOS/Linux users from easliy forking and modifying [our code from GitHub](https://github.com/ONRR/doi-extractives-data). We wanted to create a workflow that would solve some of our biggest issues:

- We had to use our personal macOS computers to update the data.
- Updating the data required specific software dependencies (Make, SQLite3, npm), which our subject matter experts lacked.
- A developer had to update the data.

At the same time, we didn't want to lose momentum on our user-centered design and development process, which we inherited from the skilled team at 18F. We'd identified new features that would benefit our users, and we wanted to keep iterating on the site. One of those features was an updated homepage design, intended to meet user needs with high-demand, timely data presented directly on the homepage.

How we chose [GatsbyJS](https://www.gatsbyjs.org/) is the subject of a separate post, but our homepage proved to be an early proof of concept for fully transitioning our codebase.

## A hybrid site

We knew we'd have to segment our transition to GatsbyJS into our [agile workflow](https://en.wikipedia.org/wiki/Agile_software_development), which meant we would have a hybridized site for the duration of the transition. It would result in some redundancy, with duplicative effort for some updates. But it would allow us to continue to iterate on the site, while incrementally transitioning our codebase.

We had transitioned some of our site already: we migrated our [explore data page](https://revenuedata.doi.gov/explore/), which was a heavy lift that proved we could support both workflows simultaneously (the page serves as the data-heavy fulcrum of the site).

The homepage presented an exciting opportunity, as the redesign would feature monthly data for the first time on the site. Up until that point, we'd published only annual data. It meant we needed a way to quickly and easily update the data.

## Rebuilding our homepage in GatsbyJS
