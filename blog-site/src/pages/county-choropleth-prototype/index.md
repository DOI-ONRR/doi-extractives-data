---
title: "Mapping revenue data by county"
authors:
- Ryan Johnson
excerpt: "We've been exploring options for the geographic representation of revenue data. In this post, we explore the variability in revenue data by county (with Python) and produce a choropleth map (with D3.js)."
tags:
- map
- d3
- python
- revenue
- data
- county
date: "2019-04-18"
---

Our team has been working on alternative presentations of revenue data from natural resource extraction on federal lands. Understanding much of our data is tied to a location, we'd like to expand the geospatial options for viewing the data and test some prototypes with users.

I wanted to get a sense of the variation in the data, so I would know if it was feasible to present the data geographically by county. Assuming it was feasible to present the data by county, I also wanted to know which scale I would need to use to display the data in such a way as to convey sufficient variation in the data.

## Python Pandas for data analysis

I've been using the [Pandas library](https://pandas.pydata.org/) for [Python](https://www.python.org/) for just this sort of thing. Not only can one quickly derive statistics from the data — such as mean, median, and standard deviation — but Pandas also provides tools for manipulating, organizing, and exporting data, among other things.

The source dataset I used had multiple revenue line items for each county, since it included different types of revenue from extraction on federal land (such as [bonuses, rent, and royalties](https://revenuedata.doi.gov/how-it-works/revenues/#federal-lands-and-waters)). I manually eliminated some columns in Excel (because that was easier than using Pandas), but I summed up the `rate` (revenue) column for each county so there was only one line item for each (I forked the [choropleth Observable Notebook](https://observablehq.com/@d3/quantile-choropleth) from D3 creator Mike Bostock, and lazily retained the column header `rate` that he used for unemployment rates...it's a prototype, after all).

That relatively simple Python code looks like this:

```python
import pandas as pd

file = r'revenue-test.csv'

#Pandas drops leading 0 of FIPS id without this
df = pd.read_csv(file, dtype={'id': 'str'})

#Sums up rate column when multiple entries exist for each id (county, in this case)
df2 = df.groupby(['id', 'state', 'county'])['rate'].sum()
df2 = df2.reset_index()

#Reads file to a new file, omits index from Pandas, and retains header
df2.to_csv('revenue-test-merged.csv', index=False, header=True)
```

That gives us our revenue file, with each county's revenue (`rate`) summed up and listed as one line item. I renamed the merged file and [published it](https://raw.githubusercontent.com/rentry/rentry.github.io/master/data/revenue-test.csv) so I could access it from the [Observable Notebook](https://observablehq.com/@rentry/quantile-choropleth).

I also wanted to get a sense of the distribution of the data itself, especially after I initially used a [quantize scale](https://github.com/d3/d3-scale#quantize-scales) for the choropleth and found that the scale [could not adequately capture the distribution of values](https://observablehq.com/@rentry/choropleth). 

![Map of the United States showing relative revenue figures by county](./revenue-by-county-map-quantize.svg)

Among other problems, this scale had the effect of visually equating (for example) $88 million and $574 million at the top end, and $52 and $12 million at the low end (not to mention _negative_ values on the low end). There was just too much variation in the data for this type of scale.

Using Pandas, I soon discovered the reason why:

**Median:** $30,928.34<br />
`df['rate'].median()`

**Mean:** $5,903,835.33<br />
`df['rate'].mean()`

**Standard deviation:** $39,062,215.48<br />
`df['rate'].std()`

As you can see, the median is only $30,928, while the mean is $5,903,835. There are clearly outliers on the top end of the data pulling on the mean. We can see from the standard deviation — which is nearly $40 million — there is significant variation in the data.

As a result, I explored using a [quantile scale](https://github.com/d3/d3-scale#quantile-scales) instead to preserve the variation in the data.

## Quantile choropleth

I settled on a quantile scale that interpolates the values along a range, again, forked from Mike Bostock's work.

![Map of the United States showing relative revenue figures by county](./revenue-by-county-map.svg)

This scale preserves the variations in the data with more fidelity, especially at the lower end of the distribution.

It needs more work, but it serves as a good prototype for evaluating a geographic presentation of the data.