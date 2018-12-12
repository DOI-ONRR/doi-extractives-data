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

- We had to use our personal Mac computers to update the data.
- We didn't have one source of truth for the data: we had `.tsv` data files to update the site visualizations with, and we had Excel files for download, both of which had to be manually maintained.
- Updating the data required specific software dependencies (Make, SQLite3, npm), which our data specialists and subject matter experts lacked. Which meant...
- A developer had to update the data.
- The codebase had a significant learning curve for new developers, due to the custom implementation of Jekyll.

At the same time, we didn't want to lose momentum on our user-centered design and development process, which we inherited from the skilled team at 18F. We'd identified new features that would benefit our users, and we wanted to keep iterating on the site. One of those features was an updated homepage design, intended to meet user needs with high-demand, timely data presented directly on the homepage.

How we chose [GatsbyJS](https://www.gatsbyjs.org/) is the subject of a separate post, but our homepage proved to be an early proof of concept for fully transitioning our codebase.

## A hybrid site

We knew we'd have to segment our transition to GatsbyJS into our [Agile workflow](https://en.wikipedia.org/wiki/Agile_software_development), which meant we would have a hybridized site for the duration of the transition: part Jekyll, part GatsbyJS. It would result in some redundancy, with duplicative effort for some updates. But it would allow us to continue to iterate on the site, while incrementally transitioning our codebase. Our biggest goal was to maintain a seamless experience for users, in line with Agile leader [Martin Fowler's description of refactoring](https://martinfowler.com/articles/agile-aus-2018.html):

> Refactoring is lots of small changes, none of which change the observable part of the software, but all of which change its internal structure. Usually (you refactor) because you want to make some new feature, and the current internal structure doesn't fit very well for that new feature. So you change the structure to make the new feature easy to fit in, all the time refactoring and not breaking anything, and then you can put it in.

We'd transitioned some of our site already: we migrated our [explore data page](https://revenuedata.doi.gov/explore/), which was a heavy lift that proved we could support both workflows simultaneously (the page serves as the data-heavy fulcrum of the site).

The homepage presented an exciting opportunity, as the redesign would feature monthly data for the first time on the site. Up until that point, we'd published only annual data. It meant we needed a way to quickly and easily update the data.

## Rebuilding our homepage in GatsbyJS

There are five main advantages we enjoyed by using GatsbyJS for the homepage:

1. [GraphQL](https://graphql.org/) allows us to query the data from a canonical source, instead of regenerating the data into multiple files to fit a particular context.

2. Anyone on our team can update the data, because GraphQL is now reading into an Excel file. Team members only need Excel and GitHub to update the data, and we have one source of truth for each dataset.

3. We're using a modern, web-component framework that allows us to design the site in a more modular way, which leads to better code reuse compared to Liquid templating.

4. We're aligned with industry best practices, which supports long-term site maintenance.

5. We have a cross-platform ecosystem out of the box.

### GraphQL

GraphQL has been a game changer for us. Our open data is largely comprised of flat Excel files, but we also have some data we access via API. Much of our content is formatted in Markdown. GraphQL can query it all in a schema whereby we get exactly the data and content we need for a particular context. 

Where before our data-update scripts would generate multiple `.yml` files – structured for the specific context in which the data would appear – we can now query the data with GraphQL and reference it in whatever context we need. Importantly, we maintain just one canonical data file and structure our query to fetch what we need.

We use the [`gatsby-transformer-excel` plugin](https://www.gatsbyjs.org/packages/gatsby-transformer-excel/) to parse our Excel data and convert it into `JSON` arrays accessible to both GraphQL and D3.js, our data visualization library.

- We're using GraphQL to read into an Excel file
- Into the schema that we then query
- Gatsby Excel plugin
- Will be the same files users can download
- Our data experts can now update the data on their own

Here's a sample GraphQL query from the homepage to fetch revenue data:

```graphql
    Revenues:allRevenues (
      filter:{RevenueCategory:{ne: null}}
      sort:{fields:[RevenueDate], order: DESC}
    ) {
      revenues:edges {
        data:node {
          RevenueDate
          RevenueMonth:RevenueDate(formatString: "MMMM")
          RevenueYear:RevenueDate(formatString: "YYYY")
          DisplayYear:RevenueDate(formatString: "'YY")
          DisplayMonth:RevenueDate(formatString: "MMM")
          Revenue
          RevenueCategory
        }
      }
    }
```
normal text

### Modularity
- React's component framework allows gives us modularity which makes the site more maintainable. 
- We have reusable components instead of context-dependent templates
- CSS modules localizes styling to the component level, simplifying CSS and reducing sprawl and decay
- 