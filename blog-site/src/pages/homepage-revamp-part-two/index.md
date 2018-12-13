---
title: "How we decided to rebuild our open-data homepage: part two"
authors:
- Ryan Johnson
- Jeff Keene
excerpt: In our second post about our homepage rebuild, we share how we converted our homepage to GatsbyJS with React/Redux, GraphQL, and D3 to visualize data sourced from Excel files, as we refactor the entire site.
tags:
- open data
- natural resources revenue data
- gatsby
- graphql
- design
- data visualization
- excel
- d3
- react
- redux
date: "2018-12-20"
---

_This is the second post in our two-part series about our homepage redesign. [Read part one here](/homepage-revamp/)._

A few months ago, our small team at the Office of Natural Resources Revenue (ONRR) decided we needed to refactor our [open-data website](https://revenuedata.doi.gov/). We knew we were in for a massive undertaking, as the site was originally built largely with [Jekyll](https://jekyllrb.com/), with significant custom coding to furnish bespoke features, automate data updates, and compile and deploy the site with 18F's fantastic static-site hosting service, [Federalist](https://federalist.18f.gov/).

## An early obstacle

When our team was hired to transition the site from [18F](https://18f.gsa.gov/) in late 2017, one issue emerged as an immediate concern. Our team was issued Windows 7 laptops (thankfully, we've since received Windows 10 machines), and we had a problem; the site's codebase wasn't particularly cross-platform friendly. Jekyll is built on Ruby: the former isn't officially supported on Windows, and the latter doesn't ship with Windows (as it does with macOS). To complicate matters further, the script to perform the most routine content management on the site – update the production, revenue, and disbursements data – assumed macOS/Linux output paths (forward slashes). The script broke on Windows.

Of course, we could have refactored just the data-update script, but that would have prevented macOS/Linux users from easliy forking and modifying [our code from GitHub](https://github.com/ONRR/doi-extractives-data). We wanted to create a workflow that would solve some of our biggest issues:

- We had to use our personal Mac computers to update the data.
- We didn't have one source of truth for the data: we had `.tsv` data files to update the site visualizations with, and we had Excel files for download, both of which had to be manually maintained.
- Updating the data required specific software dependencies (Make, SQLite3, npm), which our data specialists and subject matter experts lacked. Which meant...
- A developer had to update the data.
- The codebase had a significant learning curve for new developers, due to the custom implementation of Jekyll.

At the same time, we didn't want to lose momentum on our user-centered design and development process, which we inherited from our colleagues at 18F. We'd identified new features that would benefit our users, and we wanted to keep iterating on the site. One of those features was an updated homepage design, intended to meet user needs with high-demand, timely data presented directly on the homepage.

A refactored homepage served as an early proof of concept for fully transitioning our codebase.

## A hybrid site

We knew we'd have to segment our transition to GatsbyJS into our [Agile workflow](https://en.wikipedia.org/wiki/Agile_software_development), which meant we would have a hybridized site for the duration of the transition: part Jekyll, part Gatsby. It would result in some redundancy, with duplicative effort for some updates. But it would allow us to continue to iterate on the site, while incrementally transitioning our codebase. Our biggest goal was to maintain a seamless experience for users, in line with Agile leader [Martin Fowler's description of refactoring](https://martinfowler.com/articles/agile-aus-2018.html):

> Refactoring is lots of small changes, none of which change the observable part of the software, but all of which change its internal structure. Usually (you refactor) because you want to make some new feature, and the current internal structure doesn't fit very well for that new feature. So you change the structure to make the new feature easy to fit in, all the time refactoring and not breaking anything, and then you can put it in.

We'd transitioned some of our site already: we migrated our [explore data page](https://revenuedata.doi.gov/explore/), which was a heavy lift that proved we could support both workflows simultaneously (the page serves as the data-heavy fulcrum of the site).

The homepage presented an exciting opportunity, as the redesign would feature monthly data for the first time on the site. Up until that point, we'd published only annual data. It meant we needed a way to quickly and easily update the data.

![homepage design of natural resources revenue data, featuring a map of the U.S., and charts for natural resources production, revenue, and disbursments on federal lands and waters](./full-homepage.jpg)

## Rebuilding our homepage in Gatsby

Thankfully, Gatsby is open source. Had it not been, we wouldn't have considered it. Our team [works in the open, with open data, and open source tools](https://github.com/ONRR/doi-extractives-data). We think that model is a good fit for government. 

In addition to being open source, there are five main reasons we used Gatsby to rebuild the homepage:

1. We have a cross-platform ecosystem out of the box. 

1. [GraphQL](https://graphql.org/) allows us to query the data from a canonical source, instead of regenerating the data into multiple files to fit a particular context.

1. Anyone on our team can update the data. Team members need only Excel and GitHub to update the data, and we have one source of truth to maintain for each dataset.

1. Gatsby is a modern, web-component framework that allows us to design the site in a more modular way, which leads to better code reuse.

1. We're better aligned with industry best practices, which supports long-term site maintenance.
 

We'll look at each of these in the context of our homepage redesign.

### Cross-platform ready

As mentioned above, our most significant challenge transitioning the codebase from 18F to our team was operating system compatibility. We struggled to get approval from our IT group for everything we needed to support the site. It was a time consuming process that, even when we were granted administrative privileges, still left us with dependecy errors and a parallel data-update workflow using separate machines.

Gatsby combines multiple front-end tools into one, and the packages are managed with npm or yarn, so the scope of requests is limited to widely used package managers. From what we can tell so far, running Gatsby is nearly identical regardless of the operating system you're using.

### GraphQL

GraphQL has been a game changer for us. Our open data is largely comprised of flat Excel files, but we also have some data we access via API. Much of our content is formatted in Markdown. GraphQL can query it all in a schema whereby we get exactly the data and content we need for a particular context. 

Where before our data-update scripts would generate multiple `.yml` files – structured for the specific context in which the data would appear – we can now query the data with GraphQL and reference it in whatever context we need. Importantly, we maintain just one canonical data file and structure our query to fetch what we need.

We use the [`gatsby-transformer-excel` plugin](https://www.gatsbyjs.org/packages/gatsby-transformer-excel/) to parse our Excel data and convert it into `JSON` arrays accessible to both GraphQL and D3.js, our data visualization library.

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

Every member of our team can now update the homepage data, using only Excel and GitHub on their government-issued laptops. Now that we're publishing data every month, with a team distributed across multiple time zones, that makes a _huge_ difference. GraphQL dramatically improves our ability to quickly correct mistakes, ship content updates, and iterate on our data visualizations.

We update the Excel file, and we get our updated charts on build.

![Homepage data visualizations showing Revenue and Disbursements](./homepage-revenue-disbursements.jpg)

Our three "innovation specialists" (design and development team members) are limited to four years in each of our respective positions, so one of our biggest priorities over that time is to create a sustainable workflow for content management on the site. Transforming our data-update workflow is a significant step in that direction, but one of the other advantages of Gatsby is its ability to pull in data from virtually any source, including databases and content management systems. The site will always need some level of developer support, but Gatsby's flexible architecture means we can start to look toward content management workflows that are practical for more of our team members.

### Modularity

Perhaps React's rising popularity is due to its modularity in the form of React components. Our site features repeating instances of similar or identical patterns, so Gatsby's use of React was attractive to our team.

For example, the `KeyStatsSection` component references the `StackedBarChartLayout` component, passing it props:

```jsx
		return (
			<div is="chart">
				<StackedBarChartLayout 

					dataSet= {this.state[dataSetId]}

					title= {title}

					styleMap= {CHART_STYLE_MAP}

					sortOrder= {CHART_SORT_ORDER}

					legendTitle= {CHART_LEGEND_TITLE}

					legendDataFormatFunc= {dataFormatFunc || utils.formatToCommaInt}

					barSelectedCallback= {this.dataKeySelectedHandler.bind(this, dataSetId, this.state[dataSetId].syncId)}

				>
				</StackedBarChartLayout>
			</div>
		);
```

#### Pattern library

This component architecture also feeds our pattern library (not yet live), so when we build or change a component, our pattern library will update itself. We will then have a working inventory of our components to reference for new feature development.

#### CSS Modules

With our homepage rebuild, we also started using [CSS Modules](https://github.com/css-modules/css-modules). CSS Modules are CSS files "in which all class names and animation names are scoped locally by default," and they're a great way to avoid selector name collisions and limit the accumulation of unused styles.

Scoping and storing each component's CSS locally makes it much easier to track down and edit a component's styling.

### A modern framework

Nothing is future-proof in technology, but migrating to Gatsby gets us closer, with a flexible, modular architecture and a growing and spirited community of developers behind it. By migrating to Gatsby, we're trying to build a maintainable, future-friendly codebase for the team that comes after us.

## Challenges during rebuild

While our experience refactoring the homepage was largely positive, we have faced some challenges migrating to Gatsby...