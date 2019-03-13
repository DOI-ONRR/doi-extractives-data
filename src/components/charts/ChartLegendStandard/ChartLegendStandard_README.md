---
title: Chart Legend Standard
componentName: ChartLegendStandard
patternCategory: Charts
---

```
<div style={{width:"300px"}}>
	<ChartLegendStandard 
		header={["Source", "2017 (bbl)"]} 
		data={{'Onshore':1257456, 'Offshore': 3454054, 'GOMESA':3256897}} >
	</ChartLegendStandard>
</div>
```

This is the standard chart legend used on the site. 

## How to use

The legend can be used with any chart to display the values of each fo the data points with a calculated sum for the total. This component uses css modules and has default settings. 

### Chart Data:
This is an array of objects that will be used to populate the legend

### Display Names: 
The developer can specify a name to display other than the default key for the data

### Format Data Function:
You can pass a format function that will be applied to each data value in the chart data.

### CSS for colors:
This can be overriden by passing in a set of colors to be used with each key in the legend. 

