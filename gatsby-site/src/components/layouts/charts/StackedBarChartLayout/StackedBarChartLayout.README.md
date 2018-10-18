---
title: Stacked Bar Chart Layout
componentName: StackedBarChartLayout
patternCategory: Layouts
---

```
<div style={{width: "300px"}}>
	<StackedBarChartLayout 

		chartTitle="Oil (bbl)"

		chartData={[
			{"Jan": [{"Federal onshore": 50, "Federal offshore": 100, "Native American":75}]},
			{"Feb": [{"Federal onshore": 10, "Federal offshore": 30, "Native American":15}]},
			{"Mar": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
			{"Apr": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
			{"May": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
			{"Jun": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
			{"Jul": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
			{"Aug": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
			{"Sep": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
			{"Oct": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
			{"Nov": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
			{"Dec": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
		]}

		defaultSelected={"Dec"}

		chartLegendHeader={["Source", "2017 (bbl)"]}

		chartLegendData={[{'Onshore':1257456, 'Offshore': 3454054, 'GOMESA':3256897}]}

		>
	</StackedBarChartLayout>
</div>


```

This layout includes a ChartTitle, StackedBarChart, Accordion and ChartLegendStandard components. 

It sets the height of the stacked bar chart using css. It also has a breakpoint for the chart legend to show an accordion at smaller screen sizes.
