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

The StackedBarSingleChartTableRow is stacked. Ryan and/or Shannon please add a description.

## How to use
Wisely

### Chart Data:
This is an array of objects that will be used to populate the stacked bar

### Max Value:
You can pass a max value to the bar chart that will be used to relatively size the bar to that max value vs the max value of the chart data only.

### CSS for colors:
Each colored box next to the data name can be colored using css.

### Developer Details:
This stacked bar uses D3 to render the data visualization. The react component is just a wrapper that links to D3 by lifecycle events. 