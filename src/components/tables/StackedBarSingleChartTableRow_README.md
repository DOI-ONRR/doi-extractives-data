---
title: Table Row with Stacked Bar
componentName: StackedBarSingleChartTableRow
patternCategory: Tables
---

```
<StackedBarSingleChartTableRow 	year={2017}
			            		name={"Fund Name"}
			            		description={"Fund Description"} 
			            		descriptionLink={{to:"#", name:"Link to no where"}}
			            		maxValue={100}
			            		chartData={[{'Onshore':60, 'Offshore': 50, 'GOMESA':100}]} />
```

This pattern displays a table with a fund or source, a description, and a horizontal bar chart. It allows us to show a total amount (the full width of the bar) and relative amounts for components of the total (through color variations). For example, the disbursements horizontal bars display the relative volumes for geographic origin (onshore, offshore) and/or authorization (e.g. GOMESA) that comprise the total disbursement to a given fund.

## How to use
This pattern is best used to display totals and portions of those totals in a single bar. It is spatially efficient, because it uses a single bar to display multiple volumes. It should be used when there are three or more component portions of a total. If there is one discrete amount, this chart pattern is unnecessary. If there are only two values, showing two separate bars may be more intuitive than using the stacked pattern. 

Color contrast is a challenge when using stacked charts. The contrast between the bar colors must be sufficient to visually distinguish them. But each color should also have [sufficient contrast with the chart's background color to be accessible](https://webaim.org/resources/contrastchecker/). 

This balance can be difficult to achieve with certain color palettes. Consequently, the chart color must not be the only way to see and understand the relative volumes; the numeric values should be listed as well, without interacting with the chart. 

### Chart data
This is an array of objects that will be used to populate the stacked bar

### Max value
You can pass a max value to the bar chart that will be used to relatively size the bar to that max value vs the max value of the chart data only.

### CSS for colors:
Each colored box next to the data name can be colored using css.

### Developer Details:
This stacked bar uses D3 to render the data visualization. The react component is just a wrapper that links to D3 by lifecycle events. 